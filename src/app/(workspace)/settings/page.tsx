import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { requireUserId } from "@/server/auth-guards"
import { signOutAction } from "@/server/actions/session"
import { Download, LogOut, ShieldAlert, User as UserIcon } from "lucide-react"

export default async function SettingsPage() {
  const userId = await requireUserId()

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, createdAt: true },
  })

  const worlds = await prisma.world.findMany({
    where: { members: { some: { userId } } },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { messages: true } } },
  })

  return (
    <div className="mx-auto max-w-3xl p-6 lg:p-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-slate-400 mt-1">Your account and your data.</p>
      </div>

      <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center gap-3 mb-4">
          <UserIcon size={20} className="text-indigo-400" />
          <h2 className="text-lg font-semibold text-white">Account</h2>
        </div>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Name</dt>
            <dd className="text-slate-200">{user?.name || "Not set"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Email</dt>
            <dd className="text-slate-200 break-all">{user?.email}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Member since</dt>
            <dd className="text-slate-200">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center gap-3 mb-2">
          <Download size={20} className="text-indigo-400" />
          <h2 className="text-lg font-semibold text-white">Export your worlds</h2>
        </div>
        <p className="text-sm text-slate-400 mb-6">
          Download a full copy of any world. JSON keeps every field for re-importing;
          HTML is a readable transcript that opens in any browser.
        </p>

        <div className="mb-6 flex gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
          <ShieldAlert size={18} className="mt-0.5 shrink-0 text-amber-400" />
          <p className="text-sm text-amber-200/90">
            Everything you write lives only in this app&rsquo;s database. If it is hosted on
            a free database plan, that database is deleted about a month after it is
            created and cannot be recovered. Export anything you care about regularly.
          </p>
        </div>

        {worlds.length === 0 ? (
          <p className="text-sm text-slate-500">You are not part of any world yet.</p>
        ) : (
          <ul className="space-y-3">
            {worlds.map((world) => (
              <li
                key={world.id}
                className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <Link
                    href={`/worlds/${world.id}`}
                    className="font-medium text-white hover:text-indigo-400"
                  >
                    {world.name}
                  </Link>
                  <div className="text-xs text-slate-500">
                    {world._count.messages} messages
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  {/* Plain links, so the browser downloads them directly. */}
                  <a
                    href={`/api/worlds/${world.id}/export?format=json`}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700"
                  >
                    JSON
                  </a>
                  <a
                    href={`/api/worlds/${world.id}/export?format=html`}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700"
                  >
                    HTML
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Session</h2>
        <form action={signOutAction}>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-red-500/40 hover:text-red-400"
          >
            <LogOut size={16} /> Sign out
          </button>
        </form>
      </section>
    </div>
  )
}
