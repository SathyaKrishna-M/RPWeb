import { db } from "@/server/db";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { SceneComposer } from "./scene-composer";
import { joinScene, updateSceneStatus } from "@/server/actions/scenes";
import Link from "next/link";
import { SceneClient } from "./scene-client";
import { ParticipantSidebar } from "./participant-sidebar";

export default async function ScenePage({
  params,
  searchParams
}: {
  params: Promise<{ sceneId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { sceneId } = await params;
  const sp = await searchParams;
  const page = parseInt(sp?.page as string) || 1;
  const take = 50;
  const skip = (page - 1) * take;

  const session = await auth();
  const userId = session?.user?.id;

  const scene = await db.scene.findUnique({
    where: { id: sceneId },
    include: {
      world: { select: { name: true, ownerUserId: true } },
      participants: {
        include: { character: { select: { id: true, name: true, avatarUrl: true } } }
      }
    }
  });

  if (!scene) notFound();

  const totalPosts = await db.scenePost.count({ where: { sceneId } });
  const totalPages = Math.ceil(totalPosts / take) || 1;

  const posts = await db.scenePost.findMany({
    where: { sceneId },
    orderBy: { sequenceNumber: "asc" },
    take,
    skip,
    include: { character: { select: { name: true, avatarUrl: true } } }
  });

  if (!scene) notFound();

  const user = userId ? await db.user.findUnique({ where: { id: userId }, select: { activeCharacterId: true } }) : null;
  const isParticipant = user?.activeCharacterId 
    ? scene.participants.some(p => p.characterId === user.activeCharacterId && p.participantStatus === "ACTIVE")
    : false;

  const isSceneAdmin = userId && (scene.createdByUserId === userId || scene.world.ownerUserId === userId);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <header className="panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, padding: "24px", position: "sticky", top: 0, zIndex: 10, backdropFilter: "blur(12px)", background: "rgba(var(--surface-rgb), 0.8)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "0.85rem", color: "var(--secondary)", fontWeight: "bold", textTransform: "uppercase", marginBottom: "4px" }}>
              <Link href={`/worlds/${scene.worldId}`} style={{ color: "inherit", textDecoration: "none" }}>{scene.world.name}</Link>
            </div>
            <h1 style={{ margin: 0, fontSize: "1.8rem" }}>{scene.title}</h1>
            <div style={{ fontSize: "0.9rem", color: "var(--muted)", marginTop: "4px" }}>
              {scene.status} • {scene.participants.length} Participants
            </div>
          </div>

          <div className="button-row">
            {!isParticipant && scene.status !== "COMPLETED" && user?.activeCharacterId && (
              <form action={async () => {
                "use server";
                await joinScene(sceneId);
              }}>
                <button className="button">+ Join Scene</button>
              </form>
            )}
            
            {isSceneAdmin && scene.status === "ACTIVE" && (
              <form action={async () => {
                "use server";
                await updateSceneStatus(sceneId, "COMPLETED");
              }}>
                <button className="button secondary">Mark Completed</button>
              </form>
            )}
          </div>
        </div>
      </header>

      {/* Body Area with Sidebar */}
      <div style={{ display: "flex", maxWidth: "1100px", margin: "0 auto", padding: "40px 24px", gap: "32px", width: "100%", alignItems: "start" }}>
        <main style={{ flex: 1, minWidth: 0 }}>
          <SceneClient sceneId={sceneId} initialPosts={posts} />

          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", marginTop: "48px", borderTop: "1px solid var(--line)", paddingTop: "24px" }}>
              {page > 1 ? (
                <Link href={`/scenes/${sceneId}?page=${page - 1}`} className="button secondary">Previous</Link>
              ) : <div style={{ width: "80px" }} />}
              <span style={{ fontSize: "0.9rem", color: "var(--muted)" }}>Page {page} of {totalPages}</span>
              {page < totalPages ? (
                <Link href={`/scenes/${sceneId}?page=${page + 1}`} className="button secondary">Next</Link>
              ) : <div style={{ width: "80px" }} />}
            </div>
          )}
        </main>
        
        <ParticipantSidebar sceneId={sceneId} initialParticipants={scene.participants} />
      </div>

      {/* Footer: Composer */}
      {scene.status !== "COMPLETED" && (
        <SceneComposer sceneId={sceneId} isActiveParticipant={isParticipant} />
      )}
      {scene.status === "COMPLETED" && (
        <div style={{ padding: "24px", textAlign: "center", background: "var(--surface-strong)", color: "var(--muted)", borderTop: "1px solid var(--line)" }}>
          This scene has concluded.
        </div>
      )}
    </div>
  );
}
