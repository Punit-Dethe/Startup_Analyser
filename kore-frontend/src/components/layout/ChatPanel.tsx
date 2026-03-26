'use client'

import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import { ChatMessage } from '@/lib/types'

interface ChatPanelProps {
  intro:         string
  brandColor:    string
  chatHistory:   ChatMessage[]
  isChatLoading: boolean
  onSend:        (message: string) => void
}

export default function ChatPanel({
  intro,
  brandColor,
  chatHistory,
  isChatLoading,
  onSend,
}: ChatPanelProps) {
  const [input, setInput]       = useState('')
  const messagesEndRef           = useRef<HTMLDivElement>(null)

  // Scroll to show the latest message (bottom of chat)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory, isChatLoading])

  function send() {
    const text = input.trim()
    if (!text || isChatLoading) return
    setInput('')
    onSend(text)
  }

  // Build display messages: intro (always first) + actual history
  const introMsg: ChatMessage = { role: 'assistant', content: intro }
  const displayMessages = chatHistory.length > 0 ? chatHistory : [introMsg]
  // Always show intro if history is empty; once history has messages it replaces the intro
  const messages = chatHistory.length > 0 ? [introMsg, ...chatHistory] : [introMsg]
  // Actually: show intro always at top, then real history
  // But intro may already be the first assistant message if we initialize chatHistory with it.
  // We keep it simple: render introMsg always first, then history items.

  return (
    <div
      className="chat-panel"
      style={{
        background: `linear-gradient(to right, ${brandColor}14 0%, #FAFAFA 100%)`,
      }}
    >
      {/* Top blur overlay */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 60,
        background: 'linear-gradient(to bottom, rgba(250,250,250,1) 10%, rgba(250,250,250,0) 100%)',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)',
        pointerEvents: 'none', zIndex: 10,
      }} />

      {/* Messages */}
      <div style={{
        flex: 1, overflow: 'auto',
        padding: '60px 24px 100px 24px',
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        {/* Intro (always shown) */}
        <div className="chat-msg-ai prose-chat" style={{ padding: '4px 0', color: 'var(--t-primary)' }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {intro}
          </ReactMarkdown>
        </div>

        {/* Conversation history */}
        {chatHistory.map((msg, i) => {
          const isUser = msg.role === 'user'
          return (
            <div
              key={i}
              className={isUser ? 'chat-msg-user' : 'chat-msg-ai prose-chat'}
              style={{
                alignSelf:  isUser ? 'flex-end' : 'stretch',
                background: isUser ? brandColor : 'transparent',
                borderRadius: isUser ? '10px 3px 10px 10px' : '0',
                padding:    isUser ? '8px 12px' : '4px 0',
                color:      isUser ? '#fff' : 'var(--t-primary)',
                maxWidth:   isUser ? '88%' : '100%',
              }}
            >
              {isUser ? (
                <div style={{ fontSize: 13, lineHeight: 1.5 }}>{msg.content}</div>
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                  {msg.content}
                </ReactMarkdown>
              )}
            </div>
          )
        })}

        {/* Thinking / loading indicator */}
        {isChatLoading && (
          <div style={{
            background: 'var(--input-bg)', border: '1px solid var(--border)',
            borderRadius: '3px 10px 10px 10px', padding: '8px 12px',
            alignSelf: 'flex-start', display: 'flex', gap: 4, alignItems: 'center',
          }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                width: 5, height: 5, borderRadius: '50%',
                background: 'var(--t-hint)', display: 'inline-block',
                animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom blur overlay */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 120,
        background: 'linear-gradient(to top, rgba(250,250,250,1) 20%, rgba(250,250,250,0) 100%)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        WebkitMaskImage: 'linear-gradient(to top, black 40%, transparent 100%)',
        maskImage: 'linear-gradient(to top, black 40%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Input */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '24px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask anything about this dashboard…"
          disabled={isChatLoading}
          style={{
            flex: 1, background: 'var(--input-bg)', border: '1px solid var(--border)',
            borderRadius: 24, padding: '13px 18px', fontSize: 12,
            color: 'var(--t-primary)', outline: 'none', fontFamily: 'inherit',
            transition: 'border-color 0.15s',
            opacity: isChatLoading ? 0.6 : 1,
          }}
          onFocus={e => (e.target.style.borderColor = 'var(--border-hover)')}
          onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
        />
        <button
          onClick={send}
          disabled={isChatLoading || !input.trim()}
          style={{
            width: 38, height: 38, borderRadius: '50%',
            background: brandColor, border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: isChatLoading || !input.trim() ? 'not-allowed' : 'pointer',
            flexShrink: 0, transition: 'opacity 0.15s',
            opacity: isChatLoading || !input.trim() ? 0.4 : 1,
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-4px); }
        }
        .prose-chat {
          font-size: 14px; line-height: 1.7; letter-spacing: -0.1px; color: var(--t-secondary);
        }
        .prose-chat p { margin-bottom: 16px; }
        .prose-chat p:last-child { margin-bottom: 0; }
        .prose-chat h1, .prose-chat h2, .prose-chat h3 {
          font-weight: 700; color: var(--t-primary);
          margin-top: 32px; margin-bottom: 12px; letter-spacing: -0.4px;
        }
        .prose-chat h1 { font-size: 20px; }
        .prose-chat h2 { font-size: 17px; }
        .prose-chat h3 { font-size: 15px; }
        .prose-chat a {
          color: ${brandColor}; text-decoration: underline;
          text-decoration-color: transparent; transition: text-decoration-color 0.2s;
        }
        .prose-chat a:hover { text-decoration-color: ${brandColor}; }
        .prose-chat ul, .prose-chat ol { margin: 16px 0; padding-left: 24px; }
        .prose-chat li { margin-bottom: 6px; }
        .prose-chat table { width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 13px; }
        .prose-chat th {
          text-align: left; padding: 12px 14px; background: #F4F4F2;
          border-bottom: 2px solid #DDDDD9; font-weight: 600; color: var(--t-primary);
        }
        .prose-chat td { padding: 12px 14px; border-bottom: 1px solid #EBEBEA; }
        .prose-chat blockquote {
          border-left: 3px solid #EBEBEA; padding-left: 18px;
          color: var(--t-muted); margin: 24px 0; font-style: italic;
        }
        .prose-chat code {
          background: #F4F4F2; padding: 3px 6px; border-radius: 4px;
          font-family: inherit; font-size: 12px; color: #DC2626;
        }
        .prose-chat pre code {
          display: block; padding: 16px; background: #111110; color: #EBEBEA;
          overflow-x: auto; border-radius: 8px; margin: 24px 0; line-height: 1.5;
        }
      `}</style>
    </div>
  )
}
