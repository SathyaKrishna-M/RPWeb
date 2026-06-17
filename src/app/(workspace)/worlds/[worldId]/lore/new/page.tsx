"use client";

import { useActionState } from "react";
import { createLoreEntry } from "@/server/actions/lore";
import { useRouter } from "next/navigation";
import { useEffect, use } from "react";

export default function NewLorePage({
  params,
}: {
  params: Promise<{ worldId: string }>;
}) {
  const { worldId } = use(params);
  const createWithWorldId = createLoreEntry.bind(null, worldId);
  const [state, action, isPending] = useActionState(createWithWorldId, undefined);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push(`/worlds/${worldId}/lore`);
    }
  }, [state, router, worldId]);

  return (
    <section className="panel stack" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h2>Create Lore Entry</h2>

      <form action={action} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input type="text" id="title" name="title" required placeholder="e.g. The Kingdom of Velmora" />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" defaultValue="LOCATION">
            <option value="LOCATION">Location / Kingdom</option>
            <option value="CULTURE">Culture & Society</option>
            <option value="HISTORY">History & Myth</option>
            <option value="MAGIC">Magic & Rules</option>
            <option value="ORGANIZATION">Organization / Guild</option>
            <option value="ITEM">Item / Artifact</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="body">Content *</label>
          <textarea id="body" name="body" rows={10} required placeholder="Detailed description..." />
        </div>

        {state?.error && (
          <div style={{ color: '#ef4444', fontSize: '0.875rem' }}>
            {state.error}
          </div>
        )}

        <div className="button-row">
          <button type="submit" className="button" disabled={isPending}>
            {isPending ? "Publishing..." : "Publish Lore"}
          </button>
          <button type="button" className="button secondary" onClick={() => router.back()}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
