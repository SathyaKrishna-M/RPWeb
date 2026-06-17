import { db } from "@/server/db";
import { auth } from "@/auth";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";

export default async function WorldsDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const session = await auth();
  const userId = session?.user?.id;

  const worlds = await db.world.findMany({
    where: {
      status: "ACTIVE",
      OR: [
        { visibility: "PUBLIC" },
        userId ? { memberships: { some: { userId, status: "ACTIVE" } } } : {},
      ],
      name: q ? { contains: q, mode: "insensitive" } : undefined,
    },
    include: { owner: true },
    orderBy: { memberCount: "desc" },
    take: 50,
  });

  return (
    <PageShell
      eyebrow="Directory"
      title="Worlds"
      description="Discover new universes to explore, or build your own."
    >
      <div className="workspace-grid" style={{ gridTemplateColumns: "1fr" }}>
        
        <section className="panel stack" style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <form style={{ display: "flex", gap: "8px", flex: 1, maxWidth: "400px" }}>
              <input type="text" name="q" placeholder="Search worlds..." defaultValue={q || ""} style={{ flex: 1 }} />
              <button type="submit" className="button">Search</button>
            </form>
            <Link href="/worlds/new" className="button">
              + Create World
            </Link>
          </div>
        </section>

        <div className="quick-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
          {worlds.map((world) => {
            const isOwner = world.ownerUserId === userId;
            return (
              <Link href={`/worlds/${world.id}`} className="quick-link" key={world.id}>
                <div>
                  <h3 style={{ margin: "0 0 4px 0", fontSize: "1.2rem" }}>{world.name}</h3>
                  {world.genre && <p style={{ fontSize: "0.85rem", color: "var(--secondary)", fontWeight: 600, margin: "0 0 8px 0", textTransform: "uppercase" }}>{world.genre}</p>}
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--muted)", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {world.summary || world.description || "No description provided."}
                  </p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--muted)", borderTop: "1px solid var(--line)", paddingTop: "12px", marginTop: "12px" }}>
                  <span>{world.memberCount} Members • {world.sceneCount} Scenes</span>
                  {isOwner && <span style={{ color: "var(--secondary)" }}>★ Owned</span>}
                </div>
              </Link>
            );
          })}
          {worlds.length === 0 && (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "var(--muted)" }}>
              No worlds found matching your criteria.
            </div>
          )}
        </div>

      </div>
    </PageShell>
  );
}
