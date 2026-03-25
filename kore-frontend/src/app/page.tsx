'use client'

import { useState } from 'react'
import PixelBlast from '@/components/PixelBlast'
import { useDashboard } from '@/hooks/useDashboard'
import AppShell from '@/components/layout/AppShell'
import ModuleGrid from '@/components/layout/ModuleGrid'

const EXAMPLE_PROMPTS = [
  "Analyse Discord's business model",
  'Food delivery startup in India with ₹50L budget',
  'India EV market outlook 2026',
  'Analyse Swiggy competitors and market position',
]

export default function LandingPage() {
  const [prompt, setPrompt]   = useState('')
  const [focused, setFocused] = useState(false)
  const { payload, loading, error, activeTab, submit, setActiveTab, chatHistory, isChatLoading, sendChat, clearDashboard, removeTemporaryTab } = useDashboard()

  function handleSubmit() {
    if (!prompt.trim() || loading) return
    submit(prompt.trim())
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // ── Dashboard Fully Loaded View ──
  if (payload && !loading && !error) {
    return (
      <AppShell
        tabs={payload.tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRemoveTab={removeTemporaryTab}
        brandColor={payload.meta.brand_color}
        colors={payload.meta.colors}
        logoInitials={payload.meta.logo_initials}
        pageTitle={payload.meta.page_title}
        pageSubtitle={payload.meta.page_subtitle}
        chatIntro={payload.chat_intro}
        chatHistory={chatHistory}
        isChatLoading={isChatLoading}
        onSendChat={sendChat}
        onClear={clearDashboard}
      >
        <ModuleGrid modules={payload.modules} activeTab={activeTab} />
      </AppShell>
    )
  }


  // ── Error View ──
  if (error) {
    return (
      <div style={{
        height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 12, fontFamily: 'Inter, system-ui',
      }}>
        <div style={{ fontSize: 32 }}>⚠️</div>
        <div style={{ fontSize: 14, color: 'var(--t-primary)', fontWeight: 600 }}>Pipeline error</div>
        <div style={{ fontSize: 11, color: 'var(--t-muted)', maxWidth: 320, textAlign: 'center' }}>{error}</div>
        <button
          onClick={() => submit(prompt)}
          style={{
            marginTop: 8, padding: '9px 20px', borderRadius: 8,
            background: 'var(--accent-brand)', border: 'none',
            color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    )
  }

  // ── Landing & Loading View (Seamless Single Page Transition) ──
  return (
    <div style={{
      height: '100dvh', 
      background: `
        repeating-conic-gradient(from 0deg at 50% 50%, 
          #87CEEB 0deg 90deg, 
          #a1dcf2 90deg 180deg, 
          #b8e5f7 180deg 270deg, 
          #d1f0ff 270deg 360deg
        )
      `,
      backgroundSize: '40px 40px',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '0 24px',
      fontFamily: 'Inter, system-ui, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* Transitional Pixel Blast Background */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0,
        opacity: loading ? 1 : 0, transition: 'opacity 1.5s ease-in-out', pointerEvents: 'none'
      }}>
        {loading && (
          <PixelBlast
            className=""
            style={{}}
            variant="square"
            pixelSize={4}
            color="#38bdf8"
            patternScale={2}
            patternDensity={1}
            pixelSizeJitter={0}
            enableRipples
            rippleSpeed={0.4}
            rippleThickness={0.12}
            rippleIntensityScale={1.5}
            liquid={false}
            speed={0.5}
            edgeFade={0.25}
            transparent
          />
        )}
      </div>

      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'
      }}>

        {/* Wordmark & Animated Logo */}
        <div style={{ 
          marginBottom: 40, textAlign: 'center',
          transition: 'all 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: loading ? 'translateY(115px)' : 'translateY(0)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', marginBottom: 20 }}>
            <img 
              src="/tplogo.png" 
              alt="Logo" 
              style={{ 
                height: 120,
                objectFit: 'contain',
                filter: 'brightness(0)',
                transition: 'all 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: loading ? 'scale(1.2)' : 'scale(1)',
              }} 
            />
          </div>
          
          <div style={{
            fontSize: 13, color: 'var(--t-muted)', letterSpacing: '0.01em',
            maxWidth: 360, lineHeight: 1.6,
            opacity: loading ? 0 : 1,
            transition: 'opacity 0.6s ease',
          }}>
            AI-powered intelligence dashboard. Type a company, startup idea, or market question.
          </div>
        </div>

        {/* Fading Out UI Elements */}
        <div style={{
          width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center',
          opacity: loading ? 0 : 1,
          transform: loading ? 'translateY(20px)' : 'translateY(0)',
          pointerEvents: loading ? 'none' : 'auto',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          {/* Input */}
          <div style={{
            width: '100%', maxWidth: 600,
            background: '#FFFFFF',
            border: `2px solid ${focused ? '#0891B2' : 'var(--border)'}`,
            borderRadius: 20,
            padding: '16px 18px',
            display: 'flex', alignItems: 'center', gap: 12,
            boxShadow: focused
              ? '0 8px 32px rgba(8, 145, 178, 0.15), 0 0 0 4px rgba(8, 145, 178, 0.08)'
              : '0 2px 12px rgba(0,0,0,0.06)',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--t-hint)" strokeWidth="1.8" strokeLinecap="round" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
            </svg>

            <input
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={handleKey}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Analyse Discord's business model..."
              style={{
                flex: 1, background: 'transparent', border: 'none',
                outline: 'none', fontSize: 14, color: 'var(--t-primary)',
                fontFamily: 'inherit', letterSpacing: '-0.1px',
              }}
            />

            <button
              onClick={handleSubmit}
              disabled={!prompt.trim() || loading}
              style={{
                padding: '10px 20px',
                borderRadius: 14,
                background: prompt.trim() 
                  ? 'linear-gradient(135deg, #0EA5E9 0%, #0891B2 100%)' 
                  : 'var(--border)',
                border: 'none',
                color: prompt.trim() ? '#fff' : 'var(--t-muted)',
                fontSize: 13, fontWeight: 600,
                cursor: prompt.trim() && !loading ? 'pointer' : 'not-allowed',
                flexShrink: 0,
                letterSpacing: '-0.2px',
                transition: 'all 0.2s ease',
                boxShadow: prompt.trim() 
                  ? '0 4px 12px rgba(14, 165, 233, 0.25)' 
                  : 'none',
              }}
              onMouseEnter={e => {
                if (prompt.trim()) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #0284C7 0%, #0E7490 100%)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(14, 165, 233, 0.3)'
                }
              }}
              onMouseLeave={e => {
                if (prompt.trim()) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #0EA5E9 0%, #0891B2 100%)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(14, 165, 233, 0.25)'
                }
              }}
            >
              Analyse →
            </button>
          </div>

          {/* Example prompts */}
          <div style={{
            marginTop: 18, display: 'flex', flexWrap: 'wrap',
            gap: 8, justifyContent: 'center', maxWidth: 600,
          }}>
            {EXAMPLE_PROMPTS.map(p => (
              <button
                key={p}
                onClick={() => { setPrompt(p); }}
                style={{
                  padding: '6px 14px',
                  borderRadius: 24,
                  border: '1px solid var(--border)',
                  background: '#FFFFFF',
                  color: 'var(--t-muted)',
                  fontSize: 11, cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  const t = e.currentTarget
                  t.style.borderColor = '#0891B2'
                  t.style.color = '#0891B2'
                  t.style.background = 'rgba(8, 145, 178, 0.05)'
                }}
                onMouseLeave={e => {
                  const t = e.currentTarget
                  t.style.borderColor = 'var(--border)'
                  t.style.color = 'var(--t-muted)'
                  t.style.background = '#FFFFFF'
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute', bottom: 24,
        fontSize: 10, color: 'var(--t-hint)',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        opacity: loading ? 0 : 1,
        transition: 'opacity 0.6s ease',
      }}>
        KORE · AI Business Intelligence · Powered by Gemini
      </div>
    </div>
  )
}
