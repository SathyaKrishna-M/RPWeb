"use client";

import { useActionState } from "react";
import { updateWorld } from "@/server/actions/worlds";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function WorldSettingsForm({ world }: { world: any }) {
  const updateWithId = updateWorld.bind(null, world.id);
  const [state, action, isPending] = useActionState(updateWithId, undefined);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push(`/worlds/${world.id}`);
    }
  }, [state, router, world.id]);

  return (
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div className="form-group">
        <label htmlFor="name">World Name</label>
        <input type="text" id="name" name="name" required defaultValue={world.name} />
      </div>

      <div className="quick-grid">
        <div className="form-group">
          <label htmlFor="genre">Genre</label>
          <input type="text" id="genre" name="genre" defaultValue={world.genre || ""} />
        </div>
        
        <div className="form-group">
          <label>Visibility</label>
          <select name="visibility" defaultValue={world.visibility}>
            <option value="PUBLIC">Public</option>
            <option value="UNLISTED">Unlisted</option>
            <option value="PRIVATE">Private</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="summary">Short Summary</label>
        <textarea id="summary" name="summary" rows={2} defaultValue={world.summary || ""} />
      </div>

      <div className="form-group">
        <label htmlFor="description">Detailed Description</label>
        <textarea id="description" name="description" rows={6} defaultValue={world.description || ""} />
      </div>

      {state?.error && (
        <div style={{ color: '#ef4444', fontSize: '0.875rem' }}>
          {state.error}
        </div>
      )}

      <div className="button-row">
        <button type="submit" className="button" disabled={isPending}>
          {isPending ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
