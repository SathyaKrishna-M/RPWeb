import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { createWorld } from "@/server/actions/worlds"

export default async function NewWorldPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const characters = await prisma.character.findMany({
    where: { userId: session.user.id }
  })

  if (characters.length === 0) {
    redirect("/characters/new")
  }

  return (
    <div className="mx-auto max-w-2xl p-6 mt-12">
      <div className="rounded-3xl border border-line bg-surface p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white tracking-tight">Create a New World</h1>
        <p className="mt-2 text-muted">Start a new roleplay adventure.</p>

        <form action={createWorld} className="mt-8 space-y-6">
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-muted">World Name</label>
              <input
                name="name"
                type="text"
                required
                className="mt-2 block w-full rounded-xl border border-line bg-canvas px-4 py-3 text-white placeholder-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent sm:text-sm"
                placeholder="E.g., The Velvet Room"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted">Description (Optional)</label>
              <textarea
                name="description"
                rows={3}
                className="mt-2 block w-full rounded-xl border border-line bg-canvas px-4 py-3 text-white placeholder-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent sm:text-sm"
                placeholder="A brief setting or synopsis..."
              />
            </div>

            <div>
              <label className="text-sm font-medium text-muted">Join as Character</label>
              <select
                name="characterId"
                required
                className="mt-2 block w-full rounded-xl border border-line bg-canvas px-4 py-3 text-white placeholder-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent sm:text-sm"
              >
                {characters.map((char) => (
                  <option key={char.id} value={char.id}>
                    {char.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full justify-center rounded-full bg-accent px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-accent-soft"
          >
            Create World
          </button>
        </form>
      </div>
    </div>
  )
}
