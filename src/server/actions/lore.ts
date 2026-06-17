"use server";

import { db } from "@/server/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 6);
}

export async function createLoreEntry(worldId: string, prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  // Validate permission (Owner or Admin)
  const membership = await db.worldMembership.findUnique({
    where: { worldId_userId: { worldId, userId: session.user.id } }
  });
  
  if (!membership || !["OWNER", "ADMIN"].includes(membership.role)) {
    return { error: "You do not have permission to create lore." };
  }

  const title = formData.get("title") as string;
  if (!title || title.trim().length === 0) return { error: "Title is required." };

  const body = formData.get("body") as string;
  const category = (formData.get("category") as string) || "OTHER";

  try {
    const slug = generateSlug(title);
    
    await db.loreEntry.create({
      data: {
        worldId,
        createdByUserId: session.user.id,
        title,
        slug,
        category: category as any,
        body,
        visibility: "WORLD",
        canonicalStatus: "CANON"
      }
    });

    revalidatePath(`/worlds/${worldId}/lore`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to create lore entry." };
  }
}
