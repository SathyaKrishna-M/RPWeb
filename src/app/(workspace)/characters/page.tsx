import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Plus, User } from "lucide-react"

export default async function CharactersPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const characters = await prisma.character.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="mx-auto max-w-5xl p-6 lg:p-10">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Your Characters</h1>
          <p className="text-slate-400 mt-1">Manage your identities across the multiverse.</p>
        </div>
        <Link
          href="/characters/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          <Plus size={18} /> Create Character
        </Link>
      </div>

      {characters.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800">
            <User size={32} className="text-slate-400" />
          </div>
          <h3 className="text-xl font-medium text-white">No characters yet</h3>
          <p className="mt-2 text-slate-400">Create your first character to start roleplaying.</p>
          <Link
            href="/characters/new"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            Create Character
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {characters.map((char) => (
            <div
              key={char.id}
              className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-700 hover:bg-slate-800/50"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 shrink-0 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                  {char.avatarUrl ? (
                    <img src={char.avatarUrl} alt={char.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-bold text-indigo-400">
                      {char.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{char.name}</h3>
                  <div className="text-xs text-slate-500">
                    Created {new Date(char.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <p className="line-clamp-3 text-sm text-slate-400 leading-relaxed">
                {char.bio || "No bio provided."}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
