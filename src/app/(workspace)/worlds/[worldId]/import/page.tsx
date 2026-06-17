import { db } from "@/server/db";
import { redirect } from "next/navigation";
import { ImportClient } from "./import-client";

export default async function WorldImportPage({
  params
}: {
  params: Promise<{ worldId: string }>
}) {
  const { worldId } = await params;
  
  const world = await db.world.findUnique({
    where: { id: worldId },
    select: { id: true, name: true }
  });

  if (!world) {
    redirect("/worlds");
  }

  return (
    <div className="stack" style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <h1>Import Telegram History</h1>
      <p className="text-muted">
        Upload an exported Telegram chat HTML file to convert it into a Scene in <strong>{world.name}</strong>.
      </p>
      
      <ImportClient worldId={worldId} />
    </div>
  );
}
