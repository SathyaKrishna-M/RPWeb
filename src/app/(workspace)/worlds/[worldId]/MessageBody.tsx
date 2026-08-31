"use client"

import { parseMessage, SEGMENT_STYLE, type SegmentType } from "@/lib/segments"

/**
 * Renders a message so the kind of each line is obvious at a glance.
 *
 * Each line gets a label in a left gutter naming what it is — dialogue, action
 * or thought — and the words themselves are coloured to match. Plain narration
 * is left unlabelled, because it is the default voice and labelling every line
 * would be noise rather than help.
 *
 * A line that mixes kinds (`She smiled "hello"`) keeps its words in one flowing
 * line, coloured per part, rather than being chopped into separate blocks.
 */
export default function MessageBody({
  content,
  explicitType,
}: {
  content: string
  /**
   * Set when a message was stored as a single kind and holds no markers of its
   * own — messages written before the composer could mix kinds in one post.
   */
  explicitType?: SegmentType
}) {
  const lines = parseMessage(content)

  if (explicitType && lines.every((l) => l.types.length === 0)) {
    return (
      <div className="space-y-1">
        {lines.map((line, i) => (
          <Line key={i} labels={[explicitType]}>
            <span className={SEGMENT_STYLE[explicitType].text}>
              {line.segments.map((s) => s.text).join("")}
            </span>
          </Line>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {lines.map((line, i) => (
        <Line key={i} labels={line.types}>
          {line.segments.map((seg, j) => (
            <span key={j} className={SEGMENT_STYLE[seg.type].text}>
              {seg.text}
            </span>
          ))}
        </Line>
      ))}
    </div>
  )
}

function Line({ labels, children }: { labels: SegmentType[]; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
      <span className="flex shrink-0 flex-wrap gap-1 sm:w-[74px] sm:justify-end">
        {labels.map((t) => (
          <span
            key={t}
            className={`rounded border px-1.5 py-px text-[9px] font-bold uppercase tracking-wider ${SEGMENT_STYLE[t].chip}`}
          >
            {SEGMENT_STYLE[t].label}
          </span>
        ))}
      </span>
      <p className="min-w-0 flex-1 whitespace-pre-wrap break-words leading-relaxed">{children}</p>
    </div>
  )
}
