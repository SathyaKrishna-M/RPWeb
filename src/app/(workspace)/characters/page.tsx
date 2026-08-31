import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { requireUserId } from "@/server/auth-guards"
import { characterColor } from "@/lib/characters"
import { Avatar } from "@/components/layout/Sidebar"
import { Plus, Users, Pencil } from "lucide-react"

export default async function CharactersPage() {
  const userId = await requireUserId()

  // Everything this person can write as: what they created, plus the cast of
  // every world they are in — those are shared and equally theirs to use.
  const characters = await prisma.character.findMany({
    where: {
      OR: [
        { userId },
        { worlds: { some: { world: { members: { some: { userId } } } } } },
      ],
    },
    include: { worlds: { include: { world: { select: { id: true, name: true } } } } },
    orderBy: { createdAt: "asc" },
  })

  return (
    <div className="mx-auto max-w-5xl p-6 lg:p-10">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink">Characters</h1>
          <p className="mt-1 text-muted">
            Shared with everyone in the worlds they belong to.
          </p>
        </div>
        <Link
          href="/characters/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-soft"
        >
          <Plus size={18} /> Create Character
        </Link>
      </div>

      {characters.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface/50 p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-elevated">
            <Users size={30} className="text-muted" />
          </div>
          <h3 className="text-xl font-medium text-ink">No characters yet</h3>
          <p className="mt-2 text-muted">Create your first one to start writing.</p>
          <Link
            href="/characters/new"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-soft"
          >
            Create Character
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {characters.map((char) => {
            const color = characterColor(char)
            return (
              <div
                key={char.id}
                className="group rounded-2xl border border-line bg-surface p-5 transition hover:border-accent/40"
                style={{ borderTop: `3px solid ${color}` }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <Avatar name={char.name} src={char.avatarUrl} size={48} ring={color} />
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-semibold" style={{ color }}>
                      {char.name}
                    </h3>
                    <div className="truncate text-xs text-muted">
                      {char.title || "No title"}
                    </div>
                  </div>
                </div>

                <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-muted">
                  {char.bio || "No bio yet."}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {char.worlds.length === 0 ? (
                    <span className="text-xs text-muted">Not in a world yet</span>
                  ) : (
                    char.worlds.map((w) => (
                      <Link
                        key={w.world.id}
                        href={`/worlds/${w.world.id}`}
                        className="rounded-lg border border-line bg-elevated px-2 py-1 text-[11px] text-muted transition hover:text-ink"
                      >
                        {w.world.name}
                      </Link>
                    ))
                  )}
                </div>

                <div className="mt-4 flex justify-end border-t border-line pt-3">
                  <Link
                    href={`/characters/${char.id}/edit`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-soft"
                  >
                    <Pencil size={13} /> Customise
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
