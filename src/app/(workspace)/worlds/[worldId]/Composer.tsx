"use client"

import { useRef, useState } from "react"
import {
  Send,
  Bold,
  Italic,
  Strikethrough,
  Quote,
  Link2,
  ImageIcon,
  Smile,
  ChevronDown,
  Loader2,
} from "lucide-react"
import { Avatar } from "@/components/layout/Sidebar"
import { MESSAGE_FORMATS, type MessageFormat } from "@/lib/messages"

export type ComposerCharacter = {
  id: string
  name: string
  avatarUrl: string | null
}

const FORMAT_LABELS: Record<MessageFormat, string> = {
  DIALOGUE: "dialogue",
  ACTION: "action",
  THOUGHT: "thought",
  NARRATION: "narration",
}

/** Characters wrapped around a selection by the toolbar buttons. */
const WRAPPERS = {
  bold: ["**", "**"],
  italic: ["*", "*"],
  strike: ["~~", "~~"],
  quote: ['"', '"'],
} as const

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
  onSend: (content: string, format: MessageFormat) => Promise<void>
  disabled?: boolean
}) {
  const [content, setContent] = useState("")
  const [format, setFormat] = useState<MessageFormat>("NARRATION")
  const [sending, setSending] = useState(false)
  const [emojiOpen, setEmojiOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const active =
    characters.find((c) => c.id === activeCharacterId) ?? characters[0] ?? null

  /** Wraps the current selection, or inserts the markers at the caret. */
  const wrap = (kind: keyof typeof WRAPPERS) => {
    const el = textareaRef.current
    if (!el) return
    const [open, close] = WRAPPERS[kind]
    const { selectionStart: start, selectionEnd: end } = el
    const selected = content.slice(start, end)
    const next = content.slice(0, start) + open + selected + close + content.slice(end)
    setContent(next)
    // Put the caret inside the markers so typing continues in the new style.
    requestAnimationFrame(() => {
      el.focus()
      const caret = start + open.length + selected.length
      el.setSelectionRange(selected ? caret + close.length : caret, selected ? caret + close.length : caret)
    })
  }

  const insert = (text: string) => {
    const el = textareaRef.current
    if (!el) {
      setContent((c) => c + text)
      return
    }
    const { selectionStart: start, selectionEnd: end } = el
    const next = content.slice(0, start) + text + content.slice(end)
    setContent(next)
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
      await onSend(text, format)
    } catch {
      // Put the text back so nothing is lost when a send fails.
      setContent(previous)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="border-t border-line bg-surface/70 px-4 py-3 backdrop-blur md:px-6">
      <div className="mx-auto max-w-4xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {MESSAGE_FORMATS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFormat(f)}
                aria-pressed={format === f}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  format === f
                    ? "border-accent bg-accent/20 text-accent-soft"
                    : "border-line text-muted hover:text-ink"
                }`}
              >
                {FORMAT_LABELS[f]}
              </button>
            ))}
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
                <ChevronDown
                  size={12}
                  className="pointer-events-none absolute right-2 text-muted"
                />
              </span>
            </label>
          )}
        </div>

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
              <ToolButton label="Bold" onClick={() => wrap("bold")}>
                <Bold size={15} />
              </ToolButton>
              <ToolButton label="Italic" onClick={() => wrap("italic")}>
                <Italic size={15} />
              </ToolButton>
              <ToolButton label="Strikethrough" onClick={() => wrap("strike")}>
                <Strikethrough size={15} />
              </ToolButton>
              <ToolButton label="Quote" onClick={() => wrap("quote")}>
                <Quote size={15} />
              </ToolButton>
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
