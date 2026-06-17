import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="flex h-screen flex-col bg-slate-950 text-slate-100">
      <header className="flex h-14 items-center justify-between border-b border-slate-800 bg-slate-900 px-4 shadow-sm">
        <div className="text-xl font-bold text-indigo-400">RPWeb</div>
        <div className="text-sm text-slate-400">{session.user.name}</div>
      </header>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
