"use client"

import Link from "next/link"
import { useState } from "react"
import {
  ArrowLeft,
  Copy,
  Check,
  Users,
  MessageSquare,
  CalendarClock,
  Download,
  Hash,
  Drama,
  ChevronDown,
} from "lucide-react"

export type WorldHeaderWorld = {
  id: string
  name: string
  inviteCode: string
  memberCount: number
  castCount: number
}

/**
 * The bar above the chat.
 *
 * On a phone it is one line — back, the world's name, and a toggle — because
 * the counts and buttons were taking a third of the screen away from the
 * conversation. Tapping the toggle reveals them. On a wider screen there is
 * room for everything, so it is all shown at once.
 */
export default function WorldHeader({
  world,
  messageCount,
  importDate,
}: {
  world: WorldHeaderWorld
  messageCount: number
  importDate?: string | null
}) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/worlds/join?code=${world.inviteCode}`
      )
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard blocked; the code is visible in the panel regardless */
    }
  }

  return (
    <header className="shrink-0 border-b border-line bg-surface/70 backdrop-blur">
      <div className="flex items-center gap-2 px-3 py-2 md:gap-3 md:px-6 md:py-3">
        <Link
          href="/worlds"
          aria-label="Back to worlds"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line text-muted transition hover:text-ink"
        >
          <ArrowLeft size={17} />
        </Link>

        <h1 className="min-w-0 flex-1 truncate text-lg font-bold tracking-tight text-ink md:text-2xl">
          {world.name}
        </h1>

        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <ExportLink worldId={world.id} />
          <InviteButton copied={copied} onCopy={copyLink} />
        </div>

        <button
          type="button"
          onClick={() => setExpanded((o) => !o)}
          aria-expanded={expanded}
          aria-label={expanded ? "Hide world details" : "Show world details"}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line text-muted transition hover:text-ink md:hidden"
        >
          <ChevronDown
            size={17}
            className={`transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      <div
        className={`${expanded ? "block" : "hidden"} border-t border-line px-3 pb-3 pt-2.5 md:block md:border-t-0 md:px-6 md:pb-3 md:pt-0`}
      >
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
          <Pill icon={<Hash size={12} />}>
            Code: <span className="font-mono text-accent-soft">{world.inviteCode}</span>
          </Pill>
          <Pill icon={<Users size={12} />}>{world.memberCount} Members</Pill>
          <Pill icon={<Drama size={12} />}>{world.castCount} Characters</Pill>
          <Pill icon={<MessageSquare size={12} />}>{messageCount} Messages</Pill>
          {importDate && (
            <Pill icon={<CalendarClock size={12} />}>
              Imported {new Date(importDate).toLocaleDateString()}
            </Pill>
          )}
        </div>

        {/* The actions live in the header row on a wider screen. */}
        <div className="mt-2.5 flex items-center gap-2 md:hidden">
          <ExportLink worldId={world.id} />
          <InviteButton copied={copied} onCopy={copyLink} />
        </div>
      </div>
    </header>
  )
}

function ExportLink({ worldId }: { worldId: string }) {
  return (
    <a
      href={`/api/worlds/${worldId}/export?format=html`}
      className="flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm font-medium text-ink transition hover:border-accent/50 md:px-4"
      title="Download this world as a readable transcript"
    >
      <Download size={15} /> Export
    </a>
  )
}

function InviteButton({ copied, onCopy }: { copied: boolean; onCopy: () => void }) {
  return (
    <button
      onClick={onCopy}
      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-white transition hover:bg-accent-soft md:flex-none md:px-4"
    >
      {copied ? <Check size={15} /> : <Copy size={15} />}
      {copied ? "Copied!" : "Copy Invite Link"}
    </button>
  )
}

function Pill({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1.5 rounded-lg border border-line bg-elevated/60 px-2.5 py-1">
      <span className="text-muted">{icon}</span>
      {children}
    </span>
  )
}
