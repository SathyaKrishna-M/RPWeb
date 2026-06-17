"use server";

import { db } from "@/server/db";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { WorldVisibility } from "@prisma/client";

// ==============================
// Visibility & Settings
// ==============================

export async function updateWorldVisibility(worldId: string, visibility: WorldVisibility, password?: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const membership = await db.worldMembership.findUnique({
    where: { worldId_userId: { worldId, userId: session.user.id } }
  });
  if (membership?.role !== "OWNER") return { error: "Only the owner can change visibility" };

  let passwordHash = null;
  if (visibility === "PASSWORD_PROTECTED" && password) {
    passwordHash = await bcrypt.hash(password, 10);
  }

  await db.world.update({
    where: { id: worldId },
    data: {
      visibility,
      ...(visibility === "PASSWORD_PROTECTED" && passwordHash ? { passwordHash } : {}),
      ...(visibility !== "PASSWORD_PROTECTED" ? { passwordHash: null } : {})
    }
  });

  revalidatePath(`/worlds/${worldId}/settings/access`);
  revalidatePath(`/worlds/${worldId}`);
  return { success: true };
}

// ==============================
// Invite Links
// ==============================

export async function createInviteLink(worldId: string, code: string, maxUses: number | null, expiresAt: Date | null) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const membership = await db.worldMembership.findUnique({
    where: { worldId_userId: { worldId, userId: session.user.id } }
  });
  if (membership?.role !== "OWNER" && membership?.role !== "ADMIN") return { error: "Insufficient permissions" };

  // Validate code uniqueness
  const existing = await db.worldInviteLink.findUnique({ where: { code } });
  if (existing) return { error: "Invite code already in use. Please choose another." };

  await db.worldInviteLink.create({
    data: {
      worldId,
      createdByUserId: session.user.id,
      code,
      maxUses,
      expiresAt
    }
  });

  revalidatePath(`/worlds/${worldId}/settings/access`);
  return { success: true };
}

export async function revokeInviteLink(linkId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const link = await db.worldInviteLink.findUnique({ where: { id: linkId } });
  if (!link) return { error: "Link not found" };

  const membership = await db.worldMembership.findUnique({
    where: { worldId_userId: { worldId: link.worldId, userId: session.user.id } }
  });
  if (membership?.role !== "OWNER" && membership?.role !== "ADMIN") return { error: "Insufficient permissions" };

  await db.worldInviteLink.delete({ where: { id: linkId } });
  revalidatePath(`/worlds/${link.worldId}/settings/access`);
  return { success: true };
}

export async function getInviteLinks(worldId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const links = await db.worldInviteLink.findMany({
    where: { worldId },
    orderBy: { createdAt: 'desc' }
  });
  return { success: true, links };
}

// ==============================
// Whitelist
// ==============================

export async function addToWhitelist(worldId: string, username: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const membership = await db.worldMembership.findUnique({
    where: { worldId_userId: { worldId, userId: session.user.id } }
  });
  if (membership?.role !== "OWNER" && membership?.role !== "ADMIN") return { error: "Insufficient permissions" };

  const targetUser = await db.user.findUnique({ where: { username } });
  if (!targetUser) return { error: "User not found" };

  try {
    await db.worldWhitelist.create({
      data: {
        worldId,
        userId: targetUser.id,
        addedByUserId: session.user.id
      }
    });
    revalidatePath(`/worlds/${worldId}/settings/access`);
    return { success: true };
  } catch (e) {
    return { error: "User is already whitelisted" };
  }
}

export async function removeFromWhitelist(worldId: string, targetUserId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const membership = await db.worldMembership.findUnique({
    where: { worldId_userId: { worldId, userId: session.user.id } }
  });
  if (membership?.role !== "OWNER" && membership?.role !== "ADMIN") return { error: "Insufficient permissions" };

  await db.worldWhitelist.delete({
    where: { worldId_userId: { worldId, userId: targetUserId } }
  });
  revalidatePath(`/worlds/${worldId}/settings/access`);
  return { success: true };
}

export async function getWhitelist(worldId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const whitelist = await db.worldWhitelist.findMany({
    where: { worldId },
    include: { user: { select: { id: true, username: true, profile: true } } },
    orderBy: { createdAt: 'desc' }
  });
  return { success: true, whitelist };
}

// ==============================
// Join Requests
// ==============================

export async function requestJoinWorld(worldId: string, message: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    await db.worldJoinRequest.create({
      data: {
        worldId,
        userId: session.user.id,
        message,
        status: "PENDING"
      }
    });
    return { success: true };
  } catch (e) {
    return { error: "You already have a pending request for this world." };
  }
}

export async function getJoinRequests(worldId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const requests = await db.worldJoinRequest.findMany({
    where: { worldId, status: "PENDING" },
    include: { user: { select: { id: true, username: true, profile: true } } },
    orderBy: { createdAt: 'desc' }
  });
  return { success: true, requests };
}

export async function approveJoinRequest(requestId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const request = await db.worldJoinRequest.findUnique({ where: { id: requestId } });
  if (!request) return { error: "Request not found" };

  const membership = await db.worldMembership.findUnique({
    where: { worldId_userId: { worldId: request.worldId, userId: session.user.id } }
  });
  if (membership?.role !== "OWNER" && membership?.role !== "ADMIN") return { error: "Insufficient permissions" };

  await db.$transaction([
    db.worldJoinRequest.update({
      where: { id: requestId },
      data: { status: "APPROVED" }
    }),
    db.worldMembership.upsert({
      where: { worldId_userId: { worldId: request.worldId, userId: request.userId } },
      create: { worldId: request.worldId, userId: request.userId, role: "READER", status: "ACTIVE" },
      update: { status: "ACTIVE" }
    }),
    db.world.update({
      where: { id: request.worldId },
      data: { memberCount: { increment: 1 } }
    })
  ]);

  revalidatePath(`/worlds/${request.worldId}/settings/access`);
  return { success: true };
}

export async function rejectJoinRequest(requestId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const request = await db.worldJoinRequest.findUnique({ where: { id: requestId } });
  if (!request) return { error: "Request not found" };

  const membership = await db.worldMembership.findUnique({
    where: { worldId_userId: { worldId: request.worldId, userId: session.user.id } }
  });
  if (membership?.role !== "OWNER" && membership?.role !== "ADMIN") return { error: "Insufficient permissions" };

  await db.worldJoinRequest.update({
    where: { id: requestId },
    data: { status: "REJECTED" }
  });

  revalidatePath(`/worlds/${request.worldId}/settings/access`);
  return { success: true };
}

// ==============================
// Core Join Logic
// ==============================

export async function joinWorld(worldId: string, inviteCode?: string, password?: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const world = await db.world.findUnique({ where: { id: worldId } });
  if (!world) return { error: "World not found" };

  const userId = session.user.id;

  // 1. Check if already a member
  const existingMembership = await db.worldMembership.findUnique({
    where: { worldId_userId: { worldId, userId } }
  });
  if (existingMembership && existingMembership.status === "ACTIVE") {
    return { success: true }; // Already in
  }

  // 2. Check Whitelist (Bypasses all checks)
  const isWhitelisted = await db.worldWhitelist.findUnique({
    where: { worldId_userId: { worldId, userId } }
  });

  // 3. Process Invite Code if provided
  let inviteLinkObj = null;
  if (inviteCode) {
    const link = await db.worldInviteLink.findUnique({ where: { code: inviteCode, worldId } });
    if (link) {
      if (link.expiresAt && link.expiresAt < new Date()) {
        return { error: "Invite link has expired." };
      }
      if (link.maxUses && link.currentUses >= link.maxUses) {
        return { error: "Invite link usage limit reached." };
      }
      inviteLinkObj = link;
    } else {
      return { error: "Invalid invite code." };
    }
  }

  let granted = false;

  if (isWhitelisted || inviteLinkObj) {
    granted = true;
  } else if (world.visibility === "PUBLIC") {
    granted = true;
  } else if (world.visibility === "PASSWORD_PROTECTED") {
    if (!password) return { error: "Password required." };
    if (!world.passwordHash) return { error: "World is misconfigured." };
    
    const isValid = await bcrypt.compare(password, world.passwordHash);
    if (!isValid) return { error: "Incorrect password." };
    granted = true;
  } else if (world.visibility === "PRIVATE") {
    return { error: "Private worlds require owner approval. Please submit a join request." };
  } else if (world.visibility === "UNLISTED") {
    return { error: "Unlisted worlds require an invite link to join." };
  }

  if (!granted) {
    return { error: "Permission denied." };
  }

  // Success path: Add member
  await db.$transaction(async (tx) => {
    await tx.worldMembership.upsert({
      where: { worldId_userId: { worldId, userId } },
      create: { worldId, userId, role: inviteLinkObj?.role || "READER", status: "ACTIVE" },
      update: { status: "ACTIVE" }
    });

    if (inviteLinkObj) {
      await tx.worldInviteLink.update({
        where: { id: inviteLinkObj.id },
        data: { currentUses: { increment: 1 } }
      });
    }

    if (!existingMembership || existingMembership.status !== "ACTIVE") {
      await tx.world.update({
        where: { id: worldId },
        data: { memberCount: { increment: 1 } }
      });
    }
  });

  revalidatePath(`/worlds/${worldId}`);
  return { success: true };
}
