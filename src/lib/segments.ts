/**
 * Splits a message into typed segments so a single post can mix speech, action
 * and thought — which is how roleplay is actually written.
 *
 * The markers are the ones already used in this app and in Telegram exports:
 *
 *   "spoken"      dialogue
 *   *performed*   action
 *   **thought**   thought
 *   anything else narration
 *
 * Imported history uses straight quotes and no asterisks at all, so treating
 * asterisks as meaningful cannot change how existing messages read.
 */

export const SEGMENT_TYPES = ["DIALOGUE", "ACTION", "THOUGHT", "NARRATION"] as const
export type SegmentType = (typeof SEGMENT_TYPES)[number]

export type Segment = { type: SegmentType; text: string }
/** One source line, with its parts and the marked types it contains. */
export type MessageLine = { segments: Segment[]; types: SegmentType[] }

/** Presentation for each type, shared by the renderer and the composer. */
export const SEGMENT_STYLE: Record<
  SegmentType,
  { label: string; text: string; chip: string; rail: string; hint: string }
> = {
  DIALOGUE: {
    label: "dialogue",
    text: "text-sky-200 italic",
    chip: "border-sky-400/30 bg-sky-400/10 text-sky-300",
    rail: "#7dd3fc",
    hint: 'Wraps the selection in "quotes"',
  },
  ACTION: {
    label: "action",
    text: "text-emerald-200/90 italic",
    chip: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    rail: "#6ee7b7",
    hint: "Wraps the selection in *asterisks*",
  },
  THOUGHT: {
    label: "thought",
    text: "text-violet-300 italic",
    chip: "border-violet-400/30 bg-violet-400/10 text-violet-300",
    rail: "#a78bfa",
    hint: "Wraps the selection in **double asterisks**",
  },
  NARRATION: {
    label: "narration",
    text: "text-ink",
    chip: "border-line bg-elevated text-muted",
    rail: "#3f3f5a",
    hint: "Plain text, no markers",
  },
}

/** The characters that mark each type, used to wrap a selection. */
export const SEGMENT_MARKERS: Record<Exclude<SegmentType, "NARRATION">, [string, string]> = {
  DIALOGUE: ['"', '"'],
  THOUGHT: ["**", "**"],
  ACTION: ["*", "*"],
}

// Order matters: ** must be tried before a single *, or a thought would be
// read as two empty actions. Curly quotes appear in text pasted from phones.
const SEGMENT_PATTERN =
  /("[^"\n]*"|“[^”\n]*”|\*\*[^*\n]+\*\*|\*[^*\n]+\*)/g

function classify(part: string): SegmentType {
  if (/^\*\*[\s\S]+\*\*$/.test(part)) return "THOUGHT"
  if (/^\*[\s\S]+\*$/.test(part)) return "ACTION"
  if (/^["“][\s\S]*["”]$/.test(part)) return "DIALOGUE"
  return "NARRATION"
}

/** Strips the markers, leaving the words. Quotes are kept — they read as speech. */
function unwrap(part: string, type: SegmentType) {
  if (type === "THOUGHT") return part.slice(2, -2).trim()
  if (type === "ACTION") return part.slice(1, -1).trim()
  return part
}

function parseLine(line: string): MessageLine {
  const segments: Segment[] = []

  for (const part of line.split(SEGMENT_PATTERN)) {
    if (!part) continue
    const type = classify(part)
    const text = unwrap(part, type)
    if (!text.trim()) continue

    const last = segments.at(-1)
    // Run narration together so ordinary prose is not chopped into fragments.
    if (last && last.type === "NARRATION" && type === "NARRATION") {
      last.text += part
    } else {
      segments.push({ type, text })
    }
  }

  const types = [...new Set(segments.map((s) => s.type))].filter(
    (t): t is SegmentType => t !== "NARRATION"
  )
  return { segments, types }
}

/**
 * Parses a whole message, one entry per source line.
 *
 * Lines are kept because roleplay is written line by line — a line is usually
 * one beat, which is what the reader wants labelled.
 */
export function parseMessage(content: string): MessageLine[] {
  return content
    .split("\n")
    .map(parseLine)
    .filter((line) => line.segments.length > 0)
}

/** Every marked type present anywhere in the message, for the header tags. */
export function messageTypes(content: string): SegmentType[] {
  const seen = new Set<SegmentType>()
  for (const line of parseMessage(content)) {
    for (const t of line.types) seen.add(t)
  }
  return SEGMENT_TYPES.filter((t) => seen.has(t))
}

export function hasMarkers(content: string) {
  return messageTypes(content).length > 0
}
