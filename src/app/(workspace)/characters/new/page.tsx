import { createCharacter } from "@/server/actions/characters"

export default function NewCharacterPage() {
  return (
    <div className="mx-auto max-w-2xl p-6 mt-12">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white tracking-tight">Who are you in this universe?</h1>
        <p className="mt-2 text-slate-400">Create your first character to continue.</p>

        <form action={createCharacter} className="mt-8 space-y-6">
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-300">Character Name</label>
              <input
                name="name"
                type="text"
                required
                className="mt-2 block w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-300">Avatar URL (Optional)</label>
              <input
                name="avatarUrl"
                type="url"
                placeholder="https://..."
                className="mt-2 block w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300">Bio (Optional)</label>
              <textarea
                name="bio"
                rows={4}
                className="mt-2 block w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full justify-center rounded-full bg-indigo-600 px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-indigo-500"
          >
            Create Character
          </button>
        </form>
      </div>
    </div>
  )
}
