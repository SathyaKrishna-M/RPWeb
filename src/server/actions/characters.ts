"use server";

import { db } from "@/server/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 6);
}

export async function createCharacter(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in to create a character." };
  }

  const name = formData.get("name") as string;
  if (!name || name.trim().length === 0) {
    return { error: "Character name is required." };
  }

  const title = formData.get("title") as string;
  const age = formData.get("age") as string;
  const appearance = formData.get("appearance") as string;
  const personality = formData.get("personality") as string;
  const biography = formData.get("biography") as string;
  const isPublished = formData.get("isPublished") === "true";

  const slug = generateSlug(name);

  try {
    const character = await db.character.create({
      data: {
        name,
        slug,
        title,
        age,
        appearance,
        personality,
        biography,
        isPublished,
        ownerUserId: session.user.id,
      },
    });

    revalidatePath("/characters");
    // Redirect must happen outside try/catch if it's the standard NextJS pattern, 
    // but Next 15 handles it correctly. Let's return success and handle redirect in client.
    return { success: true, characterId: character.id };
  } catch (error) {
    console.error(error);
    return { error: "Failed to create character." };
  }
}

export async function updateCharacter(characterId: string, prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized." };
  }

  const character = await db.character.findUnique({ where: { id: characterId } });
  if (!character || character.ownerUserId !== session.user.id) {
    return { error: "Character not found or you do not have permission." };
  }

  const name = formData.get("name") as string;
  if (!name || name.trim().length === 0) {
    return { error: "Character name is required." };
  }

  const title = formData.get("title") as string;
  const age = formData.get("age") as string;
  const appearance = formData.get("appearance") as string;
  const personality = formData.get("personality") as string;
  const biography = formData.get("biography") as string;
  const isPublished = formData.get("isPublished") === "true";

  try {
    await db.character.update({
      where: { id: characterId },
      data: {
        name,
        title,
        age,
        appearance,
        personality,
        biography,
        isPublished,
      },
    });

    revalidatePath(`/characters/${characterId}`);
    revalidatePath("/characters");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to update character." };
  }
}

export async function deleteCharacter(characterId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized." };
  }

  const character = await db.character.findUnique({ where: { id: characterId } });
  if (!character || character.ownerUserId !== session.user.id) {
    return { error: "Character not found or you do not have permission." };
  }

  try {
    // Soft delete or hard delete. Let's archive for now.
    await db.character.update({
      where: { id: characterId },
      data: { isArchived: true, status: "ARCHIVED" },
    });

    revalidatePath("/characters");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to delete character." };
  }
}

export async function setActiveCharacter(characterId: string | null) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized." };
  }

  try {
    if (characterId) {
      // Verify ownership
      const character = await db.character.findUnique({ where: { id: characterId } });
      if (!character || character.ownerUserId !== session.user.id) {
        return { error: "Character not found or unauthorized." };
      }
    }

    // Update User DB
    await db.user.update({
      where: { id: session.user.id },
      data: { activeCharacterId: characterId },
    });

    // Update Cookie for instant UI updates
    const cookieStore = await cookies();
    if (characterId) {
      cookieStore.set("active_character", characterId, { path: "/", maxAge: 60 * 60 * 24 * 30 }); // 30 days
    } else {
      cookieStore.delete("active_character");
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to set active character." };
  }
}
