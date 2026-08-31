"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, Copy, Check, Users, MessageSquare, CalendarClock, Download, Hash, Drama } from "lucide-react"

export type WorldHeaderWorld = {
  id: string
  name: string
  inviteCode: string
  memberCount: number
  castCount: number
}

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
    <header className="flex flex-col gap-3 border-b border-line bg-surface/70 px-4 py-3 backdrop-blur md:flex-row md:items-center md:justify-between md:px-6">
      <div className="flex min-w-0 items-start gap-3">
        <Link
          href="/worlds"
          aria-label="Back to worlds"
          className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line text-muted transition hover:text-ink"
        >
          <ArrowLeft size={17} />
        </Link>

        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold tracking-tight text-ink">{world.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
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
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <a
          href={`/api/worlds/${world.id}/export?format=html`}
          className="flex items-center gap-2 rounded-xl border border-line px-4 py-2 text-sm font-medium text-ink transition hover:border-accent/50"
          title="Download this world as a readable transcript"
        >
          <Download size={15} /> Export
        </a>
        <button
          onClick={copyLink}
          className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-soft"
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? "Copied!" : "Copy Invite Link"}
        </button>
      </div>
    </header>
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
