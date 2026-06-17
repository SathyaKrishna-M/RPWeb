"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/components/providers/socket-provider";
import { NovelText } from "@/components/ui/novel-text";

export function SceneClient({ sceneId, initialPosts }: { sceneId: string, initialPosts: any[] }) {
  const { socket } = useSocket();
  const [posts, setPosts] = useState(initialPosts);

  useEffect(() => {
    if (!socket) return;

    const handleNewPost = (post: any) => {
      setPosts((prev) => {
        if (prev.find(p => p.id === post.id)) return prev;
        return [...prev, post];
      });
      // Scroll to bottom when a new post arrives
      setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 100);
    };

    socket.on("new_post", handleNewPost);
    return () => {
      socket.off("new_post", handleNewPost);
    };
  }, [socket]);

  if (posts.length === 0) {
    return (
      <div style={{ textAlign: "center", color: "var(--muted)", fontStyle: "italic", padding: "40px 0" }}>
        The scene is quiet. No one has acted yet.
      </div>
    );
  }

  return (
    <div className="stack" style={{ gap: "48px" }}>
      {posts.map((post) => (
        <article key={post.id} style={{ display: "flex", gap: "20px" }}>
          <div style={{ flexShrink: 0 }}>
            <div style={{ 
              width: "48px", height: "48px", borderRadius: "50%", 
              background: post.character?.avatarUrl ? `url(${post.character.avatarUrl}) center/cover` : "var(--gradient-subtle)",
              border: "2px solid var(--line)"
            }} />
          </div>
          
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "8px" }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem", color: "var(--ink)" }}>{post.character?.name || "Unknown"}</h3>
              <time style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                {new Date(post.createdAt).toLocaleString()} {post.editedAt && "(Edited)"}
              </time>
            </div>
            
            <NovelText content={post.body} />
          </div>
        </article>
      ))}
    </div>
  );
}
