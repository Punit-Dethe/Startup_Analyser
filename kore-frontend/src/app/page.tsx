'use client'

import { useState, useEffect } from 'react'
import PixelBlast from '@/components/PixelBlast'
import Grainient from '@/components/Grainient'
import { useDashboard } from '@/hooks/useDashboard'
import AppShell from '@/components/layout/AppShell'
import ModuleGrid from '@/components/layout/ModuleGrid'
import SettingsDropdown from '@/components/layout/SettingsDropdown'

const EXAMPLE_PROMPTS = [
  "Analyse Discord's business model",
  'Food delivery startup in India with ₹50L budget',
  'India EV market outlook 2026',
  'Analyse Swiggy competitors and market position',
  'Analyse Apple business strategy',
]

export default function LandingPage() {
  const [prompt, setPrompt]   = useState('')
  const [focused, setFocused] = useState(false)
  const [showApiKeyDropdown, setShowApiKeyDropdown] = useState(false)
  const [selectedApiKey, setSelectedApiKey] = useState('default')
  const { payload, loading, error, activeTab, submit, setActiveTab, chatHistory, isChatLoading, sendChat, clearDashboard, removeTemporaryTab } = useDashboard()

  // Load selected API key from localStorage on mount (client-side only)
  useEffect(() => {
    const savedKey = localStorage.getItem('selectedApiKey')
    if (savedKey) {
      setSelectedApiKey(savedKey)
    }
  }, [])

  // API Keys configuration
  const apiKeys = [
    { id: 'default', name: 'Default', key: '', color: '#000000' },
    { id: 'key1', name: 'Leo', key: process.env.NEXT_PUBLIC_GEMINI_KEY_1 || '', color: '#f97316' },
    { id: 'key2', name: 'Max', key: process.env.NEXT_PUBLIC_GEMINI_KEY_2 || '', color: '#eab308' },
    { id: 'key3', name: 'Sam', key: process.env.NEXT_PUBLIC_GEMINI_KEY_3 || '', color: '#3b82f6' },
    { id: 'key4', name: 'Alex', key: process.env.NEXT_PUBLIC_GEMINI_KEY_4 || '', color: '#22c55e' },
    { id: 'key5', name: 'Jordan', key: process.env.NEXT_PUBLIC_GEMINI_KEY_5 || '', color: '#a855f7' },
  ]

  const handleApiKeyChange = (keyId: string) => {
    setSelectedApiKey(keyId)
    localStorage.setItem('selectedApiKey', keyId)
    
    if (keyId === 'default') {
      localStorage.removeItem('currentGeminiApiKey')
      console.log('[KORE] API Key switched to: Default (using backend default)')
    } else {
      const selectedKey = apiKeys.find(k => k.id === keyId)
      if (selectedKey && selectedKey.key) {
        localStorage.setItem('currentGeminiApiKey', selectedKey.key)
        console.log(`[KORE] API Key switched to: ${selectedKey.name}`)
      }
    }
    setShowApiKeyDropdown(false)
  }

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
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '0 24px',
      fontFamily: 'Inter, system-ui, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Grainient Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0
      }}>
        <Grainient
          color1="#d4ebf7"
          color2="#a8d5f2"
          color3="#7ec0ed"
          timeSpeed={0.25}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={2}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>

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
            color="#9de3f0"
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
            width: '100%', maxWidth: 700,
            background: '#1a1a1a',
            border: `1px solid ${focused ? '#333' : '#2a2a2a'}`,
            borderRadius: 14,
            padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: 12,
            boxShadow: focused
              ? '0 4px 24px rgba(0,0,0,0.3), 0 0 0 3px rgba(255,255,255,0.08)'
              : '0 2px 8px rgba(0,0,0,0.2)',
            transition: 'all 0.2s ease',
            position: 'relative',
          }}>
            {/* Settings Dropdown (API Key, Model, Temperature) */}
            <SettingsDropdown />

            {/* Vertical Divider */}
            <div style={{
              width: 1,
              height: 24,
              background: '#333',
              flexShrink: 0,
            }} />

            <input
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={handleKey}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Analyse Discord's business model..."
              style={{
                flex: 1, background: 'transparent', border: 'none',
                outline: 'none', fontSize: 14, color: '#e5e5e5',
                fontFamily: 'inherit', letterSpacing: '-0.1px',
              }}
            />

            <button
              onClick={handleSubmit}
              disabled={!prompt.trim() || loading}
              style={{
                padding: '9px 18px',
                borderRadius: 9,
                background: prompt.trim() ? '#404040' : '#2a2a2a',
                border: 'none',
                color: prompt.trim() ? '#fff' : '#666',
                fontSize: 12, fontWeight: 600,
                cursor: prompt.trim() && !loading ? 'pointer' : 'not-allowed',
                flexShrink: 0,
                letterSpacing: '-0.1px',
                transition: 'all 0.15s ease',
              }}
            >
              Analyse →
            </button>
          </div>

          {/* Example prompts */}
          <div style={{
            marginTop: 18, display: 'flex', flexWrap: 'wrap',
            gap: 8, justifyContent: 'center', maxWidth: 700,
          }}>
            {EXAMPLE_PROMPTS.map(p => (
              <button
                key={p}
                onClick={() => { setPrompt(p); }}
                style={{
                  padding: '5px 12px',
                  borderRadius: 20,
                  border: '1px solid #2a2a2a',
                  background: '#1a1a1a',
                  color: '#999',
                  fontSize: 11, cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => {
                  const t = e.currentTarget
                  t.style.borderColor = '#333'
                  t.style.color = '#e5e5e5'
                }}
                onMouseLeave={e => {
                  const t = e.currentTarget
                  t.style.borderColor = '#2a2a2a'
                  t.style.color = '#999'
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
