"use client"

import { useState, useEffect, useRef } from "react"
import { io, Socket } from "socket.io-client"
import { createMessage } from "@/server/actions/messages"
import { Send, User as UserIcon, ChevronDown } from "lucide-react"

type ChatMessage = {
  id: string
  content: string
  format: string
  timestamp: string
  character: {
    id: string
    name: string
    avatarUrl: string | null
  }
}

type CharacterDef = {
  id: string
  name: string
  avatarUrl: string | null
}

function getCharacterColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 35%, 12%)`; // Dark pastel background
}

function getCharacterBorder(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 50%, 25%)`; // Slightly brighter for border
}

export default function ChatClient({
  initialMessages,
  worldId,
  myCharacter,
  allMyCharacters
}: {
  initialMessages: ChatMessage[]
  worldId: string
  myCharacter: CharacterDef
  allMyCharacters?: CharacterDef[]
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [content, setContent] = useState("")
  const [socket, setSocket] = useState<Socket | null>(null)
  
  const availableCharacters = allMyCharacters || [myCharacter]
  const [activeCharacterId, setActiveCharacterId] = useState(myCharacter.id)
  
  const activeCharacter = availableCharacters.find(c => c.id === activeCharacterId) || myCharacter

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize socket
    const socketInstance = io()
    
    socketInstance.on("connect", () => {
      socketInstance.emit("join-world", worldId)
    })

    socketInstance.on("new-message", (message: ChatMessage) => {
      setMessages(prev => [...prev, message])
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.emit("leave-world", worldId)
      socketInstance.disconnect()
    }
  }, [worldId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!content.trim()) return

    const newMsgContent = content;
    const newMsgFormat = "MIXED";
    const sendingCharacter = activeCharacter;
    setContent("")
    
    // Create optimistic message
    const tempId = Math.random().toString()
    const optimisticMessage: ChatMessage = {
      id: tempId,
      content: newMsgContent,
      format: newMsgFormat,
      timestamp: new Date().toISOString(),
      character: {
        id: sendingCharacter.id,
        name: sendingCharacter.name,
        avatarUrl: sendingCharacter.avatarUrl
      }
    }
    setMessages(prev => [...prev, optimisticMessage])

    try {
      // Note: createMessage currently uses the session user's character. 
      // We will need to update createMessage to accept a characterId if they own it.
      // For now we pass characterId
      const savedMsg = await createMessage(worldId, newMsgContent, newMsgFormat, sendingCharacter.id)
      
      const formattedMsg: ChatMessage = {
        ...savedMsg,
        timestamp: savedMsg.timestamp.toISOString(),
      }
      
      setMessages(prev => prev.map(m => m.id === tempId ? formattedMsg : m))
      
      socket?.emit("send-message", {
        worldId,
        ...formattedMsg
      })
    } catch (e) {
      console.error(e)
      // revert optimistic
      setMessages(prev => prev.filter(m => m.id !== tempId))
      setContent(newMsgContent)
    }
  }

  const renderContent = (msg: ChatMessage) => {
    // Legacy support for non-mixed formats
    if (msg.format === "DIALOGUE") {
      return <p className="text-white italic text-lg leading-relaxed whitespace-pre-wrap">"{msg.content}"</p>
    } else if (msg.format === "ACTION") {
      return <p className="text-slate-300 italic whitespace-pre-wrap">*{msg.content}*</p>
    } else if (msg.format === "THOUGHT") {
      return <p className="text-indigo-200 font-medium whitespace-pre-wrap">**{msg.content}**</p>
    } else if (msg.format === "NARRATION" && !msg.content.match(/(".*?"|\*\*.*?\*\*|\*.*?\*)/)) {
      return <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
    }

    // Mixed Format Parser
    const regex = /("[\s\S]*?"|\*\*[\s\S]*?\*\*|\*[\s\S]*?\*)/g;
    const parts = msg.content.split(regex);
    
    return (
      <p className="leading-relaxed whitespace-pre-wrap">
        {parts.map((part, i) => {
          if (!part) return null;
          if (part.startsWith('"') && part.endsWith('"') && part.length >= 2) {
            return <span key={i} className="text-white italic text-[1.05rem]">{part}</span>;
          }
          if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
            return <span key={i} className="text-indigo-300 font-medium">{part}</span>;
          }
          if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
            return <span key={i} className="text-slate-300 italic">{part}</span>;
          }
          return <span key={i} className="text-slate-200">{part}</span>;
        })}
      </p>
    );
  }

  const getTags = (msg: ChatMessage) => {
    if (msg.format !== "MIXED" && msg.format !== "NARRATION") return [msg.format];
    
    // For mixed or legacy narration that actually has markdown, detect what's inside
    const tags = [];
    if (msg.content.includes('"')) tags.push("DIALOGUE");
    if (msg.content.includes('**')) tags.push("THOUGHT");
    else if (msg.content.match(/\*[^*]+\*/)) tags.push("ACTION");
    
    return tags;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950">
        {messages.map((msg, idx) => {
          const showHeader = idx === 0 || messages[idx - 1].character.id !== msg.character.id
          const tags = getTags(msg);
          
          return (
            <div 
              key={msg.id} 
              className={`flex gap-4 p-4 rounded-2xl border ${!showHeader ? 'mt-1' : 'mt-4'}`}
              style={{ 
                backgroundColor: getCharacterColor(msg.character.id),
                borderColor: getCharacterBorder(msg.character.id)
              }}
            >
              <div className="flex-shrink-0 w-10">
                {showHeader ? (
                  msg.character.avatarUrl ? (
                    <img src={msg.character.avatarUrl} alt={msg.character.name} className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 border border-slate-700">
                      <UserIcon size={20} className="text-slate-400" />
                    </div>
                  )
                ) : null}
              </div>
              <div className="flex-1 overflow-hidden">
                {showHeader && (
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-bold text-slate-100">{msg.character.name}</span>
                    <span className="text-xs font-medium text-slate-400">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {tags.length > 0 && (
                      <div className="flex gap-1 ml-1">
                        {tags.map(t => (
                          <span key={t} className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-sm bg-slate-900 text-slate-400 border border-slate-700/50">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <div>{renderContent(msg)}</div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-slate-900 border-t border-slate-800 p-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-4">
            {/* Format Hint */}
            <div className="flex gap-4 text-xs font-medium text-slate-400 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
              <span><span className="text-white italic">"dialogue"</span></span>
              <span><span className="text-slate-300 italic">*action*</span></span>
              <span><span className="text-indigo-300 font-medium">**thought**</span></span>
              <span>narration</span>
            </div>

            {/* Character Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-400">Posting as:</span>
              <div className="relative">
                <select
                  value={activeCharacterId}
                  onChange={e => setActiveCharacterId(e.target.value)}
                  className="appearance-none bg-slate-800 border border-slate-700 text-white text-sm font-medium rounded-full pl-3 pr-8 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {availableCharacters.map(char => (
                    <option key={char.id} value={char.id}>
                      {char.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
          
          <div className="flex items-end gap-2">
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder={`Write as ${activeCharacter.name}... (Shift+Enter for new line)`}
              className="w-full max-h-32 min-h-[3rem] resize-y rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              onClick={handleSend}
              disabled={!content.trim()}
              className="flex h-[3.25rem] w-[3.25rem] flex-shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg transition hover:bg-indigo-500 disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
