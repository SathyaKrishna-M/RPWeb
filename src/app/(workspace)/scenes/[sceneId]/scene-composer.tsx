"use client";

import { useActionState, useEffect, useRef } from "react";
import { createPost } from "@/server/actions/posts";
import { useRouter } from "next/navigation";

export function SceneComposer({ sceneId, isActiveParticipant }: { sceneId: string, isActiveParticipant: boolean }) {
  const createForScene = createPost.bind(null, sceneId);
  const [state, action, isPending] = useActionState(createForScene, undefined);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertFormat = (formatStr: string, cursorOffset: number) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;

    textarea.value = value.substring(0, start) + formatStr + value.substring(end);
    textarea.focus();
    textarea.selectionStart = textarea.selectionEnd = start + cursorOffset;
  };

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      router.refresh();
      // Scroll to bottom
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, [state, router]);

  if (!isActiveParticipant) {
    return (
      <div className="panel" style={{ textAlign: "center", padding: "24px", color: "var(--muted)", background: "var(--surface-strong)" }}>
        You must join this scene with an active character to post.
      </div>
    );
  }

  return (
    <div style={{ position: "sticky", bottom: 0, padding: "16px", background: "var(--surface)", borderTop: "1px solid var(--line)", zIndex: 10 }}>
      <form ref={formRef} action={action} style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "800px", margin: "0 auto" }}>
        
        {state?.error && (
          <div style={{ color: '#ef4444', fontSize: '0.85rem' }}>
            {state.error}
          </div>
        )}

        <div style={{ display: "flex", gap: "8px" }}>
          <button type="button" onClick={() => insertFormat('""', 1)} className="button secondary" style={{ padding: "4px 8px", fontSize: "0.85rem" }}>Dialogue</button>
          <button type="button" onClick={() => insertFormat('**', 1)} className="button secondary" style={{ padding: "4px 8px", fontSize: "0.85rem" }}>Action</button>
          <button type="button" onClick={() => insertFormat('__', 1)} className="button secondary" style={{ padding: "4px 8px", fontSize: "0.85rem" }}>Thought</button>
          <button type="button" onClick={() => { textareaRef.current?.focus() }} className="button secondary" style={{ padding: "4px 8px", fontSize: "0.85rem" }}>Narration</button>
        </div>

        <textarea 
          ref={textareaRef}
          name="body" 
          rows={4} 
          required 
          placeholder="Write your next post... (Use double quotes for dialogue, asterisks for actions)"
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface-strong)", color: "var(--ink)", fontFamily: "inherit", resize: "vertical" }}
        />
        
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" className="button" disabled={isPending}>
            {isPending ? "Posting..." : "Post Reply"}
          </button>
        </div>
      </form>
    </div>
  );
}
