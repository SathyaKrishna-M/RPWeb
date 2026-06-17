import { db } from "@/server/db";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";

export default async function WorldLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ worldId: string }>;
}) {
  const { worldId } = await params;
  const session = await auth();
  const userId = session?.user?.id;

  const world = await db.world.findUnique({
    where: { id: worldId },
    include: {
      owner: true,
      memberships: userId ? { where: { userId, status: "ACTIVE" } } : false
    }
  });

  if (!world || world.status !== "ACTIVE") {
    notFound();
  }

  const membership = userId ? world.memberships[0] : null;
  const isMember = !!membership;
  const isOwner = world.ownerUserId === userId;
  const isAdmin = isOwner || membership?.role === "ADMIN";

  if (!isMember && world.visibility !== "PUBLIC") {
    const { redirect } = await import("next/navigation");
    redirect(`/join-world/${worldId}`);
  }

  return (
    <div className="workspace-grid" style={{ gridTemplateColumns: "1fr", paddingTop: 0 }}>
      {/* World Banner */}
      <header className="panel stack" style={{ padding: 0, overflow: "hidden", marginBottom: "0" }}>
        <div style={{ height: "150px", background: world.bannerUrl ? `url(${world.bannerUrl}) center/cover` : "var(--gradient-subtle)" }} />
        <div style={{ padding: "24px", position: "relative" }}>
          <h1 style={{ margin: 0, fontSize: "2rem" }}>{world.name}</h1>
          <p style={{ margin: "4px 0 16px 0", color: "var(--muted)" }}>
            By {world.owner.username} • {world.memberCount} Members • {world.genre || "Uncategorized"}
          </p>

          {/* Quick Actions */}
          <div className="button-row" style={{ position: "absolute", right: "24px", top: "24px" }}>
            {!isMember && userId && (
              <Link href={`/join-world/${worldId}`} className="button">
                + Join World
              </Link>
            )}
            {isMember && !isOwner && (
              <form action={async () => {
                "use server";
                const { leaveWorld } = await import("@/server/actions/worlds");
                await leaveWorld(worldId);
              }}>
                <button className="button secondary">Leave</button>
              </form>
            )}
            {isAdmin && (
              <Link href={`/worlds/${worldId}/settings`} className="button secondary">
                ⚙️ Settings
              </Link>
            )}
          </div>

          {/* Tabs */}
          <nav style={{ display: "flex", gap: "16px", borderTop: "1px solid var(--line)", paddingTop: "16px" }}>
            <Link href={`/worlds/${worldId}`} style={{ color: "var(--ink)", fontWeight: 500, textDecoration: "none" }}>Overview</Link>
            <Link href={`/worlds/${worldId}/lore`} style={{ color: "var(--ink)", fontWeight: 500, textDecoration: "none" }}>Lore</Link>
            <Link href={`/worlds/${worldId}/characters`} style={{ color: "var(--ink)", fontWeight: 500, textDecoration: "none" }}>Characters</Link>
            <Link href={`/worlds/${worldId}/scenes`} style={{ color: "var(--ink)", fontWeight: 500, textDecoration: "none" }}>Scenes</Link>
            <Link href={`/worlds/${worldId}/timeline`} style={{ color: "var(--ink)", fontWeight: 500, textDecoration: "none" }}>Timeline</Link>
          </nav>
        </div>
      </header>

      {/* Main Tab Content */}
      <main style={{ marginTop: "24px" }}>
        {children}
      </main>
    </div>
  );
}
