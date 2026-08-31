"use client"

import { useState } from "react"
import { Loader2, User as UserIcon } from "lucide-react"
import { CHARACTER_COLORS, fallbackColor } from "@/lib/characters"

export type CharacterDefaults = {
  id?: string
  name: string
  title: string
  avatarUrl: string
  color: string
  bio: string
}

/**
 * Create/edit form for a character, with the appearance shown as you change it.
 *
 * A character's look is shared: everyone in a world sees the same avatar and
 * colour, so the preview is what the other writer will see too.
 */
export default function CharacterForm({
  action,
  defaults,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>
  defaults: CharacterDefaults
  submitLabel: string
}) {
  const [name, setName] = useState(defaults.name)
  const [title, setTitle] = useState(defaults.title)
  const [avatarUrl, setAvatarUrl] = useState(defaults.avatarUrl)
  const [color, setColor] = useState(defaults.color)
  const [pending, setPending] = useState(false)

  const shown = color || fallbackColor(defaults.id ?? (name || "new"))

  return (
    <form
      action={async (formData) => {
        setPending(true)
        try {
          await action(formData)
        } finally {
          setPending(false)
        }
      }}
      className="space-y-6"
    >
      <section className="flex items-center gap-4 rounded-2xl border border-line bg-canvas p-4">
        <Preview name={name} avatarUrl={avatarUrl} color={shown} />
        <div className="min-w-0">
          <div className="truncate text-lg font-semibold" style={{ color: shown }}>
            {name || "Unnamed character"}
          </div>
          <div className="truncate text-sm text-muted">{title || "No title"}</div>
          <div className="mt-1 text-[11px] text-muted">
            This is how everyone in the world sees them.
          </div>
        </div>
      </section>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" required>
          <input
            name="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Title" hint="Shown under the name, e.g. “Queen of Velmora”">
          <input
            name="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Optional"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Avatar image URL" hint="Paste a link to an image. Left empty, the initial is used.">
        <input
          name="avatarUrl"
          type="url"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="https://..."
          className={inputClass}
        />
      </Field>

      <Field label="Colour" hint="Used for their name and the bar beside their messages.">
        {/* The value the server reads; the swatches and picker both drive it. */}
        <input type="hidden" name="color" value={color} />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {CHARACTER_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={c}
              aria-pressed={color === c}
              onClick={() => setColor(c)}
              style={{ backgroundColor: c }}
              className={`h-8 w-8 rounded-full transition ${
                color === c ? "ring-2 ring-ink ring-offset-2 ring-offset-surface" : "hover:scale-110"
              }`}
            />
          ))}

          <label className="ml-1 flex items-center gap-2 rounded-lg border border-line px-2.5 py-1.5 text-xs text-muted">
            Custom
            <input
              type="color"
              value={color || "#7dd3fc"}
              onChange={(e) => setColor(e.target.value)}
              className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
            />
          </label>

          {color && (
            <button
              type="button"
              onClick={() => setColor("")}
              className="rounded-lg border border-line px-2.5 py-1.5 text-xs text-muted hover:text-ink"
            >
              Reset
            </button>
          )}
        </div>
      </Field>

      <Field label="Bio">
        <textarea name="bio" rows={4} defaultValue={defaults.bio} className={inputClass} />
      </Field>

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-8 py-3.5 text-base font-bold text-white shadow-lg transition hover:bg-accent-soft disabled:opacity-50"
      >
        {pending && <Loader2 size={17} className="animate-spin" />}
        {submitLabel}
      </button>
    </form>
  )
}

const inputClass =
  "mt-2 block w-full rounded-xl border border-line bg-canvas px-4 py-3 text-sm text-ink placeholder-muted focus:border-accent focus:outline-none"

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink">
        {label}
        {!required && <span className="ml-1 text-xs font-normal text-muted">(optional)</span>}
      </span>
      {hint && <span className="mt-0.5 block text-xs text-muted">{hint}</span>}
      {children}
    </label>
  )
}

function Preview({
  name,
  avatarUrl,
  color,
}: {
  name: string
  avatarUrl: string
  color: string
}) {
  const ring = { boxShadow: `0 0 0 2px ${color}` }
  if (avatarUrl) {
    return (
      // Avatars are arbitrary user-supplied URLs, which next/image's host
      // allowlist would reject.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt=""
        style={ring}
        className="h-16 w-16 shrink-0 rounded-full object-cover"
      />
    )
  }
  return (
    <span
      style={ring}
      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-elevated text-xl font-semibold"
    >
      {name.trim() ? name.trim().charAt(0).toUpperCase() : <UserIcon size={22} className="text-muted" />}
    </span>
  )
}
