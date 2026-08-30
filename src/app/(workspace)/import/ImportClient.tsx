"use client"

import { useState } from "react"
import { processTelegramImport, NewCharacterDef } from "@/server/actions/import"
import { Loader2, UploadCloud, Users, ArrowRight, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

type ParsedMessage = {
  sender: string;
  text: string;
  timestamp: string;
};

type ImportCharacter = { id: string; name: string }

export default function ImportClient({ characters }: { characters: ImportCharacter[] }) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  
  // Step 1: File
  const [file, setFile] = useState<File | null>(null)
  const [parsing, setParsing] = useState(false)
  
  // Step 2: Preview Stats
  const [messages, setMessages] = useState<ParsedMessage[]>([])
  const [participants, setParticipants] = useState<string[]>([])
  
  // Step 3: Mapping
  // mapped as "uuid", "SKIP", or "CREATE_NEW"
  const [characterMap, setCharacterMap] = useState<Record<string, string>>({})
  // If CREATE_NEW, store the drafts here
  const [newCharacterDrafts, setNewCharacterDrafts] = useState<Record<string, {name: string, avatarUrl: string, bio: string}>>({})
  const [myCharacterId, setMyCharacterId] = useState(characters[0]?.id || "")

  // Step 4: World Details
  const [worldName, setWorldName] = useState("Imported World")
  const [worldDescription, setWorldDescription] = useState("")
  const [importing, setImporting] = useState(false)

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
          let textContent = textNode.innerHTML;
          textContent = textContent.replace(/<br\s*\/?>/gi, '\n');
          const temp = document.createElement('div');
          temp.innerHTML = textContent;
          textContent = temp.textContent || temp.innerText || "";
          textContent = textContent.trim();

          let timestamp = new Date().toISOString();
          
          if (dateNode) {
            const titleDate = dateNode.getAttribute("title");
            if (titleDate) {
              const match = titleDate.match(/^(\d{2})\.(\d{2})\.(\d{4}) (\d{2}:\d{2}:\d{2})/);
              if (match) {
                const [, d, m, y, t] = match;
                const tzMatch = titleDate.match(/UTC([+-]\d{2}:\d{2})/);
                const tz = tzMatch ? tzMatch[1] : 'Z';
                const dObj = new Date(`${y}-${m}-${d}T${t}${tz}`);
                if (!isNaN(dObj.getTime())) {
                  timestamp = dObj.toISOString();
                }
              } else {
                const dObj = new Date(titleDate);
                if (!isNaN(dObj.getTime())) {
                  timestamp = dObj.toISOString();
                }
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
      const partsArray = Array.from(parts);
      setParticipants(partsArray);
      
      const initialMap: Record<string, string> = {};
      const drafts: Record<string, { name: string; avatarUrl: string; bio: string }> = {};
      partsArray.forEach(p => {
        initialMap[p] = "SKIP"; // default to skip
        drafts[p] = { name: p, avatarUrl: "", bio: "" };
      });
      setCharacterMap(initialMap);
      setNewCharacterDrafts(drafts);
      
      setStep(2);

    } catch (e) {
      console.error(e)
      alert("Failed to parse HTML file");
    } finally {
      setParsing(false)
    }
  }

  const handleImport = async () => {
    if (!worldName) {
      alert("World name is required.");
      return;
    }

    setImporting(true)
    try {
      // Prepare new characters array
      const newChars: NewCharacterDef[] = []
      for (const [telegramName, mappedVal] of Object.entries(characterMap)) {
        if (mappedVal === "CREATE_NEW") {
          newChars.push({
            telegramName,
            name: newCharacterDrafts[telegramName].name,
            avatarUrl: newCharacterDrafts[telegramName].avatarUrl,
            bio: newCharacterDrafts[telegramName].bio
          })
        }
      }

      const worldId = await processTelegramImport(
        worldName,
        worldDescription,
        messages,
        characterMap,
        newChars,
        myCharacterId
      )
      
      router.push(`/worlds/${worldId}`)
    } catch (e) {
      console.error(e)
      alert("Import failed.")
      setImporting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl p-6 lg:p-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">Import Telegram Wizard</h1>
        <div className="mt-6 flex items-center gap-2 text-sm font-medium">
          <span className={`px-3 py-1 rounded-full ${step >= 1 ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-500"}`}>1. Upload</span>
          <span className="text-slate-600">-</span>
          <span className={`px-3 py-1 rounded-full ${step >= 2 ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-500"}`}>2. Preview</span>
          <span className="text-slate-600">-</span>
          <span className={`px-3 py-1 rounded-full ${step >= 3 ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-500"}`}>3. Mapping</span>
          <span className="text-slate-600">-</span>
          <span className={`px-3 py-1 rounded-full ${step >= 4 ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-500"}`}>4. World</span>
        </div>
      </div>

      {step === 1 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-800">
            <UploadCloud size={40} className="text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Upload HTML Export</h2>
          <p className="mt-2 text-slate-400">Export your Telegram group history as HTML and upload the `messages.html` file here.</p>
          
          <div className="mt-8 flex flex-col items-center justify-center gap-6">
            <input 
              type="file" 
              accept=".html" 
              onChange={handleFileChange} 
              className="block w-full max-w-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-600 file:px-6 file:py-3 file:text-sm file:font-semibold file:text-white hover:file:bg-indigo-500" 
            />
            
            <button 
              onClick={parseFile} 
              disabled={!file || parsing}
              className="flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-indigo-500 disabled:opacity-50"
            >
              {parsing ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
              Continue to Preview
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800">
            <Users size={32} className="text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Import Preview</h2>
          <p className="mt-2 text-slate-400">We&rsquo;ve successfully read your file. Here is what we found:</p>
          
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl bg-slate-950 p-4 border border-slate-800">
              <div className="text-sm text-slate-500">Participants</div>
              <div className="text-2xl font-bold text-white">{participants.length}</div>
            </div>
            <div className="rounded-xl bg-slate-950 p-4 border border-slate-800">
              <div className="text-sm text-slate-500">Messages</div>
              <div className="text-2xl font-bold text-white">{messages.length}</div>
            </div>
            <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 col-span-2">
              <div className="text-sm text-slate-500">Timeline</div>
              <div className="text-sm font-medium text-white truncate">
                {new Date(messages[0]?.timestamp).toLocaleDateString()} - {new Date(messages[messages.length - 1]?.timestamp).toLocaleDateString()}
              </div>
            </div>
          </div>

          <button 
            onClick={() => setStep(3)}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-indigo-600 px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-indigo-500"
          >
            Continue to Character Mapping <ArrowRight size={20} />
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold text-white mb-2">Character Mapping</h2>
            <p className="text-slate-400 mb-8">Link each Telegram participant to a character in RPWeb, or create a new one instantly.</p>
            
            <div className="space-y-6">
              {participants.map(p => (
                <div key={p} className="rounded-xl border border-slate-700 bg-slate-950 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                    <div className="w-full sm:w-1/3">
                      <div className="text-sm text-slate-500">Telegram User</div>
                      <div className="font-medium text-lg text-slate-200">{p}</div>
                    </div>
                    <div className="w-full sm:w-2/3">
                      <select 
                        value={characterMap[p]} 
                        onChange={e => setCharacterMap({ ...characterMap, [p]: e.target.value })}
                        className="block w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="SKIP">-- Skip / Do Not Import --</option>
                        <option value="CREATE_NEW">+ Create New Character</option>
                        {characters.map(c => <option key={c.id} value={c.id}>Use Existing: {c.name}</option>)}
                      </select>
                    </div>
                  </div>

                  {characterMap[p] === "CREATE_NEW" && (
                    <div className="mt-4 border-t border-slate-800 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                      <div>
                        <label className="text-xs font-medium text-slate-400">Name</label>
                        <input 
                          type="text" 
                          value={newCharacterDrafts[p].name}
                          onChange={e => setNewCharacterDrafts({...newCharacterDrafts, [p]: {...newCharacterDrafts[p], name: e.target.value}})}
                          className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-400">Avatar URL (Optional)</label>
                        <input 
                          type="text" 
                          placeholder="https://..."
                          value={newCharacterDrafts[p].avatarUrl}
                          onChange={e => setNewCharacterDrafts({...newCharacterDrafts, [p]: {...newCharacterDrafts[p], avatarUrl: e.target.value}})}
                          className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white text-sm"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs font-medium text-slate-400">Bio (Optional)</label>
                        <textarea 
                          rows={2}
                          value={newCharacterDrafts[p].bio}
                          onChange={e => setNewCharacterDrafts({...newCharacterDrafts, [p]: {...newCharacterDrafts[p], bio: e.target.value}})}
                          className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button 
              onClick={() => setStep(4)}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-indigo-600 px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-indigo-500"
            >
              Continue to World Details <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
           <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800">
            <Settings size={32} className="text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Create Imported World</h2>
          <p className="text-slate-400 mb-8">Set up the world where this imported history will live.</p>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-slate-300">World Name</label>
              <input 
                type="text" 
                value={worldName} 
                onChange={e => setWorldName(e.target.value)} 
                className="mt-2 block w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-300">Description (Optional)</label>
              <textarea 
                rows={3}
                value={worldDescription} 
                onChange={e => setWorldDescription(e.target.value)} 
                className="mt-2 block w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300">Join World As (Your Character)</label>
              <select 
                value={myCharacterId} 
                onChange={e => setMyCharacterId(e.target.value)} 
                className="mt-2 block w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                {characters.map(c => <option key={c.id} value={c.id}>Existing: {c.name}</option>)}
                {/* Add dynamically created characters as options */}
                {Object.entries(characterMap).map(([p, mappedVal]) => {
                  if (mappedVal === "CREATE_NEW") {
                    return <option key={`NEW_${p}`} value={`NEW_${p}`}>Newly Created: {newCharacterDrafts[p].name}</option>
                  }
                  return null
                })}
              </select>
            </div>
          </div>

          <button 
            onClick={handleImport} 
            disabled={importing}
            className="mt-10 flex w-full items-center justify-center gap-2 rounded-full bg-green-600 px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-green-500 disabled:opacity-50"
          >
            {importing ? <Loader2 className="animate-spin" size={20} /> : null}
            Complete Import
          </button>
        </div>
      )}
    </div>
  )
}
