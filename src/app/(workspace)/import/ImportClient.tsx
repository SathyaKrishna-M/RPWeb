"use client"

import { useState } from "react"
import { processTelegramImport } from "@/server/actions/import"
import { Loader2 } from "lucide-react"

type ParsedMessage = {
  sender: string;
  text: string;
  timestamp: string;
};

export default function ImportClient({ characters }: { characters: any[] }) {
  const [file, setFile] = useState<File | null>(null)
  const [parsing, setParsing] = useState(false)
  const [importing, setImporting] = useState(false)
  const [messages, setMessages] = useState<ParsedMessage[]>([])
  const [participants, setParticipants] = useState<string[]>([])
  
  const [worldName, setWorldName] = useState("Imported World")
  const [myCharacterId, setMyCharacterId] = useState(characters[0]?.id || "")
  const [characterMap, setCharacterMap] = useState<Record<string, string>>({})

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const parseFile = async () => {
    if (!file) return;
    setParsing(true)
    try {
      const text = await file.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/html");

      const messageNodes = doc.querySelectorAll(".message.default");
      const parsed: ParsedMessage[] = [];
      const parts = new Set<string>();

      let lastSender = "Unknown";

      messageNodes.forEach((node) => {
        const fromNameNode = node.querySelector(".from_name");
        if (fromNameNode) {
          lastSender = fromNameNode.textContent?.trim() || "Unknown";
        }

        const textNode = node.querySelector(".text");
        const dateNode = node.querySelector(".date");

        if (textNode) {
          const textContent = textNode.textContent?.trim() || "";
          let timestamp = new Date().toISOString();
          
          if (dateNode) {
            const titleDate = dateNode.getAttribute("title");
            if (titleDate) {
              const d = new Date(titleDate);
              if (!isNaN(d.getTime())) {
                timestamp = d.toISOString();
              }
            }
          }

          if (textContent) {
            parsed.push({ sender: lastSender, text: textContent, timestamp });
            parts.add(lastSender);
          }
        }
      });

      setMessages(parsed);
      setParticipants(Array.from(parts));
      
      const initialMap: Record<string, string> = {};
      Array.from(parts).forEach(p => {
        initialMap[p] = ""; // unmapped by default
      });
      setCharacterMap(initialMap);

    } catch (e) {
      console.error(e)
      alert("Failed to parse HTML file");
    } finally {
      setParsing(false)
    }
  }

  const handleImport = async () => {
    if (!worldName || !myCharacterId) {
      alert("World name and your character are required.");
      return;
    }

    setImporting(true)
    try {
      await processTelegramImport(worldName, messages, characterMap, myCharacterId)
    } catch (e) {
      console.error(e)
      alert("Import failed.")
      setImporting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl p-6 mt-8">
      <h1 className="text-3xl font-bold">Import Telegram History</h1>
      <p className="text-slate-400 mt-2">Upload your messages.html exported from Telegram Desktop.</p>

      {!messages.length ? (
        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-8">
          <input type="file" accept=".html" onChange={handleFileChange} className="block w-full text-slate-300 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-indigo-500" />
          
          <button 
            onClick={parseFile} 
            disabled={!file || parsing}
            className="mt-6 flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
          >
            {parsing ? <Loader2 className="animate-spin" size={16} /> : null}
            Preview Import
          </button>
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold text-white">1. World Details</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300">World Name</label>
                <input type="text" value={worldName} onChange={e => setWorldName(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Join World As</label>
                <select value={myCharacterId} onChange={e => setMyCharacterId(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white">
                  {characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold text-white">2. Map Participants to Characters</h2>
            <p className="text-sm text-slate-400 mt-1">Found {messages.length} messages from {participants.length} participants.</p>
            
            <div className="mt-4 space-y-4">
              {participants.map(p => (
                <div key={p} className="flex items-center gap-4">
                  <div className="w-1/3 font-medium text-slate-300">{p}</div>
                  <div className="w-2/3">
                    <select 
                      value={characterMap[p]} 
                      onChange={e => setCharacterMap({ ...characterMap, [p]: e.target.value })}
                      className="block w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white"
                    >
                      <option value="">-- Skip / Do Not Import --</option>
                      {characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={handleImport} 
            disabled={importing}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-500 disabled:opacity-50"
          >
            {importing ? <Loader2 className="animate-spin" size={16} /> : null}
            Confirm & Import
          </button>
        </div>
      )}
    </div>
  )
}
