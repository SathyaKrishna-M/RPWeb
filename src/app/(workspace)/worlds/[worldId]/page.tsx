import { db } from "@/server/db";

export default async function WorldOverviewPage({
  params,
}: {
  params: Promise<{ worldId: string }>;
}) {
  const { worldId } = await params;
  const world = await db.world.findUnique({ where: { id: worldId } });

  if (!world) return null;

  return (
    <div className="quick-grid" style={{ gridTemplateColumns: "2fr 1fr" }}>
      <section className="panel stack">
        <h2>About This World</h2>
        <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6, color: "var(--ink)" }}>
          {world.description || "No detailed description provided yet."}
        </div>
      </section>

      <div className="stack" style={{ gap: "24px" }}>
        <section className="panel stack">
          <h2>Rules & Guidelines</h2>
          <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6, color: "var(--muted)", fontSize: "0.9rem" }}>
            {world.rules || "No specific rules have been set by the owner."}
          </div>
        </section>

        <section className="panel stack">
          <h2>Statistics</h2>
          <ul className="muted-list">
            <li><strong>Members:</strong> {world.memberCount}</li>
            <li><strong>Characters:</strong> {world.characterCount}</li>
            <li><strong>Scenes:</strong> {world.sceneCount}</li>
            <li><strong>Established:</strong> {world.createdAt.toLocaleDateString()}</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
