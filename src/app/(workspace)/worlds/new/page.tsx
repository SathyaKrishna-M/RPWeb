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
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-white">Create a New World</h1>
        <p className="mt-2 text-slate-400">Start a new roleplay adventure.</p>

        <form action={createWorld} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300">World Name</label>
              <input
                name="name"
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-300">Description (Optional)</label>
              <textarea
                name="description"
                rows={3}
                className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300">Join as Character</label>
              <select
                name="characterId"
                required
                className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
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
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            Create World
          </button>
        </form>
      </div>
    </div>
  )
}
