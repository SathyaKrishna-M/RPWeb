"use client"

import { useRef, useState } from "react"
import { Send, Link2, ImageIcon, Smile, ChevronDown, Loader2, Eye } from "lucide-react"
import { Avatar } from "@/components/layout/Sidebar"
import { SEGMENT_MARKERS, SEGMENT_STYLE, hasMarkers } from "@/lib/segments"
import MessageBody from "./MessageBody"

export type ComposerCharacter = {
  id: string
  name: string
  avatarUrl: string | null
}

/** The kinds that can be applied to a selection. Narration is the absence of one. */
const APPLICABLE = ["DIALOGUE", "ACTION", "THOUGHT"] as const

const EMOJI = ["😊", "😢", "😠", "😅", "❤️", "🔥", "✨", "🗡️", "🌙", "👀", "😱", "🙏"]

export default function Composer({
  characters,
  activeCharacterId,
  onChangeCharacter,
  onSend,
  disabled,
}: {
  characters: ComposerCharacter[]
  activeCharacterId: string
  onChangeCharacter: (id: string) => void
  onSend: (content: string) => Promise<void>
  disabled?: boolean
}) {
  const [content, setContent] = useState("")
  const [sending, setSending] = useState(false)
  const [emojiOpen, setEmojiOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const active = characters.find((c) => c.id === activeCharacterId) ?? characters[0] ?? null
  const showPreview = hasMarkers(content)

  /**
   * Wraps the selected words in a kind's markers.
   *
   * With nothing selected it inserts the markers and puts the caret between
   * them, so the next thing typed lands inside.
   */
  const apply = (kind: (typeof APPLICABLE)[number]) => {
    const el = textareaRef.current
    if (!el) return
    const [open, close] = SEGMENT_MARKERS[kind]
    const { selectionStart: start, selectionEnd: end } = el
    const selected = content.slice(start, end)

    setContent(content.slice(0, start) + open + selected + close + content.slice(end))
    requestAnimationFrame(() => {
      el.focus()
      const caret = selected
        ? start + open.length + selected.length + close.length
        : start + open.length
      el.setSelectionRange(caret, caret)
    })
  }

  const insert = (text: string) => {
    const el = textareaRef.current
    if (!el) {
      setContent((c) => c + text)
      return
    }
    const { selectionStart: start, selectionEnd: end } = el
    setContent(content.slice(0, start) + text + content.slice(end))
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(start + text.length, start + text.length)
    })
  }

  const send = async () => {
    const text = content.trim()
    if (!text || sending) return
    setSending(true)
    const previous = content
    setContent("")
    try {
      await onSend(text)
    } catch {
      // Put the words back so nothing is lost when a send fails.
      setContent(previous)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="border-t border-line bg-surface/70 px-4 py-3 backdrop-blur md:px-6">
      <div className="mx-auto max-w-4xl space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-[11px] text-muted">Mark as:</span>
            {APPLICABLE.map((kind) => (
              <button
                key={kind}
                type="button"
                onClick={() => apply(kind)}
                title={SEGMENT_STYLE[kind].hint}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition hover:brightness-125 ${SEGMENT_STYLE[kind].chip}`}
              >
                {SEGMENT_STYLE[kind].label}
              </button>
            ))}
            <span className="ml-1 hidden text-[11px] text-muted sm:inline">
              select words, or click then type
            </span>
          </div>

          {characters.length > 0 && (
            <label className="flex items-center gap-2 text-xs text-muted">
              Posting as:
              <span className="relative flex items-center gap-2 rounded-full border border-line bg-elevated py-1 pl-1 pr-2">
                {active && <Avatar name={active.name} src={active.avatarUrl} size={22} />}
                <select
                  value={activeCharacterId}
                  onChange={(e) => onChangeCharacter(e.target.value)}
                  className="appearance-none bg-transparent pr-4 text-xs font-medium text-ink focus:outline-none"
                >
                  {characters.map((c) => (
                    <option key={c.id} value={c.id} className="bg-elevated">
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={12} className="pointer-events-none absolute right-2 text-muted" />
              </span>
            </label>
          )}
        </div>

        {showPreview && (
          <div className="rounded-xl border border-line bg-canvas/60 px-3 py-2">
            <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
              <Eye size={11} /> How it will look
            </div>
            <MessageBody content={content} />
          </div>
        )}

        <div className="rounded-2xl border border-line bg-canvas focus-within:border-accent/60">
          <textarea
            ref={textareaRef}
            value={content}
            disabled={disabled}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                void send()
              }
            }}
            rows={3}
            placeholder={
              active ? `Write as ${active.name}... (Shift + Enter for new line)` : "Write..."
            }
            className="w-full resize-y bg-transparent p-3 text-sm text-ink placeholder-muted focus:outline-none"
          />

          <div className="flex items-center justify-between gap-2 border-t border-line px-2 py-1.5">
            <div className="flex items-center gap-0.5">
              <ToolButton label="Link" onClick={() => insert("[text](https://)")}>
                <Link2 size={15} />
              </ToolButton>
              <ToolButton label="Image URL" onClick={() => insert("![](https://)")}>
                <ImageIcon size={15} />
              </ToolButton>
              <div className="relative">
                <ToolButton label="Emoji" onClick={() => setEmojiOpen((o) => !o)}>
                  <Smile size={15} />
                </ToolButton>
                {emojiOpen && (
                  <>
                    <button
                      className="fixed inset-0 z-10 cursor-default"
                      aria-label="Close emoji picker"
                      onClick={() => setEmojiOpen(false)}
                    />
                    <div className="absolute bottom-full left-0 z-20 mb-2 grid w-56 grid-cols-6 gap-1 rounded-xl border border-line bg-elevated p-2 shadow-xl">
                      {EMOJI.map((e) => (
                        <button
                          key={e}
                          type="button"
                          onClick={() => {
                            insert(e)
                            setEmojiOpen(false)
                          }}
                          className="rounded-lg p-1.5 text-lg transition hover:bg-surface"
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={() => void send()}
              disabled={!content.trim() || sending || disabled}
              aria-label="Send message"
              className="flex h-10 w-12 items-center justify-center rounded-xl bg-accent text-white transition hover:bg-accent-soft disabled:opacity-40"
            >
              {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ToolButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="rounded-lg p-2 text-muted transition hover:bg-elevated hover:text-ink"
    >
      {children}
    </button>
  )
}
