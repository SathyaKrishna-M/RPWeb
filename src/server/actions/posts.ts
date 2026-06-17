"use server";

import { db } from "@/server/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createPost(sceneId: string, prevState: any, formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: "Unauthorized." };

  const body = formData.get("body") as string;
  if (!body || body.trim().length === 0) {
    return { error: "Post cannot be empty." };
  }

  try {
    // We use a transaction to guarantee sequence numbering
    const result = await db.$transaction(async (tx) => {
      // 1. Verify User and Active Character
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { activeCharacterId: true }
      });
      if (!user?.activeCharacterId) {
        throw new Error("You must select an active character to post.");
      }

      // 2. Verify Scene is active
      const scene = await tx.scene.findUnique({
        where: { id: sceneId },
        select: { status: true }
      });
      if (!scene || scene.status === "COMPLETED") {
        throw new Error("This scene is completed and read-only.");
      }

      // 3. Verify character is a participant
      const participant = await tx.sceneParticipant.findUnique({
        where: { sceneId_characterId: { sceneId, characterId: user.activeCharacterId } }
      });
      if (!participant || participant.participantStatus !== "ACTIVE") {
        throw new Error("Your character must join the scene to post.");
      }

      // 4. Calculate next sequence number
      const lastPost = await tx.scenePost.findFirst({
        where: { sceneId },
        orderBy: { sequenceNumber: "desc" },
        select: { sequenceNumber: true }
      });
      const nextSequence = (lastPost?.sequenceNumber || 0) + 1;

      // 5. Create the post
      const post = await tx.scenePost.create({
        data: {
          sceneId,
          characterId: user.activeCharacterId,
          userId,
          body,
          sequenceNumber: nextSequence,
          postType: "IN_CHARACTER"
        }
      });

      // 6. Update timestamps
      await tx.scene.update({
        where: { id: sceneId },
        data: { lastActivityAt: new Date() }
      });

      await tx.sceneParticipant.update({
        where: { id: participant.id },
        data: { lastPostAt: new Date() }
      });

      return post;
    });

    // Fetch full post to broadcast it
    const fullPost = await db.scenePost.findUnique({
      where: { id: result.id },
      include: { character: { select: { name: true, avatarUrl: true } } }
    });
    
    if (fullPost) {
      const { emitToSocket } = await import("@/server/socket-emitter");
      await emitToSocket(`scene:${sceneId}`, "new_post", fullPost);
    }

    revalidatePath(`/scenes/${sceneId}`);
    return { success: true, postId: result.id };
  } catch (error: any) {
    console.error("Error creating post:", error);
    return { error: error.message || "Failed to create post." };
  }
}

export async function editPost(postId: string, prevState: any, formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: "Unauthorized." };

  const body = formData.get("body") as string;
  if (!body || body.trim().length === 0) {
    return { error: "Post cannot be empty." };
  }

  try {
    const post = await db.scenePost.findUnique({
      where: { id: postId },
      include: { scene: { select: { status: true } } }
    });

    if (!post) return { error: "Post not found." };
    if (post.userId !== userId) return { error: "You can only edit your own posts." };
    if (post.scene.status === "COMPLETED") return { error: "Cannot edit posts in a completed scene." };

    await db.scenePost.update({
      where: { id: postId },
      data: {
        body,
        editedAt: new Date()
      }
    });

    revalidatePath(`/scenes/${post.sceneId}`);
    return { success: true };
  } catch (error) {
    console.error("Error editing post:", error);
    return { error: "Failed to edit post." };
  }
}
