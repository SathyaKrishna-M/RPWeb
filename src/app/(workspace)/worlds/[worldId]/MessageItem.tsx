"use client"

import { useState } from "react"
import { Crown, MoreHorizontal, Pencil, Trash2, X, Check, Loader2 } from "lucide-react"
import { Avatar } from "@/components/layout/Sidebar"
import { characterHue, LEGACY_MIXED_FORMAT, type SerializedMessage } from "@/lib/messages"

/**
 * Renders the body of a message.
 *
 * Newer messages carry an explicit format chosen in the composer. Imported and
 * older ones are stored as NARRATION or MIXED with the styling implied by
 * punctuation, so those are still parsed inline for `"dialogue"`, `*action*`
 * and `**thought**`.
 */
function Body({ message }: { message: SerializedMessage }) {
  const { format, content } = message

  if (format === "DIALOGUE") {
    return (
      <p className="text-[15px] italic leading-relaxed text-ink">
        &ldquo;{content}&rdquo;
      </p>
    )
  }
  if (format === "ACTION") {
    return <p className="leading-relaxed italic text-muted">{content}</p>
  }
  if (format === "THOUGHT") {
    return <p className="leading-relaxed font-medium text-accent-soft">{content}</p>
  }
  if (format === "NARRATION" && !/(".*?"|\*\*.*?\*\*|\*.*?\*)/.test(content)) {
    return <p className="leading-relaxed text-ink">{content}</p>
  }
  if (format !== LEGACY_MIXED_FORMAT && format !== "NARRATION") {
    return <p className="leading-relaxed text-ink">{content}</p>
  }

  const parts = content.split(/("[\s\S]*?"|\*\*[\s\S]*?\*\*|\*[\s\S]*?\*)/g)
  return (
    <p className="leading-relaxed">
      {parts.map((part, i) => {
        if (!part) return null
        if (part.startsWith('"') && part.endsWith('"') && part.length >= 2) {
          return (
            <span key={i} className="text-[15px] italic text-ink">
              {part}
            </span>
          )
        }
        if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
          return (
            <span key={i} className="font-medium text-accent-soft">
              {part.slice(2, -2)}
            </span>
          )
        }
        if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
          return (
            <span key={i} className="italic text-muted">
              {part.slice(1, -1)}
            </span>
          )
        }
        return (
          <span key={i} className="text-ink">
            {part}
          </span>
        )
      })}
    </p>
  )
}

/** Tags shown next to the name, describing what the line contains. */
function tagsFor(message: SerializedMessage) {
  const { format, content } = message
  if (format !== LEGACY_MIXED_FORMAT && format !== "NARRATION") return [format]

  const tags: string[] = []
  if (content.includes('"')) tags.push("DIALOGUE")
  if (/\*\*[\s\S]+?\*\*/.test(content)) tags.push("THOUGHT")
  // Test for *action* against the text with **thoughts** removed, so a line
  // holding both is tagged with both rather than only THOUGHT.
  if (/\*[^*\n]+\*/.test(content.replace(/\*\*[\s\S]+?\*\*/g, ""))) tags.push("ACTION")
  return tags
}

export default function MessageItem({
  message,
  showHeader,
  isOwner,
  canManage,
  onEdit,
  onDelete,
}: {
  message: SerializedMessage
  showHeader: boolean
  isOwner: boolean
  canManage: boolean
  onEdit: (id: string, content: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(message.content)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hue = characterHue(message.character.id)
  const accent = `hsl(${hue}, 70%, 66%)`
  const tags = tagsFor(message)

  const submitEdit = async () => {
    if (!draft.trim() || draft === message.content) {
      setEditing(false)
      setDraft(message.content)
      return
    }
    setBusy(true)
    setError(null)
    try {
      await onEdit(message.id, draft)
      setEditing(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save the edit")
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    setBusy(true)
    setMenuOpen(false)
    try {
      await onDelete(message.id)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete")
      setBusy(false)
    }
  }

  return (
    <div
      className={`msg-row group relative flex gap-3 rounded-2xl border border-line bg-surface/60 px-4 py-3 ${
        showHeader ? "mt-3" : "mt-1"
      }`}
      style={{ borderLeft: `3px solid ${accent}` }}
    >
      <div className="w-10 shrink-0">
        {showHeader && (
          <Avatar name={message.character.name} src={message.character.avatarUrl} size={40} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        {showHeader && (
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold" style={{ color: accent }}>
              {message.character.name}
            </span>
            {isOwner && <Crown size={12} className="text-amber-400" />}
            <span className="text-xs text-muted">
              {new Date(message.timestamp).toLocaleString([], {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {message.editedAt && <span className="text-[11px] text-muted">(edited)</span>}
            {tags.map((t) => (
              <span
                key={t}
                className="rounded border border-line bg-elevated px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {editing ? (
          <div className="space-y-2">
            <textarea
              value={draft}
              autoFocus
              rows={Math.min(10, draft.split("\n").length + 1)}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setEditing(false)
                  setDraft(message.content)
                }
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  void submitEdit()
                }
              }}
              className="w-full resize-y rounded-xl border border-line bg-canvas p-3 text-sm text-ink focus:border-accent focus:outline-none"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => void submitEdit()}
                disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-soft disabled:opacity-50"
              >
                {busy ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                Save
              </button>
              <button
                onClick={() => {
                  setEditing(false)
                  setDraft(message.content)
                }}
                className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-muted hover:text-ink"
              >
                Cancel
              </button>
              <span className="text-[11px] text-muted">Enter saves, Esc cancels</span>
            </div>
          </div>
        ) : (
          <div className="whitespace-pre-wrap break-words">
            <Body message={message} />
          </div>
        )}

        {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
      </div>

      {canManage && !editing && (
        <div className="msg-actions absolute right-3 top-2 flex items-center gap-1">
          <button
            onClick={() => {
              setEditing(true)
              setMenuOpen(false)
            }}
            title="Edit"
            className="rounded-lg border border-line bg-surface p-1.5 text-muted transition hover:text-ink"
          >
            <Pencil size={13} />
          </button>
          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              title="More"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="rounded-lg border border-line bg-surface p-1.5 text-muted transition hover:text-ink"
            >
              <MoreHorizontal size={13} />
            </button>
            {menuOpen && (
              <>
                {/* Click-away layer, so the menu closes without a document listener. */}
                <button
                  className="fixed inset-0 z-10 cursor-default"
                  aria-label="Close menu"
                  onClick={() => setMenuOpen(false)}
                />
                <div
                  role="menu"
                  className="absolute right-0 z-20 mt-1 w-36 overflow-hidden rounded-xl border border-line bg-elevated shadow-xl"
                >
                  <button
                    role="menuitem"
                    onClick={() => void remove()}
                    disabled={busy}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                  >
                    <Trash2 size={13} /> Delete message
                  </button>
                  <button
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-muted transition hover:bg-surface"
                  >
                    <X size={13} /> Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
