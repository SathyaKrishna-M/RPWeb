"use client";

import { useState } from "react";
import { WorldVisibility } from "@prisma/client";
import { updateWorldVisibility, createInviteLink, revokeInviteLink, addToWhitelist, removeFromWhitelist, approveJoinRequest, rejectJoinRequest } from "@/server/actions/world-access";

export function AccessClient({
  worldId,
  currentVisibility,
  inviteLinks,
  whitelist,
  joinRequests
}: {
  worldId: string;
  currentVisibility: WorldVisibility;
  inviteLinks: any[];
  whitelist: any[];
  joinRequests: any[];
}) {
  const [visibility, setVisibility] = useState<WorldVisibility>(currentVisibility);
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [inviteCode, setInviteCode] = useState("");
  const [maxUses, setMaxUses] = useState<number | "">("");
  
  const [whitelistUsername, setWhitelistUsername] = useState("");

  const handleSaveVisibility = async () => {
    setIsPending(true);
    setError(null);
    const res = await updateWorldVisibility(worldId, visibility, password);
    if (res.error) setError(res.error);
    else alert("Visibility updated!");
    setIsPending(false);
  };

  const handleCreateInvite = async () => {
    if (!inviteCode) return alert("Code is required");
    setIsPending(true);
    const res = await createInviteLink(worldId, inviteCode, maxUses === "" ? null : Number(maxUses), null);
    if (res.error) alert(res.error);
    else {
      setInviteCode("");
      setMaxUses("");
    }
    setIsPending(false);
  };

  const handleAddWhitelist = async () => {
    if (!whitelistUsername) return;
    setIsPending(true);
    const res = await addToWhitelist(worldId, whitelistUsername);
    if (res.error) alert(res.error);
    else setWhitelistUsername("");
    setIsPending(false);
  };

  return (
    <div className="stack" style={{ gap: "2rem" }}>
      
      {/* Visibility Section */}
      <div className="panel stack">
        <h3>Visibility & Access</h3>
        {error && <div style={{ color: "red", fontSize: "0.875rem" }}>{error}</div>}
        
        <div className="form-group">
          <label>World Visibility</label>
          <select value={visibility} onChange={(e) => setVisibility(e.target.value as WorldVisibility)}>
            <option value="PUBLIC">Public (Anyone can join)</option>
            <option value="UNLISTED">Unlisted (Invite link required)</option>
            <option value="PRIVATE">Private (Join request required)</option>
            <option value="PASSWORD_PROTECTED">Password Protected</option>
          </select>
        </div>

        {visibility === "PASSWORD_PROTECTED" && (
          <div className="form-group">
            <label>Set Password (leave blank to keep current)</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        )}

        <div>
          <button className="button" onClick={handleSaveVisibility} disabled={isPending}>Save Visibility</button>
        </div>
      </div>

      {/* Invite Links */}
      <div className="panel stack">
        <h3>Invite Links</h3>
        <p className="text-muted text-sm">Create shareable links that bypass visibility checks.</p>
        
        <div style={{ display: "flex", gap: "1rem", alignItems: "flex-end" }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Code (e.g. secret-club)</label>
            <input type="text" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} />
          </div>
          <div className="form-group" style={{ width: "100px" }}>
            <label>Max Uses</label>
            <input type="number" placeholder="∞" value={maxUses} onChange={(e) => setMaxUses(e.target.value as any)} />
          </div>
          <button className="button secondary" onClick={handleCreateInvite} disabled={isPending} style={{ marginBottom: "2px" }}>
            Create Link
          </button>
        </div>

        {inviteLinks.length > 0 && (
          <table style={{ width: "100%", marginTop: "1rem", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                <th style={{ padding: "0.5rem" }}>Code</th>
                <th style={{ padding: "0.5rem" }}>Uses</th>
                <th style={{ padding: "0.5rem" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {inviteLinks.map(link => (
                <tr key={link.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "0.5rem" }}>{link.code}</td>
                  <td style={{ padding: "0.5rem" }}>{link.currentUses} / {link.maxUses || "∞"}</td>
                  <td style={{ padding: "0.5rem" }}>
                    <button className="button secondary" style={{ padding: "4px 8px", fontSize: "0.8rem" }} onClick={() => revokeInviteLink(link.id)}>Revoke</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Whitelist */}
      <div className="panel stack">
        <h3>Whitelist</h3>
        <p className="text-muted text-sm">Pre-approve specific users to join without needing requests, links, or passwords.</p>
        
        <div style={{ display: "flex", gap: "1rem", alignItems: "flex-end" }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Username</label>
            <input type="text" value={whitelistUsername} onChange={(e) => setWhitelistUsername(e.target.value)} />
          </div>
          <button className="button secondary" onClick={handleAddWhitelist} disabled={isPending} style={{ marginBottom: "2px" }}>
            Add User
          </button>
        </div>

        {whitelist.length > 0 && (
          <ul style={{ marginTop: "1rem", paddingLeft: "1.5rem" }}>
            {whitelist.map(w => (
              <li key={w.id} style={{ marginBottom: "0.5rem" }}>
                {w.user.username} <button className="button secondary" style={{ padding: "2px 6px", fontSize: "0.75rem", marginLeft: "1rem" }} onClick={() => removeFromWhitelist(worldId, w.userId)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Join Requests */}
      <div className="panel stack">
        <h3>Join Requests</h3>
        {joinRequests.length === 0 ? (
          <p className="text-muted text-sm">No pending requests.</p>
        ) : (
          <div className="stack" style={{ gap: "1rem", marginTop: "1rem" }}>
            {joinRequests.map(req => (
              <div key={req.id} style={{ padding: "1rem", border: "1px solid var(--border)", borderRadius: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <strong>{req.user.username}</strong> requested to join
                    <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "var(--muted)", fontStyle: "italic" }}>
                      "{req.message || "No message provided."}"
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button className="button" style={{ background: "var(--success)" }} onClick={() => approveJoinRequest(req.id)}>Approve</button>
                    <button className="button secondary" onClick={() => rejectJoinRequest(req.id)}>Reject</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
