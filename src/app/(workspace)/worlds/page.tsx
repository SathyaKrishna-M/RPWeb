import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Plus, Globe, Users } from "lucide-react"

export default async function WorldsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const worlds = await prisma.world.findMany({
    where: {
      members: {
        some: { userId: session.user.id }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="mx-auto max-w-5xl p-6 lg:p-10">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Your Worlds</h1>
          <p className="text-muted mt-1">Explore the universes you are part of.</p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/worlds/join"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-elevated px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-elevated"
          >
            <Users size={18} /> Join World
          </Link>
          <Link
            href="/worlds/new"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-accent-soft"
          >
            <Plus size={18} /> Create World
          </Link>
        </div>
      </div>

      {worlds.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface/50 p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-elevated">
            <Globe size={32} className="text-muted" />
          </div>
          <h3 className="text-xl font-medium text-white">No worlds yet</h3>
          <p className="mt-2 text-muted">Create a new world or join an existing one to start your journey.</p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              href="/worlds/new"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-accent-soft"
            >
              Create World
            </Link>
            <Link
              href="/worlds/join"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-elevated px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-elevated"
            >
              Join World
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {worlds.map((world) => (
            <Link
              key={world.id}
              href={`/worlds/${world.id}`}
              className="group block rounded-2xl border border-line bg-surface p-6 transition-all hover:border-accent/50 hover:bg-elevated/50"
            >
              <h3 className="text-xl font-semibold text-white group-hover:text-accent">{world.name}</h3>
              <p className="mt-3 line-clamp-2 text-sm text-muted leading-relaxed">
                {world.description || "No description provided."}
              </p>
              <div className="mt-6 flex items-center justify-between text-sm text-muted border-t border-line/50 pt-4">
                <span>Code: <span className="font-mono text-accent-soft">{world.inviteCode}</span></span>
                <span>{new Date(world.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
