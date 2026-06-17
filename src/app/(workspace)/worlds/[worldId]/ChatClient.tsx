"use client"

import { useState, useEffect, useRef } from "react"
import { io, Socket } from "socket.io-client"
import { createMessage } from "@/server/actions/messages"
import { Send, User as UserIcon } from "lucide-react"

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

export default function ChatClient({
  initialMessages,
  worldId,
  myCharacter
}: {
  initialMessages: ChatMessage[]
  worldId: string
  myCharacter: any
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [content, setContent] = useState("")
  const [format, setFormat] = useState("NARRATION")
  const [socket, setSocket] = useState<Socket | null>(null)
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
    const newMsgFormat = format;
    setContent("")
    
    // Create optimistic message
    const tempId = Math.random().toString()
    const optimisticMessage: ChatMessage = {
      id: tempId,
      content: newMsgContent,
      format: newMsgFormat,
      timestamp: new Date().toISOString(),
      character: {
        id: myCharacter.id,
        name: myCharacter.name,
        avatarUrl: myCharacter.avatarUrl
      }
    }
    setMessages(prev => [...prev, optimisticMessage])

    try {
      const savedMsg = await createMessage(worldId, newMsgContent, newMsgFormat)
      
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
    switch (msg.format) {
      case "DIALOGUE":
        return <p className="text-white italic text-lg leading-relaxed whitespace-pre-wrap">"{msg.content}"</p>
      case "ACTION":
        return <p className="text-slate-300 italic whitespace-pre-wrap">*{msg.content}*</p>
      case "THOUGHT":
        return <p className="text-indigo-200 font-medium whitespace-pre-wrap">**{msg.content}**</p>
      case "NARRATION":
      default:
        return <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-950">
        {messages.map((msg, idx) => {
          const showHeader = idx === 0 || messages[idx - 1].character.id !== msg.character.id
          
          return (
            <div key={msg.id} className={`flex gap-4 ${!showHeader ? 'mt-1' : 'mt-6'}`}>
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
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-semibold text-indigo-400">{msg.character.name}</span>
                    <span className="text-xs text-slate-500">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
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
          <div className="mb-2 flex gap-2">
            {["DIALOGUE", "ACTION", "THOUGHT", "NARRATION"].map(f => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`px-3 py-1 text-xs font-medium rounded-full border transition ${
                  format === f 
                    ? "bg-indigo-600 border-indigo-500 text-white" 
                    : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
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
              placeholder={`Write as ${myCharacter.name}... (Shift+Enter for new line)`}
              className="w-full max-h-32 min-h-[3rem] resize-y rounded-lg border border-slate-700 bg-slate-800 p-3 text-sm text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              onClick={handleSend}
              disabled={!content.trim()}
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
