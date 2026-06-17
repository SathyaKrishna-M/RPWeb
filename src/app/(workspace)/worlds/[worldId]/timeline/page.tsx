import { db } from "@/server/db";
import Link from "next/link";
import { auth } from "@/auth";

export default async function WorldTimelinePage({
  params,
}: {
  params: Promise<{ worldId: string }>;
}) {
  const { worldId } = await params;
  const session = await auth();
  
  const events = await db.timelineEvent.findMany({
    where: { worldId },
    orderBy: { eventSortKey: "asc" }
  });

  const membership = session?.user?.id ? await db.worldMembership.findUnique({
    where: { worldId_userId: { worldId, userId: session.user.id } }
  }) : null;
  const isAdmin = membership && ["OWNER", "ADMIN"].includes(membership.role);

  return (
    <div className="stack" style={{ gap: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Timeline</h2>
        {isAdmin && (
          <Link href={`/worlds/${worldId}/timeline/new`} className="button">
            + Add Event
          </Link>
        )}
      </div>

      {events.length === 0 ? (
        <div className="panel" style={{ textAlign: "center", color: "var(--muted)", padding: "40px" }}>
          No historical events have been recorded.
        </div>
      ) : (
        <div className="timeline-container" style={{ position: "relative", paddingLeft: "24px", borderLeft: "2px solid var(--line)", margin: "16px 0 16px 8px" }}>
          {events.map((event) => (
            <div key={event.id} className="timeline-event" style={{ position: "relative", marginBottom: "32px" }}>
              <div style={{ 
                position: "absolute", left: "-31px", top: "4px", 
                width: "12px", height: "12px", borderRadius: "50%", 
                background: "var(--secondary)", border: "2px solid var(--surface)" 
              }} />
              <div style={{ fontSize: "0.85rem", color: "var(--secondary)", fontWeight: "bold", textTransform: "uppercase", marginBottom: "4px" }}>
                {event.eventDateText}
              </div>
              <div className="panel" style={{ marginTop: "4px" }}>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "1.1rem" }}>{event.title}</h3>
                {event.description && (
                  <p style={{ margin: 0, fontSize: "0.95rem", whiteSpace: "pre-wrap", color: "var(--muted)" }}>
                    {event.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
