"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  createMessage,
  fetchMessagesSince,
  fetchOlderMessages,
} from "@/server/actions/messages"
import type { SerializedMessage } from "@/lib/messages"
import WorldHeader, { type WorldHeaderWorld } from "./WorldHeader"
import { Send, User as UserIcon, ChevronDown, Loader2, CloudOff } from "lucide-react"

/**
 * How often to ask the server for new messages.
 *
 * Vercel runs no long-lived process, so there is no socket to push updates —
 * the chat pulls instead. The interval widens the longer nothing happens, which
 * keeps a forgotten open tab from holding the database awake and burning
 * through a free plan's compute allowance. Polling stops entirely while the tab
 * is hidden and resumes immediately when it is looked at again.
 */
const POLL_ACTIVE_MS = 3_000
const POLL_IDLE_MS = 15_000
const POLL_DORMANT_MS = 60_000
/** Quiet for this long -> widen the interval. */
const IDLE_AFTER_MS = 2 * 60_000
const DORMANT_AFTER_MS = 10 * 60_000

type ChatMessage = SerializedMessage

type CharacterDef = {
  id: string
  name: string
  avatarUrl: string | null
}

function hashHue(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash) % 360
}

const getCharacterColor = (id: string) => `hsl(${hashHue(id)}, 35%, 12%)`
const getCharacterBorder = (id: string) => `hsl(${hashHue(id)}, 50%, 25%)`

/** Merges incoming messages, dropping ids already present, keeping time order. */
function mergeMessages(existing: ChatMessage[], incoming: ChatMessage[]) {
  if (incoming.length === 0) return existing
  const seen = new Set(existing.map((m) => m.id))
  const additions = incoming.filter((m) => !seen.has(m.id))
  if (additions.length === 0) return existing
  return [...existing, ...additions].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  )
}

export default function ChatClient({
  initialMessages,
  initialHasOlder,
  initialMessageCount,
  world,
  importDate,
  worldId,
  myCharacter,
  allMyCharacters,
}: {
  initialMessages: ChatMessage[]
  initialHasOlder: boolean
  initialMessageCount: number
  world: WorldHeaderWorld
  importDate: string | null
  worldId: string
  myCharacter: CharacterDef
  allMyCharacters?: CharacterDef[]
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)

  // How many messages exist before the loaded window. The world total is then
  // derived as this plus what is loaded, which stays correct no matter how a
  // message arrives (own send or poll) and needs no increment bookkeeping that
  // could double-count the same message from two sources.
  const [olderNotLoaded, setOlderNotLoaded] = useState(
    Math.max(0, initialMessageCount - initialMessages.length)
  )
  const messageCount = olderNotLoaded + messages.length
  const [content, setContent] = useState("")
  const [syncFailing, setSyncFailing] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)

  const [hasOlder, setHasOlder] = useState(initialHasOlder)
  const [loadingOlder, setLoadingOlder] = useState(false)

  const availableCharacters = allMyCharacters?.length ? allMyCharacters : [myCharacter]
  const [activeCharacterId, setActiveCharacterId] = useState(myCharacter.id)
  const activeCharacter =
    availableCharacters.find((c) => c.id === activeCharacterId) || myCharacter

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const shouldAutoScrollRef = useRef(true)

  const knownIdsRef = useRef<Set<string>>(new Set(initialMessages.map((m) => m.id)))
  // Timestamp of the last time anything actually changed, used to widen the
  // polling interval when the world goes quiet. Seeded in the effect below
  // rather than here, because reading the clock during render is impure.
  const lastChangeRef = useRef(0)

  // The newest timestamp we hold, kept in a ref so the polling loop does not
  // depend on `messages` and get torn down and rebuilt on every keystroke.
  const latestTimestampRef = useRef<string | null>(
    initialMessages.length ? initialMessages[initialMessages.length - 1].timestamp : null
  )
  useEffect(() => {
    if (messages.length) {
      latestTimestampRef.current = messages[messages.length - 1].timestamp
    }
    knownIdsRef.current = new Set(messages.map((m) => m.id))
  }, [messages])

  /** Adds messages that arrived from a poll, ignoring ones already displayed. */
  const addIncoming = useCallback((incoming: ChatMessage[]) => {
    const additions = incoming.filter((m) => !knownIdsRef.current.has(m.id))
    if (!additions.length) return
    additions.forEach((m) => knownIdsRef.current.add(m.id))
    lastChangeRef.current = Date.now()
    setMessages((prev) => mergeMessages(prev, additions))
  }, [])

  /** Fetches anything written since the newest message on screen. */
  const catchUp = useCallback(async () => {
    const since = latestTimestampRef.current
    if (!since) return
    try {
      const missed = await fetchMessagesSince(worldId, since)
      addIncoming(missed)
      setSyncFailing(false)
    } catch (error) {
      console.error("Failed to fetch new messages", error)
      setSyncFailing(true)
    }
  }, [worldId, addIncoming])

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    let cancelled = false

    lastChangeRef.current = Date.now()

    const delay = () => {
      const quietFor = Date.now() - lastChangeRef.current
      if (quietFor > DORMANT_AFTER_MS) return POLL_DORMANT_MS
      if (quietFor > IDLE_AFTER_MS) return POLL_IDLE_MS
      return POLL_ACTIVE_MS
    }

    const tick = async () => {
      if (cancelled) return
      // A hidden tab has nobody reading it; skip the query entirely rather
      // than keeping the database awake for nothing.
      if (document.visibilityState === "visible") {
        await catchUp()
      }
      if (!cancelled) timer = setTimeout(tick, delay())
    }

    const onVisible = () => {
      if (document.visibilityState !== "visible") return
      // Catch up straight away instead of waiting out the current interval.
      if (timer) clearTimeout(timer)
      void tick()
    }

    document.addEventListener("visibilitychange", onVisible)
    timer = setTimeout(tick, POLL_ACTIVE_MS)

    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [catchUp])

  // Only pin to the bottom when the reader is already there, so loading older
  // messages or reading back doesn't yank them away.
  useEffect(() => {
    if (shouldAutoScrollRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    shouldAutoScrollRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120
  }

  const loadOlder = async () => {
    if (loadingOlder || !messages.length) return
    setLoadingOlder(true)
    const el = scrollRef.current
    const previousHeight = el?.scrollHeight ?? 0
    try {
      const { messages: older, hasMore } = await fetchOlderMessages(
        worldId,
        messages[0].timestamp
      )
      setHasOlder(hasMore)
      if (older.length) {
        setOlderNotLoaded((prev) => Math.max(0, prev - older.length))
        shouldAutoScrollRef.current = false
        setMessages((prev) => mergeMessages(older, prev))
        // Keep the reader's place instead of jumping to the top.
        requestAnimationFrame(() => {
          if (el) el.scrollTop = el.scrollHeight - previousHeight
        })
      }
    } catch (error) {
      console.error("Failed to load older messages", error)
    } finally {
      setLoadingOlder(false)
    }
  }

  const handleSend = async () => {
    const text = content.trim()
    if (!text) return

    const sendingCharacter = activeCharacter
    setContent("")
    setSendError(null)
    shouldAutoScrollRef.current = true

    const tempId = `temp-${Date.now()}-${Math.random()}`
    const optimisticMessage: ChatMessage = {
      id: tempId,
      worldId,
      content: text,
      format: "MIXED",
      timestamp: new Date().toISOString(),
      isImported: false,
      character: {
        id: sendingCharacter.id,
        name: sendingCharacter.name,
        avatarUrl: sendingCharacter.avatarUrl,
      },
    }
    setMessages((prev) => [...prev, optimisticMessage])
    lastChangeRef.current = Date.now()

    try {
      const saved = await createMessage(worldId, text, "MIXED", sendingCharacter.id)
      // Swap the placeholder for the stored row, and register the real id so a
      // poll that races the response does not add it a second time.
      knownIdsRef.current.add(saved.id)
      setMessages((prev) => mergeMessages(prev.filter((m) => m.id !== tempId), [saved]))
      knownIdsRef.current.delete(tempId)
    } catch (error) {
      console.error(error)
      setMessages((prev) => prev.filter((m) => m.id !== tempId))
      setContent(text)
      setSendError("Could not send that message. Check your connection and try again.")
    }
  }

  const renderContent = (msg: ChatMessage) => {
    if (msg.format === "DIALOGUE") {
      return (
        <p className="text-white italic text-lg leading-relaxed whitespace-pre-wrap">
          &ldquo;{msg.content}&rdquo;
        </p>
      )
    }
    if (msg.format === "ACTION") {
      return <p className="text-slate-300 italic whitespace-pre-wrap">*{msg.content}*</p>
    }
    if (msg.format === "THOUGHT") {
      return <p className="text-indigo-200 font-medium whitespace-pre-wrap">**{msg.content}**</p>
    }
    if (msg.format === "NARRATION" && !msg.content.match(/(".*?"|\*\*.*?\*\*|\*.*?\*)/)) {
      return <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
    }

    const regex = /("[\s\S]*?"|\*\*[\s\S]*?\*\*|\*[\s\S]*?\*)/g
    const parts = msg.content.split(regex)

    return (
      <p className="leading-relaxed whitespace-pre-wrap">
        {parts.map((part, i) => {
          if (!part) return null
          if (part.startsWith('"') && part.endsWith('"') && part.length >= 2) {
            return (
              <span key={i} className="text-white italic text-[1.05rem]">
                {part}
              </span>
            )
          }
          if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
            return (
              <span key={i} className="text-indigo-300 font-medium">
                {part}
              </span>
            )
          }
          if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
            return (
              <span key={i} className="text-slate-300 italic">
                {part}
              </span>
            )
          }
          return (
            <span key={i} className="text-slate-200">
              {part}
            </span>
          )
        })}
      </p>
    )
  }

  const getTags = (msg: ChatMessage) => {
    if (msg.format !== "MIXED" && msg.format !== "NARRATION") return [msg.format]

    const tags: string[] = []
    if (msg.content.includes('"')) tags.push("DIALOGUE")
    if (/\*\*[\s\S]+?\*\*/.test(msg.content)) tags.push("THOUGHT")
    // Check for *action* against the text with **thoughts** removed, so a
    // message containing both is tagged with both rather than only THOUGHT.
    const withoutThoughts = msg.content.replace(/\*\*[\s\S]+?\*\*/g, "")
    if (/\*[^*\n]+\*/.test(withoutThoughts)) tags.push("ACTION")
    return tags
  }

  return (
    <div className="flex h-full flex-col">
      <WorldHeader world={world} messageCount={messageCount} importDate={importDate} />

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950"
      >
        {hasOlder && (
          <div className="flex justify-center pb-2">
            <button
              onClick={loadOlder}
              disabled={loadingOlder}
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-50"
            >
              {loadingOlder && <Loader2 size={14} className="animate-spin" />}
              {loadingOlder ? "Loading..." : "Load earlier messages"}
            </button>
          </div>
        )}

        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center text-center">
            <div className="text-slate-500">
              <p className="text-lg font-medium text-slate-400">Nothing written yet.</p>
              <p className="mt-1 text-sm">Set the scene below to begin.</p>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => {
          const showHeader = idx === 0 || messages[idx - 1].character.id !== msg.character.id
          const tags = getTags(msg)

          return (
            <div
              key={msg.id}
              className={`flex gap-4 p-4 rounded-2xl border ${!showHeader ? "mt-1" : "mt-4"}`}
              style={{
                backgroundColor: getCharacterColor(msg.character.id),
                borderColor: getCharacterBorder(msg.character.id),
              }}
            >
              <div className="flex-shrink-0 w-10">
                {showHeader ? (
                  msg.character.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={msg.character.avatarUrl}
                      alt={msg.character.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 border border-slate-700">
                      <UserIcon size={20} className="text-slate-400" />
                    </div>
                  )
                ) : null}
              </div>
              <div className="flex-1 overflow-hidden">
                {showHeader && (
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-bold text-slate-100">{msg.character.name}</span>
                    <span className="text-xs font-medium text-slate-400">
                      {new Date(msg.timestamp).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {tags.length > 0 && (
                      <div className="flex gap-1 ml-1">
                        {tags.map((t) => (
                          <span
                            key={t}
                            className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-sm bg-slate-900 text-slate-400 border border-slate-700/50"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <div>{renderContent(msg)}</div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-slate-900 border-t border-slate-800 p-4">
        <div className="mx-auto max-w-4xl">
          {sendError && (
            <div className="mb-3 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400">
              {sendError}
            </div>
          )}

          <div className="mb-3 flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-4 text-xs font-medium text-slate-400 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
              <span className="text-white italic">&ldquo;dialogue&rdquo;</span>
              <span className="text-slate-300 italic">*action*</span>
              <span className="text-indigo-300 font-medium">**thought**</span>
              <span>narration</span>
            </div>

            <div className="flex items-center gap-3">
              {syncFailing && (
                <span
                  className="flex items-center gap-1.5 text-xs font-medium text-amber-400"
                  title="Cannot reach the server to check for new messages. It will keep retrying."
                >
                  <CloudOff size={14} /> Not syncing
                </span>
              )}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-400">Posting as:</span>
                <div className="relative">
                  <select
                    value={activeCharacterId}
                    onChange={(e) => setActiveCharacterId(e.target.value)}
                    className="appearance-none bg-slate-800 border border-slate-700 text-white text-sm font-medium rounded-full pl-3 pr-8 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {availableCharacters.map((char) => (
                      <option key={char.id} value={char.id}>
                        {char.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-end gap-2">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  void handleSend()
                }
              }}
              placeholder={`Write as ${activeCharacter.name}... (Shift+Enter for new line)`}
              className="w-full max-h-32 min-h-[3rem] resize-y rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              onClick={() => void handleSend()}
              disabled={!content.trim()}
              className="flex h-[3.25rem] w-[3.25rem] flex-shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg transition hover:bg-indigo-500 disabled:opacity-50"
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
