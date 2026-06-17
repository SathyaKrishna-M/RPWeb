"use server";

import { db } from "@/server/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createTimelineEvent(worldId: string, prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  // Validate permission (Owner or Admin)
  const membership = await db.worldMembership.findUnique({
    where: { worldId_userId: { worldId, userId: session.user.id } }
  });
  
  if (!membership || !["OWNER", "ADMIN"].includes(membership.role)) {
    return { error: "You do not have permission to create timeline events." };
  }

  const title = formData.get("title") as string;
  if (!title || title.trim().length === 0) return { error: "Title is required." };

  const description = formData.get("description") as string;
  const eventDateText = formData.get("eventDateText") as string; // "dateLabel"
  
  try {
    await db.timelineEvent.create({
      data: {
        worldId,
        createdByUserId: session.user.id,
        title,
        description,
        eventDateText,
        eventType: "WORLD",
        eventSortKey: Date.now() // Simple sorting fallback
      }
    });

    revalidatePath(`/worlds/${worldId}/timeline`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to create timeline event." };
  }
}
