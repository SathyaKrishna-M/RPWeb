/** Colour handling for characters, shared by the forms and the chat. */

/** Offered as swatches. Chosen to stay legible on the dark canvas. */
export const CHARACTER_COLORS = [
  "#7dd3fc", // sky
  "#6ee7b7", // emerald
  "#a78bfa", // violet
  "#fca5a5", // rose
  "#fcd34d", // amber
  "#f9a8d4", // pink
  "#5eead4", // teal
  "#c4b5fd", // lavender
  "#fdba74", // orange
  "#93c5fd", // blue
] as const

const HEX = /^#[0-9a-f]{6}$/i

/** Accepts `#rrggbb` (any case) and rejects anything else, including empty. */
export function normalizeColor(value: string | null | undefined): string | null {
  const trimmed = value?.trim()
  if (!trimmed) return null
  if (!HEX.test(trimmed)) throw new Error("Colour must be a hex value like #7dd3fc")
  return trimmed.toLowerCase()
}

/** A stable hue per id, used when a character has no colour of its own. */
export function fallbackColor(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash)
  }
  return `hsl(${Math.abs(hash) % 360}, 70%, 66%)`
}

export function characterColor(character: { id: string; color?: string | null }) {
  return character.color ?? fallbackColor(character.id)
}
