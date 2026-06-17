"use client"

import { createCharacter } from "@/server/actions/characters"
import { useActionState } from "react"
import { useRouter } from "next/navigation"

export default function NewCharacterPage() {
  const router = useRouter()
  // Since we use server actions directly in form action, we can just let it redirect.
  // Or we can wrap it if we want loading state. For simplicity, native form action is fine.

  return (
    <div className="mx-auto max-w-2xl p-6 mt-12">
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-white">Who are you in this universe?</h1>
        <p className="mt-2 text-slate-400">Create your first character to continue.</p>

        <form action={createCharacter} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300">Character Name</label>
              <input
                name="name"
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-300">Avatar URL (Optional)</label>
              <input
                name="avatarUrl"
                type="url"
                placeholder="https://..."
                className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300">Bio (Optional)</label>
              <textarea
                name="bio"
                rows={4}
                className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            Create Character
          </button>
        </form>
      </div>
    </div>
  )
}
