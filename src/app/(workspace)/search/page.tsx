import { db } from "@/server/db";
import { PageShell } from "@/components/layout/page-shell";
import Link from "next/link";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q: string }> }) {
  const sp = await searchParams;
  const q = sp?.q || "";

  let characters: any[] = [];
  let worlds: any[] = [];
  let scenes: any[] = [];

  if (q.trim()) {
    const searchCondition = { contains: q, mode: "insensitive" as const };

    [characters, worlds, scenes] = await Promise.all([
      db.character.findMany({
        where: { name: searchCondition, isPublished: true, isArchived: false },
        take: 10
      }),
      db.world.findMany({
        where: { name: searchCondition, visibility: "PUBLIC", status: "ACTIVE" },
        take: 10
      }),
      db.scene.findMany({
        where: { title: searchCondition, visibility: "PUBLIC", status: { in: ["ACTIVE", "COMPLETED"] } },
        include: { world: { select: { name: true } } },
        take: 10
      })
    ]);
  }

  return (
    <PageShell eyebrow="Discover" title="Global Search" description="Find worlds, characters, and scenes across the platform.">
      <div className="panel stack" style={{ maxWidth: "800px", margin: "0 auto", marginTop: "24px" }}>
        <form method="get" action="/search" style={{ display: "flex", gap: "12px" }}>
          <input 
            type="search" 
            name="q" 
            defaultValue={q} 
            placeholder="Search..." 
            style={{ flex: 1, padding: "12px", border: "1px solid var(--border)", borderRadius: "4px" }}
          />
          <button type="submit" className="button">Search</button>
        </form>

        {q && (
          <div className="stack" style={{ marginTop: "32px", gap: "32px" }}>
            <section>
              <h3 style={{ borderBottom: "1px solid var(--line)", paddingBottom: "8px", marginBottom: "16px" }}>Worlds ({worlds.length})</h3>
              {worlds.length === 0 ? <p className="muted-list">No worlds found.</p> : (
                <ul className="muted-list" style={{ listStyle: "none", padding: 0 }}>
                  {worlds.map(w => (
                    <li key={w.id} style={{ marginBottom: "12px" }}>
                      <Link href={`/worlds/${w.id}`} style={{ fontWeight: "bold", color: "var(--primary)", textDecoration: "none" }}>{w.name}</Link>
                      <div style={{ fontSize: "0.9rem", color: "var(--muted)" }}>{w.summary || "No summary provided"}</div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h3 style={{ borderBottom: "1px solid var(--line)", paddingBottom: "8px", marginBottom: "16px" }}>Characters ({characters.length})</h3>
              {characters.length === 0 ? <p className="muted-list">No characters found.</p> : (
                <ul className="muted-list" style={{ listStyle: "none", padding: 0 }}>
                  {characters.map(c => (
                    <li key={c.id} style={{ marginBottom: "12px" }}>
                      <Link href={`/characters/${c.id}`} style={{ fontWeight: "bold", color: "var(--primary)", textDecoration: "none" }}>{c.name}</Link>
                      <div style={{ fontSize: "0.9rem", color: "var(--muted)" }}>{c.title || "No title"}</div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h3 style={{ borderBottom: "1px solid var(--line)", paddingBottom: "8px", marginBottom: "16px" }}>Scenes ({scenes.length})</h3>
              {scenes.length === 0 ? <p className="muted-list">No scenes found.</p> : (
                <ul className="muted-list" style={{ listStyle: "none", padding: 0 }}>
                  {scenes.map(s => (
                    <li key={s.id} style={{ marginBottom: "12px" }}>
                      <Link href={`/scenes/${s.id}`} style={{ fontWeight: "bold", color: "var(--primary)", textDecoration: "none" }}>{s.title}</Link>
                      <div style={{ fontSize: "0.9rem", color: "var(--muted)" }}>in <strong>{s.world?.name}</strong></div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </div>
    </PageShell>
  );
}
