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
  const [analysisMode, setAnalysisMode] = useState<'startup' | 'company' | null>(null)
  const [logoVisible, setLogoVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { payload, loading, error, activeTab, submit, setActiveTab, chatHistory, isChatLoading, sendChat, clearDashboard, loadDummyData, removeTemporaryTab } = useDashboard()

  // Fade in logo on mount - only once
  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => {
      setLogoVisible(true)
    }, 50)
    return () => clearTimeout(timer)
  }, [])

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
    { id: 'key1', name: 'TACO', key: process.env.NEXT_PUBLIC_GEMINI_KEY_1 || '', color: '#f97316' },
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
    if (!prompt.trim() || loading || !analysisMode) return
    // Store the selected mode in localStorage
    localStorage.setItem('analysisMode', analysisMode)
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
          marginBottom: analysisMode !== null ? 20 : 40,
          textAlign: 'center',
          transition: 'margin-bottom 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12, 
            justifyContent: 'center', 
            marginBottom: 12,
            opacity: logoVisible ? 1 : 0,
            transform: `translateY(${logoVisible ? 0 : 30}px) ${loading ? 'translateY(115px)' : ''}`,
            transition: 'opacity 1.4s cubic-bezier(0.22, 1, 0.36, 1), transform 1.4s cubic-bezier(0.22, 1, 0.36, 1)',
            willChange: 'opacity, transform',
          }}>
            <img 
              src="/tplogo.png" 
              alt="Logo" 
              style={{ 
                height: 120,
                objectFit: 'contain',
                filter: 'brightness(0)',
                transform: loading ? 'scale(1.2)' : 'scale(1)',
                transition: 'transform 1.4s cubic-bezier(0.22, 1, 0.36, 1)',
                willChange: 'transform',
              }} 
            />
          </div>

          {/* Mode Badge - shown directly below logo when mode is selected */}
          {analysisMode !== null && (
            <div 
              style={{
                marginBottom: 20,
                fontSize: 13,
                fontWeight: 600,
                color: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                cursor: 'pointer',
                position: 'relative',
                opacity: loading ? 0 : 1,
                transition: 'opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
              onMouseEnter={e => {
                const closeBtn = e.currentTarget.querySelector('.close-btn') as HTMLElement
                if (closeBtn) closeBtn.style.opacity = '1'
              }}
              onMouseLeave={e => {
                const closeBtn = e.currentTarget.querySelector('.close-btn') as HTMLElement
                if (closeBtn) closeBtn.style.opacity = '0'
              }}
            >
              {analysisMode === 'startup' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                  <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                  <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                  <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                  <path d="M9 22v-4h6v4"></path>
                  <path d="M8 6h.01"></path>
                  <path d="M16 6h.01"></path>
                  <path d="M12 6h.01"></path>
                  <path d="M12 10h.01"></path>
                  <path d="M12 14h.01"></path>
                  <path d="M16 10h.01"></path>
                  <path d="M16 14h.01"></path>
                  <path d="M8 10h.01"></path>
                  <path d="M8 14h.01"></path>
                </svg>
              )}
              <span style={{ letterSpacing: '-0.2px' }}>
                {analysisMode === 'startup' ? 'Startup Analysis' : 'Company Analysis'}
              </span>
              <button
                className="close-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  setAnalysisMode(null)
                }}
                style={{
                  marginLeft: 4,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 18,
                  color: '#000000',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  lineHeight: 1,
                  opacity: 0,
                  transition: 'opacity 0.2s ease',
                }}
                title="Change analysis mode"
              >
                ×
              </button>
            </div>
          )}
          
          {/* Subtext - only shown when no mode is selected */}
          {analysisMode === null && (
            <div style={{
              fontSize: 13, color: 'var(--t-muted)', letterSpacing: '0.01em',
              maxWidth: 360, lineHeight: 1.6,
              opacity: loading ? 0 : (logoVisible ? 1 : 0),
              transition: 'opacity 1.4s cubic-bezier(0.22, 1, 0.36, 1) 0.2s',
              willChange: 'opacity',
            }}>
              From idea to execution, visualized
            </div>
          )}
        </div>

        {/* Mode Selection (shown first) */}
        {analysisMode === null && !loading && (
          <div style={{
            width: '100%', maxWidth: 480,
            display: 'flex', gap: 10,
            opacity: logoVisible ? 1 : 0,
            transform: logoVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 1.4s cubic-bezier(0.22, 1, 0.36, 1) 0.3s, transform 1.4s cubic-bezier(0.22, 1, 0.36, 1) 0.3s',
            willChange: 'opacity, transform',
          }}>
            {/* Startup Analysis Button */}
            <button
              onClick={() => setAnalysisMode('startup')}
              style={{
                flex: 1,
                padding: '16px 20px',
                borderRadius: 10,
                border: '1px solid #000000',
                background: '#000000',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                willChange: 'transform, border-color, box-shadow',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#666666'
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#000000'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Rocket Icon SVG */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
              </svg>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', letterSpacing: '-0.2px' }}>
                Startup Analysis
              </div>
            </button>

            {/* Company Analysis Button */}
            <button
              onClick={() => setAnalysisMode('company')}
              style={{
                flex: 1,
                padding: '16px 20px',
                borderRadius: 10,
                border: '1px solid #000000',
                background: '#000000',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                willChange: 'transform, border-color, box-shadow',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#666666'
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#000000'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Building Icon SVG */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                <path d="M9 22v-4h6v4"></path>
                <path d="M8 6h.01"></path>
                <path d="M16 6h.01"></path>
                <path d="M12 6h.01"></path>
                <path d="M12 10h.01"></path>
                <path d="M12 14h.01"></path>
                <path d="M16 10h.01"></path>
                <path d="M16 14h.01"></path>
                <path d="M8 10h.01"></path>
                <path d="M8 14h.01"></path>
              </svg>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', letterSpacing: '-0.2px' }}>
                Company Analysis
              </div>
            </button>
          </div>
        )}

        {/* Fading Out UI Elements (Search Bar - shown after mode selection) */}
        {analysisMode !== null && (
          <div style={{
            width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center',
            opacity: loading ? 0 : 1,
            transform: loading ? 'translateY(20px)' : 'translateY(0)',
            pointerEvents: loading ? 'none' : 'auto',
            transition: 'opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
            willChange: 'opacity, transform',
          }}>
            {/* Input */}
            <div style={{
              width: '100%', maxWidth: 700,
              background: '#FFFFFF',
              border: `1px solid ${focused ? 'var(--border-hover)' : 'var(--border)'}`,
              borderRadius: 14,
              padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 12,
              boxShadow: focused
                ? '0 4px 24px rgba(0,0,0,0.08), 0 0 0 3px rgba(218,41,28,0.06)'
                : '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'all 0.2s ease',
              position: 'relative',
            }}>
              {/* Settings Dropdown (API Key, Model, Temperature) */}
              <SettingsDropdown />

              {/* Vertical Divider */}
              <div style={{
                width: 1,
                height: 24,
                background: 'var(--border)',
                flexShrink: 0,
              }} />

              <input
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={handleKey}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder={analysisMode === 'startup' 
                  ? "Food delivery startup in India with ₹50L budget..."
                  : "Analyse Discord's business model..."
                }
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
                  padding: '9px 18px',
                  borderRadius: 9,
                  background: prompt.trim() ? '#000000' : 'var(--border)',
                  border: 'none',
                  color: prompt.trim() ? '#fff' : 'var(--t-muted)',
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
              {(analysisMode === 'startup' 
                ? [
                    { title: 'AI mental health companion for Gen-Z', full: 'AI-powered mental health companion app for Gen-Z with anonymous peer support, mood tracking, and 24/7 chatbot therapy. Freemium model with ₹299/month premium tier.' },
                    { title: 'Blockchain supply chain for farmers', full: 'Blockchain-based supply chain platform connecting farmers directly to restaurants and retailers, eliminating middlemen. Revenue from 8% transaction fee.' },
                    { title: 'AR virtual try-on for ethnic wear', full: 'AR virtual try-on platform for ethnic wear e-commerce. B2B SaaS model charging fashion brands ₹50k/month for integration.' },
                    { title: 'Peer-to-peer EV charging network', full: 'Peer-to-peer EV charging network platform connecting EV owners with home chargers to drivers. Revenue from 15% commission per charging session. Initial investment ₹75L for tech platform and 50 partner locations.' },
                    { title: 'Vernacular content creator marketplace', full: 'Vernacular content creator marketplace connecting regional language influencers with brands. Focus on tier-2/3 cities. SaaS + commission model with ₹25k/month brand subscription plus 12% transaction fee.' },
                  ]
                : [
                    { title: "Tesla's business model", full: "Analyse Tesla's business model and competitive strategy" },
                    { title: 'Zomato vs Swiggy positioning', full: 'Compare Zomato and Swiggy market positioning, business models, and competitive advantages in Indian food delivery market' },
                    { title: "Netflix content strategy", full: "Analyse Netflix's content strategy evolution, original content investment, and competitive moat in streaming" },
                    { title: 'Indian EV market landscape 2026', full: 'Comprehensive analysis of Indian electric vehicle market landscape, key players, government policies, and growth projections for 2026' },
                    { title: "Reliance Jio's disruption strategy", full: "Analyse how Reliance Jio disrupted Indian telecom market, pricing strategy, and expansion into digital services" },
                  ]
              ).map(p => (
                <button
                  key={p.title}
                  onClick={() => { setPrompt(p.full); }}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 20,
                    border: '1px solid var(--border)',
                    background: '#FFFFFF',
                    color: 'var(--t-muted)',
                    fontSize: 11, 
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    const t = e.currentTarget
                    t.style.borderColor = 'var(--border-hover)'
                    t.style.color = 'var(--t-secondary)'
                  }}
                  onMouseLeave={e => {
                    const t = e.currentTarget
                    t.style.borderColor = 'var(--border)'
                    t.style.color = 'var(--t-muted)'
                  }}
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute', bottom: 24,
        fontSize: 10, color: 'var(--t-hint)',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        opacity: loading ? 0 : (logoVisible ? 1 : 0),
        transition: 'opacity 1.4s cubic-bezier(0.22, 1, 0.36, 1) 0.4s',
        willChange: 'opacity',
      }}>
        KORE · AI Business Intelligence · Powered by Gemini
      </div>
    </div>
  )
}
