import { db } from "@/server/db";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { PageShell } from "@/components/layout/page-shell";
import EditCharacterForm from "./edit-character-form";

export default async function EditCharacterPage({
  params,
}: {
  params: Promise<{ characterId: string }>;
}) {
  const { characterId } = await params;
  const session = await auth();

  const character = await db.character.findUnique({
    where: { id: characterId },
  });

  if (!character || character.isArchived) {
    notFound();
  }

  // Permission check
  const isOwner = session?.user?.id === character.ownerUserId;
  if (!isOwner) {
    notFound(); 
  }

  return (
    <PageShell
      eyebrow="Management"
      title="Edit Character"
      description="Update your character's identity and appearance."
    >
      <EditCharacterForm character={character} />
    </PageShell>
  );
}
