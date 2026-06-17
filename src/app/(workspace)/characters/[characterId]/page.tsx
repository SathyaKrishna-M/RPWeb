import { db } from "@/server/db";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";

export default async function CharacterProfilePage({
  params,
}: {
  params: Promise<{ characterId: string }>;
}) {
  const { characterId } = await params;
  const session = await auth();

  const character = await db.character.findUnique({
    where: { id: characterId },
    include: { owner: true }
  });

  if (!character || character.isArchived) {
    notFound();
  }

  // Permission check
  const isOwner = session?.user?.id === character.ownerUserId;
  if (!isOwner && !character.isPublished) {
    notFound(); // Hide unpublished characters from non-owners
  }

  return (
    <PageShell
      eyebrow="Character Profile"
      title={character.name}
      description={character.title || "No title provided"}
    >
      <div className="workspace-grid" style={{ marginTop: "24px" }}>
        
        {/* Main Content Area */}
        <div className="stack" style={{ gap: "24px" }}>
          
          <section className="panel stack">
            <h2>Appearance</h2>
            {character.appearance ? (
              <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{character.appearance}</p>
            ) : (
              <p className="muted-list">No appearance described.</p>
            )}
          </section>

          <section className="panel stack">
            <h2>Personality</h2>
            {character.personality ? (
              <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{character.personality}</p>
            ) : (
              <p className="muted-list">No personality described.</p>
            )}
          </section>

          <section className="panel stack">
            <h2>Biography</h2>
            {character.biography ? (
              <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{character.biography}</p>
            ) : (
              <p className="muted-list">No biography provided.</p>
            )}
          </section>

        </div>

        {/* Sidebar / Meta Area */}
        <aside className="stack" style={{ gap: "24px" }}>
          <section className="panel stack">
            <h2>Details</h2>
            <ul className="muted-list">
              <li><strong>Age:</strong> {character.age || "Unknown"}</li>
              <li><strong>Status:</strong> {character.isPublished ? "Published" : "Draft"}</li>
              <li><strong>Created By:</strong> {character.owner.username}</li>
            </ul>
          </section>

          {isOwner && (
            <section className="panel stack">
              <h2>Management</h2>
              <div className="button-row" style={{ marginTop: "8px" }}>
                <Link href={`/characters/${character.id}/edit`} className="button">
                  Edit Character
                </Link>
                
                {/* We can use a Server Action directly in a form to set Active */}
                <form action={async () => {
                  "use server";
                  const { setActiveCharacter } = await import("@/server/actions/characters");
                  await setActiveCharacter(character.id);
                }} style={{ width: "100%" }}>
                  <button type="submit" className="button secondary" style={{ width: "100%" }}>
                    Set as Active Character
                  </button>
                </form>

              </div>
            </section>
          )}
        </aside>

      </div>
    </PageShell>
  );
}
