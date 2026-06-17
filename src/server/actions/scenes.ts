"use server";

import { db } from "@/server/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createScene(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized." };

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { activeCharacterId: true }
  });

  if (!user?.activeCharacterId) {
    return { error: "You must have an active character selected to create a scene." };
  }

  const title = formData.get("title") as string;
  if (!title || title.trim().length === 0) return { error: "Scene title is required." };

  const worldId = formData.get("worldId") as string;
  if (!worldId) return { error: "World selection is required." };

  const summary = formData.get("summary") as string;
  const visibility = (formData.get("visibility") as string) || "WORLD";

  try {
    const scene = await db.scene.create({
      data: {
        worldId,
        createdByUserId: session.user.id,
        title,
        summary,
        visibility: visibility as any,
        status: "ACTIVE",
        lastActivityAt: new Date(),
        participants: {
          create: {
            userId: session.user.id,
            characterId: user.activeCharacterId,
            participantStatus: "ACTIVE",
          }
        }
      }
    });

    revalidatePath("/scenes");
    revalidatePath(`/worlds/${worldId}`);
    return { success: true, sceneId: scene.id };
  } catch (error) {
    console.error("Error creating scene:", error);
    return { error: "Failed to create scene." };
  }
}

export async function joinScene(sceneId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized." };

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { activeCharacterId: true }
  });

  if (!user?.activeCharacterId) {
    return { error: "Select an active character before joining." };
  }

  try {
    const existing = await db.sceneParticipant.findUnique({
      where: { sceneId_characterId: { sceneId, characterId: user.activeCharacterId } }
    });

    if (existing) {
      if (existing.participantStatus !== "ACTIVE") {
        await db.sceneParticipant.update({
          where: { id: existing.id },
          data: { participantStatus: "ACTIVE" }
        });
      }
      return { success: true };
    }

    await db.sceneParticipant.create({
      data: {
        sceneId,
        characterId: user.activeCharacterId,
        userId: session.user.id,
        participantStatus: "ACTIVE"
      }
    });

    const fullParticipant = await db.sceneParticipant.findUnique({
      where: { sceneId_characterId: { sceneId, characterId: user.activeCharacterId } },
      include: { character: { select: { id: true, name: true, avatarUrl: true } } }
    });

    if (fullParticipant) {
      const { emitToSocket } = await import("@/server/socket-emitter");
      await emitToSocket(`scene:${sceneId}`, "participant_update", fullParticipant);
    }

    revalidatePath(`/scenes/${sceneId}`);
    return { success: true };
  } catch (error) {
    console.error("Error joining scene:", error);
    return { error: "Failed to join scene." };
  }
}

export async function updateSceneStatus(sceneId: string, status: "ACTIVE" | "PAUSED" | "COMPLETED") {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized." };

  try {
    const scene = await db.scene.findUnique({
      where: { id: sceneId },
      include: { world: { select: { ownerUserId: true } } }
    });

    if (!scene) return { error: "Scene not found." };
    
    // Only scene creator or world owner can update status
    if (scene.createdByUserId !== session.user.id && scene.world.ownerUserId !== session.user.id) {
      return { error: "You do not have permission to change this scene's status." };
    }

    await db.scene.update({
      where: { id: sceneId },
      data: { status }
    });

    const { emitToSocket } = await import("@/server/socket-emitter");
    await emitToSocket(`scene:${sceneId}`, "status_update", { status });

    revalidatePath(`/scenes/${sceneId}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating scene status:", error);
    return { error: "Failed to update scene status." };
  }
}
