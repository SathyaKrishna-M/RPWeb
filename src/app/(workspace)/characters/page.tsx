import { db } from "@/server/db";
import { auth } from "@/auth";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";

export default async function CharactersDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const session = await auth();
  const userId = session?.user?.id;

  const characters = await db.character.findMany({
    where: {
      isArchived: false,
      OR: [
        { isPublished: true },
        userId ? { ownerUserId: userId } : {},
      ],
      name: q ? { contains: q, mode: "insensitive" } : undefined,
    },
    include: { owner: true },
    orderBy: { createdAt: "desc" },
    take: 50, // basic pagination placeholder
  });

  return (
    <PageShell
      eyebrow="Directory"
      title="Characters"
      description="Explore active characters across the platform."
    >
      <div className="workspace-grid" style={{ gridTemplateColumns: "1fr" }}>
        
        <section className="panel stack" style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <form style={{ display: "flex", gap: "8px", flex: 1, maxWidth: "400px" }}>
              <input type="text" name="q" placeholder="Search characters..." defaultValue={q || ""} style={{ flex: 1 }} />
              <button type="submit" className="button">Search</button>
            </form>
            <Link href="/characters/new" className="button">
              + Create Character
            </Link>
          </div>
        </section>

        <div className="quick-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
          {characters.map((character) => {
            const isOwner = character.ownerUserId === userId;
            return (
              <Link href={`/characters/${character.id}`} className="quick-link" key={character.id}>
                <div>
                  <h3 style={{ margin: "0 0 4px 0", fontSize: "1.1rem" }}>{character.name}</h3>
                  {character.title && <p style={{ fontSize: "0.85rem", color: "var(--secondary)", fontWeight: 600, margin: "0 0 8px 0" }}>{character.title}</p>}
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--muted)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {character.summary || character.biography || character.appearance || "No description provided."}
                  </p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--muted)", borderTop: "1px solid var(--line)", paddingTop: "12px" }}>
                  <span>By {character.owner.username}</span>
                  {isOwner ? (
                    <span style={{ color: "var(--secondary)" }}>★ Your Character</span>
                  ) : (
                    <span>{character.isPublished ? "Public" : "Private"}</span>
                  )}
                </div>
              </Link>
            );
          })}
          {characters.length === 0 && (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "var(--muted)" }}>
              No characters found.
            </div>
          )}
        </div>

      </div>
    </PageShell>
  );
}
