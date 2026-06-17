"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/components/providers/socket-provider";
import Link from "next/link";

export function ParticipantSidebar({ sceneId, initialParticipants }: { sceneId: string, initialParticipants: any[] }) {
  const { socket } = useSocket();
  const [participants, setParticipants] = useState(initialParticipants);

  useEffect(() => {
    if (!socket) return;
    
    // Join scene room to receive updates
    socket.emit("join_scene", sceneId);

    const handleUpdate = (newParticipant: any) => {
      setParticipants((prev) => {
        const exists = prev.find(p => p.id === newParticipant.id);
        if (exists) {
          return prev.map(p => p.id === newParticipant.id ? newParticipant : p);
        }
        return [...prev, newParticipant];
      });
    };

    socket.on("participant_update", handleUpdate);
    return () => {
      socket.off("participant_update", handleUpdate);
      socket.emit("leave_scene", sceneId);
    };
  }, [socket, sceneId]);

  const activeParticipants = participants.filter(p => p.participantStatus === "ACTIVE");

  return (
    <aside className="panel stack" style={{ width: "250px", flexShrink: 0, padding: "16px", alignSelf: "start", position: "sticky", top: "120px" }}>
      <h3 style={{ fontSize: "1rem", borderBottom: "1px solid var(--line)", paddingBottom: "8px", marginBottom: "16px" }}>
        Participants ({activeParticipants.length})
      </h3>
      {activeParticipants.length === 0 ? (
        <p className="muted-list" style={{ fontSize: "0.85rem" }}>No active participants.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
          {activeParticipants.map(p => (
            <li key={p.id}>
              <Link href={`/characters/${p.character.id}`} style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "var(--ink)" }}>
                <div style={{ 
                  width: "32px", height: "32px", borderRadius: "50%", 
                  background: p.character.avatarUrl ? `url(${p.character.avatarUrl}) center/cover` : "var(--gradient-subtle)",
                  border: "1px solid var(--line)"
                }} />
                <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>{p.character.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
