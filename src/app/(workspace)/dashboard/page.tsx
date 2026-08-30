import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { UserPlus, Globe, UploadCloud, Users, CheckCircle2, Circle } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const characters = await prisma.character.findMany({
    where: { userId: session.user.id }
  })

  const worlds = await prisma.world.findMany({
    where: {
      members: {
        some: { userId: session.user.id }
      }
    }
  })

  const hasCharacters = characters.length > 0
  const hasWorlds = worlds.length > 0

  if (!hasCharacters || !hasWorlds) {
    // ONBOARDING VIEW
    return (
      <div className="mx-auto max-w-3xl p-6 pt-12">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome to your new adventure.</h1>
        <p className="text-muted mb-12">Let&rsquo;s get you set up in three simple steps.</p>

        <div className="space-y-6">
          {/* STEP 1 */}
          <div className={`rounded-xl border p-6 transition-all ${hasCharacters ? "border-line bg-surface/50" : "border-accent/50 bg-accent/10"}`}>
            <div className="flex items-start gap-4">
              {hasCharacters ? <CheckCircle2 className="text-green-500 mt-1" /> : <Circle className="text-accent mt-1" />}
              <div className="flex-1">
                <h3 className={`text-xl font-bold ${hasCharacters ? "text-muted line-through opacity-70" : "text-white"}`}>Step 1: Create your first Character</h3>
                {!hasCharacters && (
                  <>
                    <p className="mt-2 text-muted">Who will you be in this universe?</p>
                    <Link href="/characters/new" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-accent-soft">
                      <UserPlus size={18} /> Create Character
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* STEP 2 */}
          <div className={`rounded-xl border p-6 transition-all ${!hasCharacters ? "border-line bg-surface opacity-50 pointer-events-none" : hasWorlds ? "border-line bg-surface/50" : "border-accent/50 bg-accent/10"}`}>
            <div className="flex items-start gap-4">
               {hasWorlds ? <CheckCircle2 className="text-green-500 mt-1" /> : <Circle className="text-accent mt-1" />}
               <div className="flex-1">
                <h3 className={`text-xl font-bold ${hasWorlds ? "text-muted line-through opacity-70" : "text-white"}`}>Step 2: Import Telegram Chat OR Create World</h3>
                {!hasWorlds && hasCharacters && (
                  <>
                    <p className="mt-2 text-muted">Bring your existing story over, or start a brand new one.</p>
                    <div className="mt-4 flex flex-col sm:flex-row gap-4">
                      <Link href="/import" className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-accent-soft">
                        <UploadCloud size={18} /> Import Telegram Chat
                      </Link>
                      <Link href="/worlds/new" className="inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-elevated px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-elevated">
                        <Globe size={18} /> Create New World
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* STEP 3 */}
          <div className={`rounded-xl border p-6 transition-all ${!hasWorlds ? "border-line bg-surface opacity-50 pointer-events-none" : "border-accent/50 bg-accent/10"}`}>
             <div className="flex items-start gap-4">
               <Circle className="text-accent mt-1" />
               <div className="flex-1">
                <h3 className="text-xl font-bold text-white">Step 3: Invite your RP Partner</h3>
                {hasWorlds && (
                  <p className="mt-2 text-muted">Head over to your world and share the invite code with your partner!</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }

  // POPULATED VIEW
  return (
    <div className="mx-auto max-w-6xl p-6 lg:p-10">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white tracking-tight">Welcome back.</h1>
        <p className="text-lg text-muted mt-2">Pick up where you left off or start something new.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <Link href="/characters/new" className="group relative flex flex-col items-center justify-center rounded-2xl border border-line bg-surface p-8 text-center transition-all hover:border-accent hover:bg-elevated">
          <div className="mb-4 rounded-full bg-elevated p-4 text-accent group-hover:bg-accent/20 group-hover:text-accent-soft">
            <UserPlus size={32} />
          </div>
          <h3 className="text-lg font-semibold text-white">Create Character</h3>
        </Link>

        <Link href="/import" className="group relative flex flex-col items-center justify-center rounded-2xl border border-line bg-surface p-8 text-center transition-all hover:border-accent hover:bg-elevated">
          <div className="mb-4 rounded-full bg-elevated p-4 text-accent group-hover:bg-accent/20 group-hover:text-accent-soft">
            <UploadCloud size={32} />
          </div>
          <h3 className="text-lg font-semibold text-white">Import Telegram</h3>
        </Link>

        <Link href="/worlds/new" className="group relative flex flex-col items-center justify-center rounded-2xl border border-line bg-surface p-8 text-center transition-all hover:border-accent hover:bg-elevated">
          <div className="mb-4 rounded-full bg-elevated p-4 text-accent group-hover:bg-accent/20 group-hover:text-accent-soft">
            <Globe size={32} />
          </div>
          <h3 className="text-lg font-semibold text-white">Create World</h3>
        </Link>

        <Link href="/worlds/join" className="group relative flex flex-col items-center justify-center rounded-2xl border border-line bg-surface p-8 text-center transition-all hover:border-accent hover:bg-elevated">
          <div className="mb-4 rounded-full bg-elevated p-4 text-accent group-hover:bg-accent/20 group-hover:text-accent-soft">
            <Users size={32} />
          </div>
          <h3 className="text-lg font-semibold text-white">Join World</h3>
        </Link>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Your Worlds</h2>
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
      </div>
    </div>
  )
}
