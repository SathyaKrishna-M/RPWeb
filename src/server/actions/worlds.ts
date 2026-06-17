"use server";

import { db } from "@/server/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 6);
}

export async function createWorld(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized." };
  }

  const name = formData.get("name") as string;
  if (!name || name.trim().length === 0) {
    return { error: "World name is required." };
  }

  const slug = generateSlug(name);
  const summary = formData.get("summary") as string;
  const description = formData.get("description") as string;
  const genre = formData.get("genre") as string;
  const visibility = (formData.get("visibility") as string) || "PUBLIC";

  try {
    const world = await db.world.create({
      data: {
        name,
        slug,
        summary,
        description,
        genre,
        visibility: visibility as any,
        ownerUserId: session.user.id,
        memberCount: 1, // Owner is implicitly a member
        memberships: {
          create: {
            userId: session.user.id,
            role: "OWNER",
            status: "ACTIVE"
          }
        }
      },
    });

    revalidatePath("/worlds");
    return { success: true, worldId: world.id };
  } catch (error) {
    console.error(error);
    return { error: "Failed to create world." };
  }
}

export async function updateWorld(worldId: string, prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const world = await db.world.findUnique({ where: { id: worldId } });
  if (!world || world.ownerUserId !== session.user.id) {
    return { error: "World not found or unauthorized." };
  }

  const name = formData.get("name") as string;
  if (!name || name.trim().length === 0) return { error: "World name is required." };

  const summary = formData.get("summary") as string;
  const description = formData.get("description") as string;
  const genre = formData.get("genre") as string;
  const visibility = (formData.get("visibility") as string) || "PUBLIC";

  try {
    await db.world.update({
      where: { id: worldId },
      data: { name, summary, description, genre, visibility: visibility as any },
    });

    revalidatePath(`/worlds/${worldId}`);
    revalidatePath("/worlds");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to update world." };
  }
}

export async function joinWorld(worldId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    const existing = await db.worldMembership.findUnique({
      where: { worldId_userId: { worldId, userId: session.user.id } }
    });

    if (existing) {
      if (existing.status !== "ACTIVE") {
        await db.worldMembership.update({
          where: { id: existing.id },
          data: { status: "ACTIVE" }
        });
        await db.world.update({ where: { id: worldId }, data: { memberCount: { increment: 1 } } });
      }
      return { success: true };
    }

    await db.worldMembership.create({
      data: {
        worldId,
        userId: session.user.id,
        role: "CONTRIBUTOR",
        status: "ACTIVE",
      }
    });

    await db.world.update({
      where: { id: worldId },
      data: { memberCount: { increment: 1 } }
    });

    revalidatePath(`/worlds/${worldId}`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to join world." };
  }
}

export async function leaveWorld(worldId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    const membership = await db.worldMembership.findUnique({
      where: { worldId_userId: { worldId, userId: session.user.id } }
    });

    if (!membership || membership.status === "LEFT") return { success: true };

    if (membership.role === "OWNER") {
      return { error: "Owners cannot leave their own world. Transfer ownership or archive the world instead." };
    }

    await db.worldMembership.update({
      where: { id: membership.id },
      data: { status: "LEFT" }
    });

    await db.world.update({
      where: { id: worldId },
      data: { memberCount: { decrement: 1 } }
    });

    revalidatePath(`/worlds/${worldId}`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to leave world." };
  }
}
