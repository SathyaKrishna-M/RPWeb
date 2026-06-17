"use client";

import { useTransition } from "react";
import { setActiveCharacter } from "@/server/actions/characters";

type Character = {
  id: string;
  name: string;
};

export function CharacterSwitcher({ characters, activeId }: { characters: Character[], activeId: string | undefined }) {
  const [isPending, startTransition] = useTransition();

  const handleSwitch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    startTransition(() => {
      setActiveCharacter(val === "none" ? null : val);
    });
  };

  return (
    <div style={{ padding: "12px 16px", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
      <div style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
        Active Character
      </div>
      <select 
        value={activeId || "none"} 
        onChange={handleSwitch}
        disabled={isPending}
        style={{ width: "100%", padding: "6px 8px", fontSize: "0.85rem", background: "var(--surface-strong)", color: "var(--ink)" }}
      >
        <option value="none">-- Playing as OOC --</option>
        {characters.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
    </div>
  );
}
