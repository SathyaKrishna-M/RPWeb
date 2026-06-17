"use client"

import { Copy, Check, Users, MessageSquare, Calendar } from "lucide-react"
import { useState } from "react"

type WorldHeaderProps = {
  world: {
    name: string;
    inviteCode: string;
    _count: {
      messages: number;
      members: number;
    }
  };
  importDate?: Date | null;
}

export default function WorldHeader({ world, importDate }: WorldHeaderProps) {
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const inviteLink = typeof window !== "undefined" ? `${window.location.origin}/worlds/join?code=${world.inviteCode}` : ""

  const copyCode = () => {
    navigator.clipboard.writeText(world.inviteCode)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  return (
    <div className="border-b border-slate-800 bg-slate-900 px-6 py-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{world.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
              <span className="text-slate-500">Code:</span>
              <span className="font-mono text-indigo-400 font-medium">{world.inviteCode}</span>
              <button onClick={copyCode} className="ml-1 text-slate-500 hover:text-indigo-400" title="Copy Code">
                {copiedCode ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              </button>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Users size={16} className="text-slate-500" />
              <span>{world._count.members} Members</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <MessageSquare size={16} className="text-slate-500" />
              <span>{world._count.messages} Messages</span>
            </div>

            {importDate && (
              <div className="flex items-center gap-1.5 text-indigo-300">
                <Calendar size={16} />
                <span>Imported {importDate.toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex shrink-0">
          <button 
            onClick={copyLink}
            className="flex items-center gap-2 rounded-lg bg-indigo-600/10 px-4 py-2 text-sm font-semibold text-indigo-400 transition hover:bg-indigo-600/20"
          >
            {copiedLink ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            {copiedLink ? "Copied Link!" : "Copy Invite Link"}
          </button>
        </div>
      </div>
    </div>
  )
}
