'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Send, User, Bot, Loader2 } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const SUGGESTED_PROMPTS = [
  'What OTC medicine is best for a headache?',
  'When should I see a doctor for a cold?',
  'What\'s the difference between cold and flu?',
  'How can I relieve muscle pain naturally?',
]

export default function ChatPage() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hi! I'm your Care360 AI health advisor. I can help answer health questions, explain symptoms, suggest over-the-counter options, or help you find care nearby.\n\nHow can I help you today?`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handlePromptClick = (prompt: string) => {
    sendMessage(prompt)
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-slate-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 text-center">
        <h1 className="text-lg font-semibold text-navy-950">AI Health Advisor</h1>
        <p className="text-sm text-slate-500">Get answers to your health questions</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-teal-600" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-2 text-slate-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggested Prompts */}
      {messages.length <= 2 && (
        <div className="bg-white border-t border-slate-200 px-4 sm:px-6 py-4">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Suggested questions
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handlePromptClick(prompt)}
                  disabled={isLoading}
                  className="px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg
                    text-sm text-slate-600 hover:bg-teal-50 hover:border-teal-200 
                    hover:text-teal-700 transition-colors disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-slate-100 px-4 py-2 text-center">
        <p className="text-xs text-slate-400">
          AI provides general guidance, not medical advice. Always consult a healthcare provider for medical concerns.
        </p>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 px-4 sm:px-6 py-4">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask a health question..."
              disabled={isLoading}
              className="flex-1 px-5 py-3 bg-slate-100 border border-slate-200 rounded-full
                text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-teal-500
                focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center
                text-white hover:bg-teal-500 transition-colors disabled:opacity-50 
                disabled:cursor-not-allowed flex-shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
        ${isUser ? 'bg-slate-200' : 'bg-teal-100'}
      `}>
        {isUser ? (
          <User className="w-4 h-4 text-slate-600" />
        ) : (
          <Bot className="w-4 h-4 text-teal-600" />
        )}
      </div>

      {/* Message Bubble */}
      <div className={`
        max-w-[80%] px-4 py-3 rounded-2xl
        ${isUser 
          ? 'bg-teal-600 text-white rounded-br-md' 
          : 'bg-white border border-slate-200 text-slate-700 rounded-bl-md'
        }
      `}>
        <div className="text-[15px] leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    </div>
  )
}
