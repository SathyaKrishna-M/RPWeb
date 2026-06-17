"use client";

import { useState } from "react";
import { createTelegramImport, getTelegramImport, processTelegramImport, rollbackTelegramImport } from "@/server/actions/import";
import { useRouter } from "next/navigation";

type Step = 'UPLOAD' | 'DUPLICATE_WARNING' | 'PREVIEW_AND_MAP' | 'CONFIRM' | 'SUCCESS';

export function ImportClient({ worldId }: { worldId: string }) {
  const router = useRouter();
  
  const [step, setStep] = useState<Step>('UPLOAD');
  const [file, setFile] = useState<File | null>(null);
  const [fileText, setFileText] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [importId, setImportId] = useState<string | null>(null);
  const [importData, setImportData] = useState<any>(null);
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [sceneTitle, setSceneTitle] = useState("Imported Telegram Scene");
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdSceneId, setCreatedSceneId] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (force: boolean = false) => {
    if (!file) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      const text = force ? fileText : await file.text();
      if (!force) setFileText(text);

      const res = await createTelegramImport(worldId, text, file.name, force);
      
      if (res.warning === "duplicate") {
        setStep('DUPLICATE_WARNING');
        setIsUploading(false);
        return;
      }

      if (res.error) {
        setError(res.error);
        setIsUploading(false);
        return;
      }

      if (res.importId) {
        setImportId(res.importId);
        await loadImportData(res.importId);
        setStep('PREVIEW_AND_MAP');
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const loadImportData = async (id: string) => {
    const res = await getTelegramImport(id);
    if (res.error) {
      setError(res.error);
    } else {
      setImportData(res.importRecord);
      
      if (res.importRecord) {
        const initialMappings: Record<string, string> = {};
        const characters = res.importRecord.world?.characters || [];
        res.importRecord.participants.forEach((p: any) => {
          const match = characters.find((c: any) => c.name.toLowerCase() === p.telegramName.toLowerCase());
          if (match) {
            initialMappings[p.id] = match.id;
          }
        });
        setMappings(initialMappings);
      }
    }
  };

  const handleMappingChange = (participantId: string, characterId: string) => {
    setMappings(prev => ({
      ...prev,
      [participantId]: characterId
    }));
  };

  const handleProcess = async () => {
    if (!importId) return;
    setIsProcessing(true);
    setError(null);
    
    try {
      const res = await processTelegramImport(importId, mappings, sceneTitle);
      if (res.error) {
        setError(res.error);
      } else if (res.sceneId) {
        setCreatedSceneId(res.sceneId);
        setStep('SUCCESS');
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred during processing.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRollback = async () => {
    if (!importId) return;
    if (!confirm("Are you sure you want to rollback? This will delete the generated scene and all posts inside it. This action cannot be undone.")) return;

    setIsProcessing(true);
    setError(null);

    try {
      const res = await rollbackTelegramImport(importId);
      if (res.error) {
        setError(res.error);
      } else {
        alert("Import successfully rolled back.");
        setStep('UPLOAD');
        setFile(null);
        setImportId(null);
        setCreatedSceneId(null);
        setImportData(null);
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred during rollback.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (step === 'UPLOAD') {
    return (
      <div className="panel stack">
        <h2>1. Upload HTML Export</h2>
        <p className="text-muted text-sm">
          Export your Telegram chat history as HTML (Desktop app only: Settings &gt; Advanced &gt; Export Telegram data &gt; uncheck everything except the chat, set format to HTML).
        </p>
        
        {error && <div className="toast toast-error">{error}</div>}
        
        <div style={{ marginTop: "1rem" }}>
          <input 
            type="file" 
            accept=".html" 
            onChange={handleFileChange}
            disabled={isUploading}
            style={{ padding: "0.5rem", border: "1px solid var(--border)", borderRadius: "4px", width: "100%" }}
          />
        </div>
        
        <button 
          className="btn btn-primary" 
          onClick={() => handleUpload(false)} 
          disabled={!file || isUploading}
          style={{ marginTop: "1rem" }}
        >
          {isUploading ? "Uploading & Parsing..." : "Upload & Parse"}
        </button>
      </div>
    );
  }

  if (step === 'DUPLICATE_WARNING') {
    return (
      <div className="panel stack">
        <h2>⚠️ Duplicate File Detected</h2>
        <p className="text-muted">
          A file with this exact content has already been imported before. Are you sure you want to import it again?
        </p>
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <button className="btn btn-secondary" onClick={() => setStep('UPLOAD')}>Cancel</button>
          <button className="btn btn-primary" onClick={() => handleUpload(true)} disabled={isUploading}>
            {isUploading ? "Parsing..." : "Force Proceed"}
          </button>
        </div>
      </div>
    );
  }

  if (step === 'PREVIEW_AND_MAP') {
    if (!importData) return <div>Loading import data...</div>;
    const { participants, world } = importData;

    return (
      <div className="panel stack">
        <h2>2. Import Preview & Character Mapping</h2>
        
        <div style={{ background: "var(--surface-hover)", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem" }}>Dry Run Summary</h3>
          <ul style={{ margin: 0, paddingLeft: "1.5rem" }}>
            <li><strong>Messages Found:</strong> {importData.messageCount}</li>
            <li><strong>Participants Found:</strong> {importData.participantCount}</li>
            <li><strong>First Message:</strong> {new Date(importData.firstMessageAt).toLocaleString()}</li>
            <li><strong>Last Message:</strong> {new Date(importData.lastMessageAt).toLocaleString()}</li>
          </ul>
        </div>

        <p className="text-muted text-sm">
          Map the {participants.length} Telegram participants to your world's characters. 
          Unmapped participants will post as System or un-charactered posts.
        </p>

        {error && <div className="toast toast-error">{error}</div>}

        <div style={{ marginTop: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Scene Title</label>
          <input 
            type="text" 
            value={sceneTitle}
            onChange={(e) => setSceneTitle(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", border: "1px solid var(--border)", borderRadius: "4px", background: "transparent", color: "inherit" }}
          />
        </div>

        <div className="stack" style={{ marginTop: "1.5rem", gap: "1rem" }}>
          {participants.map((p: any) => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", border: "1px solid var(--border)", borderRadius: "8px" }}>
              <div>
                <strong>{p.telegramName}</strong>
              </div>
              <div>
                <select 
                  value={mappings[p.id] || ""} 
                  onChange={(e) => handleMappingChange(p.id, e.target.value)}
                  style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid var(--border)", background: "transparent", color: "inherit" }}
                >
                  <option value="" style={{ color: "black" }}>-- Do not map --</option>
                  {world.characters.map((c: any) => (
                    <option key={c.id} value={c.id} style={{ color: "black" }}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <button className="btn btn-secondary" onClick={() => { setImportId(null); setFile(null); setStep('UPLOAD'); }}>Cancel</button>
          <button className="btn btn-primary" onClick={() => setStep('CONFIRM')}>Next: Review & Confirm</button>
        </div>
      </div>
    );
  }

  if (step === 'CONFIRM') {
    const mappedCount = Object.values(mappings).filter(Boolean).length;

    return (
      <div className="panel stack">
        <h2>3. Confirm Import</h2>
        <p className="text-muted">You are about to commit these records to the database. Please review the summary below:</p>

        <div style={{ background: "var(--surface-hover)", padding: "1.5rem", borderRadius: "8px", margin: "1rem 0" }}>
          <h3 style={{ margin: "0 0 1rem 0" }}>Import Summary</h3>
          <ul style={{ margin: 0, paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li><strong>Scene Title:</strong> {sceneTitle}</li>
            <li><strong>Total Posts to Create:</strong> {importData.messageCount}</li>
            <li><strong>Characters Mapped:</strong> {mappedCount} out of {importData.participantCount}</li>
          </ul>
        </div>

        {error && <div className="toast toast-error">{error}</div>}

        <div style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <button className="btn btn-secondary" onClick={() => setStep('PREVIEW_AND_MAP')} disabled={isProcessing}>Back</button>
          <button 
            className="btn btn-primary" 
            onClick={handleProcess} 
            disabled={isProcessing}
          >
            {isProcessing ? "Creating Scene..." : "Confirm & Import"}
          </button>
        </div>
      </div>
    );
  }

  if (step === 'SUCCESS') {
    return (
      <div className="panel stack" style={{ textAlign: "center", padding: "3rem 1rem" }}>
        <h2 style={{ color: "var(--success)" }}>✅ Import Successful!</h2>
        <p className="text-muted">
          Your Telegram history has been successfully imported as a new Scene.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "2rem" }}>
          <button className="btn btn-secondary" onClick={handleRollback} disabled={isProcessing}>
            {isProcessing ? "Rolling Back..." : "Undo / Rollback Import"}
          </button>
          <button className="btn btn-primary" onClick={() => router.push(`/scenes/${createdSceneId}`)}>
            View Scene
          </button>
        </div>
      </div>
    );
  }

  return null;
}
