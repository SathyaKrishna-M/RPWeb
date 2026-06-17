import { db } from "@/server/db";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { JoinClient } from "./join-client";

export default async function JoinWorldPage({
  params,
  searchParams,
}: {
  params: Promise<{ worldId: string }>;
  searchParams: Promise<{ code?: string }>;
}) {
  const { worldId } = await params;
  const { code } = await searchParams;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/join-world/${worldId}`);
  }

  const world = await db.world.findUnique({
    where: { id: worldId },
    include: {
      owner: true,
      memberships: { where: { userId: session.user.id } },
      joinRequests: { where: { userId: session.user.id } }
    }
  });

  if (!world || world.status !== "ACTIVE") notFound();

  // If already an active member, redirect to world
  if (world.memberships[0]?.status === "ACTIVE") {
    redirect(`/worlds/${worldId}`);
  }

  return (
    <div className="workspace-grid" style={{ gridTemplateColumns: "1fr" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", width: "100%", marginTop: "2rem" }}>
        
        <div className="panel stack" style={{ textAlign: "center", padding: "3rem 2rem" }}>
          <div style={{ width: "80px", height: "80px", margin: "0 auto", borderRadius: "8px", background: world.iconUrl ? `url(${world.iconUrl}) center/cover` : "var(--gradient-subtle)" }} />
          <h2>Join {world.name}</h2>
          <p className="text-muted">Created by {world.owner.username}</p>
          
          <div style={{ marginTop: "1rem" }}>
            <JoinClient 
              worldId={worldId} 
              visibility={world.visibility} 
              inviteCode={code} 
              existingRequest={world.joinRequests[0] || null} 
            />
          </div>
        </div>

      </div>
    </div>
  );
}
