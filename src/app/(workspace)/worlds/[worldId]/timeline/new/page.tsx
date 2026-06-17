"use client";

import { useActionState } from "react";
import { createTimelineEvent } from "@/server/actions/timeline";
import { useRouter } from "next/navigation";
import { useEffect, use } from "react";

export default function NewTimelineEventPage({
  params,
}: {
  params: Promise<{ worldId: string }>;
}) {
  const { worldId } = use(params);
  const createWithWorldId = createTimelineEvent.bind(null, worldId);
  const [state, action, isPending] = useActionState(createWithWorldId, undefined);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push(`/worlds/${worldId}/timeline`);
    }
  }, [state, router, worldId]);

  return (
    <section className="panel stack" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h2>Log Historical Event</h2>

      <form action={action} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div className="form-group">
          <label htmlFor="title">Event Title *</label>
          <input type="text" id="title" name="title" required placeholder="e.g. The Cataclysm" />
        </div>

        <div className="form-group">
          <label htmlFor="eventDateText">Date / Epoch</label>
          <input type="text" id="eventDateText" name="eventDateText" placeholder="e.g. Year 402 of the Third Era" />
        </div>

        <div className="form-group">
          <label htmlFor="description">Event Description</label>
          <textarea id="description" name="description" rows={6} placeholder="What happened during this time?" />
        </div>

        {state?.error && (
          <div style={{ color: '#ef4444', fontSize: '0.875rem' }}>
            {state.error}
          </div>
        )}

        <div className="button-row">
          <button type="submit" className="button" disabled={isPending}>
            {isPending ? "Logging..." : "Log Event"}
          </button>
          <button type="button" className="button secondary" onClick={() => router.back()}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
