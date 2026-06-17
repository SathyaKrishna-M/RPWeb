import { db } from "@/server/db";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { WorldSettingsForm } from "./world-settings-form";
import { AccessClient } from "./access-client";

export default async function WorldSettingsPage({
  params,
}: {
  params: Promise<{ worldId: string }>;
}) {
  const { worldId } = await params;
  const session = await auth();

  const world = await db.world.findUnique({
    where: { id: worldId },
    include: {
      memberships: session?.user?.id ? { where: { userId: session.user.id } } : false,
      inviteLinks: true,
      whitelists: { include: { user: { select: { id: true, username: true } } } },
      joinRequests: { 
        where: { status: "PENDING" },
        include: { user: { select: { id: true, username: true } } } 
      }
    }
  });

  if (!world) notFound();

  const membership = session?.user?.id ? world.memberships[0] : null;
  const isAdmin = world.ownerUserId === session?.user?.id || membership?.role === "ADMIN";

  if (!isAdmin) {
    notFound(); // Only admins/owners can access settings
  }

  return (
    <div className="quick-grid" style={{ gridTemplateColumns: "1fr" }}>
      <section className="panel stack" style={{ maxWidth: "800px" }}>
        <h2 style={{ color: "var(--secondary)" }}>General Settings</h2>
        <WorldSettingsForm world={world} />
      </section>

      <section className="stack" style={{ maxWidth: "800px" }}>
        <h2 style={{ color: "var(--secondary)", marginTop: "2rem" }}>Access Control</h2>
        <AccessClient 
          worldId={worldId}
          currentVisibility={world.visibility}
          inviteLinks={world.inviteLinks}
          whitelist={world.whitelists}
          joinRequests={world.joinRequests}
        />
      </section>
    </div>
  );
}
