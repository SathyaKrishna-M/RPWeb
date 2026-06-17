"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WorldVisibility } from "@prisma/client";
import { joinWorld, requestJoinWorld } from "@/server/actions/world-access";

export function JoinClient({ 
  worldId, 
  visibility, 
  inviteCode,
  existingRequest
}: { 
  worldId: string;
  visibility: WorldVisibility;
  inviteCode?: string;
  existingRequest: any;
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async () => {
    setIsPending(true);
    setError(null);
    const res = await joinWorld(worldId, inviteCode, password);
    if (res.error) {
      setError(res.error);
      setIsPending(false);
    } else {
      router.push(`/worlds/${worldId}`);
    }
  };

  const handleRequest = async () => {
    setIsPending(true);
    setError(null);
    const res = await requestJoinWorld(worldId, requestMessage);
    if (res.error) {
      setError(res.error);
      setIsPending(false);
    } else {
      router.refresh(); // Refresh to show pending status
    }
  };

  if (inviteCode) {
    return (
      <div className="stack">
        <p>You have been invited to join this world!</p>
        {error && <p style={{ color: "red", fontSize: "0.875rem" }}>{error}</p>}
        <button className="button" onClick={handleJoin} disabled={isPending}>
          {isPending ? "Joining..." : "Accept Invite"}
        </button>
      </div>
    );
  }

  if (visibility === "PUBLIC") {
    return (
      <div className="stack">
        <p>This world is open to the public.</p>
        {error && <p style={{ color: "red", fontSize: "0.875rem" }}>{error}</p>}
        <button className="button" onClick={handleJoin} disabled={isPending}>
          {isPending ? "Joining..." : "Join World"}
        </button>
      </div>
    );
  }

  if (visibility === "PASSWORD_PROTECTED") {
    return (
      <div className="stack" style={{ textAlign: "left", marginTop: "1rem" }}>
        <p className="text-muted" style={{ textAlign: "center" }}>This world requires a password.</p>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isPending} />
        </div>
        {error && <p style={{ color: "red", fontSize: "0.875rem" }}>{error}</p>}
        <button className="button" onClick={handleJoin} disabled={isPending || !password}>
          {isPending ? "Joining..." : "Join World"}
        </button>
      </div>
    );
  }

  if (visibility === "PRIVATE") {
    if (existingRequest) {
      return (
        <div className="stack" style={{ marginTop: "1rem" }}>
          <p style={{ color: "var(--accent)" }}>Your request to join is currently {existingRequest.status.toLowerCase()}.</p>
        </div>
      );
    }

    return (
      <div className="stack" style={{ textAlign: "left", marginTop: "1rem" }}>
        <p className="text-muted" style={{ textAlign: "center" }}>This is a private world. You must request access from the owner.</p>
        <div className="form-group">
          <label>Message (Optional)</label>
          <textarea 
            rows={3} 
            value={requestMessage} 
            onChange={(e) => setRequestMessage(e.target.value)} 
            placeholder="Introduce yourself or explain why you want to join..."
            disabled={isPending}
          />
        </div>
        {error && <p style={{ color: "red", fontSize: "0.875rem" }}>{error}</p>}
        <button className="button" onClick={handleRequest} disabled={isPending}>
          {isPending ? "Sending..." : "Request Access"}
        </button>
      </div>
    );
  }

  if (visibility === "UNLISTED") {
    return (
      <div className="stack" style={{ marginTop: "1rem" }}>
        <p className="text-muted">This world is unlisted. You need a valid invite link to join.</p>
      </div>
    );
  }

  return null;
}
