"use client";

import { useActionState } from "react";
import { updateCharacter, deleteCharacter } from "@/server/actions/characters";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// For an edit form, we normally fetch the initial data in a server component 
// and pass it to this client component, but let's implement a wrapper.
export default function EditCharacterForm({ character }: { character: any }) {
  const updateWithId = updateCharacter.bind(null, character.id);
  const [state, action, isPending] = useActionState(updateWithId, undefined);
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (state?.success) {
      router.push(`/characters/${character.id}`);
    }
  }, [state, router, character.id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to archive/delete this character?")) return;
    setIsDeleting(true);
    const result = await deleteCharacter(character.id);
    setIsDeleting(false);
    if (result.success) {
      router.push("/characters");
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="workspace-grid" style={{ gridTemplateColumns: "1fr" }}>
      <section className="panel stack" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h2>Edit Character: {character.name}</h2>

        <form action={action} style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input type="text" id="name" name="name" required defaultValue={character.name} />
          </div>

          <div className="form-group">
            <label htmlFor="title">Title / Alias</label>
            <input type="text" id="title" name="title" defaultValue={character.title || ""} />
          </div>

          <div className="quick-grid">
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input type="text" id="age" name="age" defaultValue={character.age || ""} />
            </div>
            
            <div className="form-group">
              <label>Publish Status</label>
              <select name="isPublished" defaultValue={character.isPublished ? "true" : "false"}>
                <option value="false">Draft (Private)</option>
                <option value="true">Published (Public)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="appearance">Appearance</label>
            <textarea id="appearance" name="appearance" rows={4} defaultValue={character.appearance || ""} />
          </div>

          <div className="form-group">
            <label htmlFor="personality">Personality</label>
            <textarea id="personality" name="personality" rows={4} defaultValue={character.personality || ""} />
          </div>

          <div className="form-group">
            <label htmlFor="biography">Biography</label>
            <textarea id="biography" name="biography" rows={6} defaultValue={character.biography || ""} />
          </div>

          {state?.error && (
            <div style={{ color: '#ef4444', fontSize: '0.875rem' }}>
              {state.error}
            </div>
          )}

          <div className="button-row" style={{ justifyContent: "space-between" }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="button" disabled={isPending || isDeleting}>
                {isPending ? "Saving..." : "Save Changes"}
              </button>
              <button type="button" className="button secondary" onClick={() => router.back()} disabled={isPending || isDeleting}>
                Cancel
              </button>
            </div>
            
            <button type="button" className="button secondary" style={{ borderColor: '#ef4444', color: '#ef4444' }} onClick={handleDelete} disabled={isPending || isDeleting}>
              {isDeleting ? "Archiving..." : "Archive Character"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
