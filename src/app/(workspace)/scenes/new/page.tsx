"use client";

import { useActionState } from "react";
import { createScene } from "@/server/actions/scenes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NewScenePage() {
  const [state, action, isPending] = useActionState(createScene, undefined);
  const router = useRouter();

  useEffect(() => {
    if (state?.success && state?.sceneId) {
      router.push(`/scenes/${state.sceneId}`);
    }
  }, [state, router]);

  return (
    <div className="workspace-grid" style={{ gridTemplateColumns: "1fr" }}>
      <section className="panel stack" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h2>Start a New Scene</h2>
        <p className="muted-list" style={{ marginBottom: "24px" }}>
          Scenes are the core building blocks of your roleplay story. By starting a scene, your active character will automatically join it.
        </p>

        <form action={action} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="form-group">
            <label htmlFor="title">Scene Title *</label>
            <input type="text" id="title" name="title" required placeholder="e.g. A Meeting in the Shadows" />
          </div>

          <div className="form-group">
            <label htmlFor="worldId">World ID *</label>
            <input type="text" id="worldId" name="worldId" required placeholder="Enter the ID of the world this scene belongs to" />
            <small style={{ color: "var(--muted)", marginTop: "4px" }}>* In a future update, this will be a dropdown of your worlds.</small>
          </div>

          <div className="form-group">
            <label htmlFor="summary">Scene Summary</label>
            <textarea id="summary" name="summary" rows={3} placeholder="Briefly describe what this scene is about..." />
          </div>

          <div className="form-group">
            <label>Visibility</label>
            <select name="visibility" defaultValue="PUBLIC">
              <option value="PUBLIC">Public (Visible to everyone)</option>
              <option value="WORLD">World (Visible only to world members)</option>
              <option value="PRIVATE">Private (Visible only to participants)</option>
            </select>
          </div>

          {state?.error && (
            <div style={{ color: '#ef4444', fontSize: '0.875rem', padding: "8px", background: "rgba(239, 68, 68, 0.1)", borderRadius: "4px" }}>
              {state.error}
            </div>
          )}

          <div className="button-row" style={{ marginTop: "16px" }}>
            <button type="submit" className="button" disabled={isPending}>
              {isPending ? "Starting..." : "Start Scene"}
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
