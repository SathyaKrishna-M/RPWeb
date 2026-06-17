"use client";

import { useActionState } from "react";
import { createCharacter } from "@/server/actions/characters";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NewCharacterPage() {
  const [state, action, isPending] = useActionState(createCharacter, undefined);
  const router = useRouter();

  useEffect(() => {
    if (state?.success && state?.characterId) {
      router.push(`/characters/${state.characterId}`);
    }
  }, [state, router]);

  return (
    <div className="workspace-grid" style={{ gridTemplateColumns: "1fr" }}>
      <section className="panel stack" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h2>Create New Character</h2>
        <p className="muted-list" style={{ marginBottom: "24px" }}>
          Define your identity. Only the name is required to get started.
        </p>

        <form action={action} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input type="text" id="name" name="name" required placeholder="e.g. Lyra Silvertongue" />
          </div>

          <div className="form-group">
            <label htmlFor="title">Title / Alias</label>
            <input type="text" id="title" name="title" placeholder="e.g. The Worldbreaker" />
          </div>

          <div className="quick-grid">
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input type="text" id="age" name="age" placeholder="e.g. 24, Immortal, Unknown" />
            </div>
            
            <div className="form-group">
              <label>Publish Status</label>
              <select name="isPublished" defaultValue="false">
                <option value="false">Draft (Private)</option>
                <option value="true">Published (Public)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="appearance">Appearance</label>
            <textarea id="appearance" name="appearance" rows={4} placeholder="Physical description, clothing, distinguishing marks..." />
          </div>

          <div className="form-group">
            <label htmlFor="personality">Personality</label>
            <textarea id="personality" name="personality" rows={4} placeholder="Traits, habits, fears, motivations..." />
          </div>

          <div className="form-group">
            <label htmlFor="biography">Biography</label>
            <textarea id="biography" name="biography" rows={6} placeholder="Backstory and history..." />
          </div>

          {state?.error && (
            <div style={{ color: '#ef4444', fontSize: '0.875rem' }}>
              {state.error}
            </div>
          )}

          <div className="button-row">
            <button type="submit" className="button" disabled={isPending}>
              {isPending ? "Creating..." : "Create Character"}
            </button>
            <button type="button" className="button secondary" onClick={() => router.back()}>
              Cancel
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
