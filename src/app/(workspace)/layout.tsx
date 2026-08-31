import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Sidebar } from "@/components/layout/Sidebar"
import { avatarSrc } from "@/lib/characters"

export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  // The sidebar shows the signed-in person by their most recent character,
  // which is the identity they actually recognise themselves by in the app.
  const character = await prisma.character.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, avatarUrl: true, avatarUpdatedAt: true },
  })

  return (
    <div className="flex h-dvh overflow-hidden bg-canvas text-ink">
      <Sidebar
        user={{
          name: character?.name ?? session.user.name ?? "You",
          avatarUrl: character ? avatarSrc(character) : null,
        }}
      />
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">{children}</main>
    </div>
  )
}
