import { db } from "@/server/db";
import Link from "next/link";
import { auth } from "@/auth";

export default async function WorldLorePage({
  params,
}: {
  params: Promise<{ worldId: string }>;
}) {
  const { worldId } = await params;
  const session = await auth();
  
  const entries = await db.loreEntry.findMany({
    where: { worldId },
    orderBy: { category: "asc" }
  });

  // Group by category
  const grouped = entries.reduce((acc, entry) => {
    if (!acc[entry.category]) acc[entry.category] = [];
    acc[entry.category].push(entry);
    return acc;
  }, {} as Record<string, typeof entries>);

  const membership = session?.user?.id ? await db.worldMembership.findUnique({
    where: { worldId_userId: { worldId, userId: session.user.id } }
  }) : null;
  const isAdmin = membership && ["OWNER", "ADMIN"].includes(membership.role);

  return (
    <div className="stack" style={{ gap: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>World Lore</h2>
        {isAdmin && (
          <Link href={`/worlds/${worldId}/lore/new`} className="button">
            + Add Lore
          </Link>
        )}
      </div>

      {Object.entries(grouped).length === 0 ? (
        <div className="panel" style={{ textAlign: "center", color: "var(--muted)", padding: "40px" }}>
          No lore entries have been written yet.
        </div>
      ) : (
        <div className="quick-grid">
          {Object.entries(grouped).map(([category, items]) => (
            <section key={category} className="panel stack">
              <h3 style={{ textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "0.05em", color: "var(--secondary)" }}>
                {category}
              </h3>
              <ul className="muted-list" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {items.map((item) => (
                  <li key={item.id} style={{ marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid var(--line)" }}>
                    <h4 style={{ margin: "0 0 8px 0" }}>{item.title}</h4>
                    <p style={{ margin: 0, fontSize: "0.9rem", whiteSpace: "pre-wrap" }}>{item.body}</p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
