import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { joinWorld } from "@/server/actions/worlds"
import { requireUserId } from "@/server/auth-guards"

export default async function JoinWorldPage(props: PageProps<"/worlds/join">) {
  const userId = await requireUserId()

  // The invite link produced by a world header is /worlds/join?code=ABC123,
  // so prefill the field instead of making the invitee retype it.
  const { code } = await props.searchParams
  const prefilledCode = typeof code === "string" ? code.toUpperCase() : ""

  const characters = await prisma.character.findMany({
    where: { userId }
  })

  if (characters.length === 0) {
    redirect("/characters/new")
  }

  return (
    <div className="mx-auto max-w-2xl p-6 mt-12">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white tracking-tight">Join a World</h1>
        <p className="mt-2 text-slate-400">Enter an invite code to join an existing adventure.</p>

        <form action={joinWorld} className="mt-8 space-y-6">
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-300">Invite Code</label>
              <input
                name="inviteCode"
                type="text"
                required
                defaultValue={prefilledCode}
                placeholder="e.g. A1B2C3"
                className="mt-2 block w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm uppercase"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300">Join as Character</label>
              <select
                name="characterId"
                required
                className="mt-2 block w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
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
            className="flex w-full justify-center rounded-full bg-indigo-600 px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-indigo-500"
          >
            Join World
          </button>
        </form>
      </div>
    </div>
  )
}
