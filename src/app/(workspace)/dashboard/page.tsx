import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Plus, LogOut } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const characters = await prisma.character.findMany({
    where: { userId: session.user.id }
  })

  if (characters.length === 0) {
    redirect("/characters/new")
  }

  const activeCharacter = characters[0] // Simple MVP: just use the first character

  const worlds = await prisma.world.findMany({
    where: {
      members: {
        some: { userId: session.user.id }
      }
    }
  })

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Worlds</h1>
          <p className="text-slate-400">Playing as {activeCharacter.name}</p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/worlds/new"
            className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500"
          >
            <Plus size={16} /> Create World
          </Link>
          <Link
            href="/worlds/join"
            className="flex items-center gap-2 rounded-md bg-slate-800 px-4 py-2 text-sm font-medium hover:bg-slate-700"
          >
            Join World
          </Link>
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-2 rounded-md border border-slate-700 bg-transparent px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800"
          >
            <LogOut size={16} />
          </Link>
        </div>
      </div>

      {worlds.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/50 p-12 text-center">
          <h3 className="text-lg font-medium text-white">No worlds yet</h3>
          <p className="mt-2 text-slate-400">Create a new world or join an existing one to start roleplaying.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {worlds.map((world) => (
            <Link
              key={world.id}
              href={`/worlds/${world.id}`}
              className="block rounded-xl border border-slate-800 bg-slate-900 p-6 transition hover:border-indigo-500/50 hover:bg-slate-800/50"
            >
              <h3 className="text-lg font-semibold text-indigo-400">{world.name}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                {world.description || "No description provided."}
              </p>
              <div className="mt-4 text-xs text-slate-500">
                Created {world.createdAt.toLocaleDateString()}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
