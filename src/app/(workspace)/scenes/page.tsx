import { db } from "@/server/db";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";

export default async function ScenesDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;

  const scenes = await db.scene.findMany({
    where: {
      visibility: "PUBLIC",
      title: q ? { contains: q, mode: "insensitive" } : undefined,
      status: status ? (status as any) : undefined
    },
    include: {
      world: { select: { name: true } },
      _count: { select: { posts: true, participants: true } }
    },
    orderBy: { lastActivityAt: "desc" },
    take: 50,
  });

  return (
    <PageShell
      eyebrow="Directory"
      title="Active Scenes"
      description="Jump into an ongoing story or read completed chapters."
    >
      <div className="workspace-grid" style={{ gridTemplateColumns: "1fr" }}>
        
        <section className="panel stack" style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <form style={{ display: "flex", gap: "8px", flex: 1, maxWidth: "500px" }}>
              <input type="text" name="q" placeholder="Search scenes..." defaultValue={q || ""} style={{ flex: 1 }} />
              <select name="status" defaultValue={status || ""}>
                <option value="">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="PAUSED">Paused</option>
                <option value="COMPLETED">Completed</option>
              </select>
              <button type="submit" className="button">Search</button>
            </form>
            <Link href="/scenes/new" className="button">
              + Start Scene
            </Link>
          </div>
        </section>

        <div className="quick-grid" style={{ gridTemplateColumns: "1fr" }}>
          {scenes.map((scene) => (
            <Link href={`/scenes/${scene.id}`} className="quick-link panel" key={scene.id} style={{ display: "block" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ margin: "0 0 4px 0", fontSize: "1.25rem" }}>{scene.title}</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--secondary)", fontWeight: 600, margin: "0 0 8px 0", textTransform: "uppercase" }}>
                    {scene.world.name} • {scene.status}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--muted)", maxWidth: "800px" }}>
                    {scene.summary || "No summary provided."}
                  </p>
                </div>
                <div style={{ textAlign: "right", fontSize: "0.8rem", color: "var(--muted)" }}>
                  <div>{scene._count.participants} Participants</div>
                  <div>{scene._count.posts} Posts</div>
                  <div style={{ marginTop: "8px" }}>Last active: {scene.lastActivityAt?.toLocaleDateString()}</div>
                </div>
              </div>
            </Link>
          ))}
          {scenes.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>
              No scenes found matching your criteria.
            </div>
          )}
        </div>

      </div>
    </PageShell>
  );
}
