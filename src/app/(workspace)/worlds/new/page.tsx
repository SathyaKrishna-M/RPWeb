"use client";

import { useActionState } from "react";
import { createWorld } from "@/server/actions/worlds";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NewWorldPage() {
  const [state, action, isPending] = useActionState(createWorld, undefined);
  const router = useRouter();

  useEffect(() => {
    if (state?.success && state?.worldId) {
      router.push(`/worlds/${state.worldId}`);
    }
  }, [state, router]);

  return (
    <div className="workspace-grid" style={{ gridTemplateColumns: "1fr" }}>
      <section className="panel stack" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h2>Create a New World</h2>
        <p className="muted-list" style={{ marginBottom: "24px" }}>
          Establish a new universe for roleplaying. You can invite others to join after creation.
        </p>

        <form action={action} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="form-group">
            <label htmlFor="name">World Name *</label>
            <input type="text" id="name" name="name" required placeholder="e.g. The Forgotten Realms" />
          </div>

          <div className="quick-grid">
            <div className="form-group">
              <label htmlFor="genre">Genre</label>
              <input type="text" id="genre" name="genre" placeholder="e.g. Sci-Fi, Dark Fantasy" />
            </div>
            
            <div className="form-group">
              <label>Visibility</label>
              <select name="visibility" defaultValue="PUBLIC">
                <option value="PUBLIC">Public (Listed in Directory)</option>
                <option value="UNLISTED">Unlisted (Link only)</option>
                <option value="PRIVATE">Private (Invite only)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="summary">Short Summary</label>
            <textarea id="summary" name="summary" rows={2} placeholder="A brief one-sentence hook..." />
          </div>

          <div className="form-group">
            <label htmlFor="description">Detailed Description</label>
            <textarea id="description" name="description" rows={6} placeholder="Describe the setting, lore, and rules of engagement..." />
          </div>

          {state?.error && (
            <div style={{ color: '#ef4444', fontSize: '0.875rem' }}>
              {state.error}
            </div>
          )}

          <div className="button-row">
            <button type="submit" className="button" disabled={isPending}>
              {isPending ? "Forging World..." : "Create World"}
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
