'use client'

import { useState, useRef, useEffect } from 'react'

interface Tab { 
  id: string
  label: string
  isTemporary?: boolean  // Flag for temporary tabs
}

interface TopbarProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (id: string) => void
  onRemoveTab?: (id: string) => void  // Callback to remove temporary tabs
  brandColor: string
  logoInitials: string
  pageTitle: string
  pageSubtitle?: string
  onClear?: () => void
}

export default function Topbar({
  tabs, activeTab, onTabChange, onRemoveTab, brandColor, logoInitials, pageTitle, pageSubtitle, onClear,
}: TopbarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showApiKeySettings, setShowApiKeySettings] = useState(false)
  const [selectedApiKey, setSelectedApiKey] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedApiKey') || 'default'
    }
    return 'default'
  })
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const tabsContainerRef = useRef<HTMLDivElement>(null)

  // API Keys configuration
  const apiKeys = [
    { id: 'default', name: 'Default (Backend)', key: '' },
    { id: 'key1', name: 'Leo', key: process.env.NEXT_PUBLIC_GEMINI_KEY_1 || '' },
    { id: 'key2', name: 'Max', key: process.env.NEXT_PUBLIC_GEMINI_KEY_2 || '' },
    { id: 'key3', name: 'Sam', key: process.env.NEXT_PUBLIC_GEMINI_KEY_3 || '' },
    { id: 'key4', name: 'Alex', key: process.env.NEXT_PUBLIC_GEMINI_KEY_4 || '' },
    { id: 'key5', name: 'Jordan', key: process.env.NEXT_PUBLIC_GEMINI_KEY_5 || '' },
  ]

  const handleApiKeyChange = (keyId: string) => {
    setSelectedApiKey(keyId)
    localStorage.setItem('selectedApiKey', keyId)
    
    if (keyId === 'default') {
      // Remove custom API key to use backend default
      localStorage.removeItem('currentGeminiApiKey')
      console.log('[KORE] API Key switched to: Default (using backend default)')
    } else {
      const selectedKey = apiKeys.find(k => k.id === keyId)
      if (selectedKey && selectedKey.key) {
        localStorage.setItem('currentGeminiApiKey', selectedKey.key)
        console.log(`[KORE] API Key switched to: ${selectedKey.name} (${selectedKey.key.substring(0, 20)}...)`)
      }
    }
  }

  // Check scroll position
  const checkScroll = () => {
    const container = tabsContainerRef.current
    if (!container) return
    
    setCanScrollLeft(container.scrollLeft > 0)
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 1
    )
  }

  useEffect(() => {
    checkScroll()
    const container = tabsContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScroll)
      window.addEventListener('resize', checkScroll)
      
      // Enable horizontal scroll with mouse wheel
      const handleWheel = (e: Event) => {
        const wheelEvent = e as WheelEvent
        if (wheelEvent.deltaY !== 0) {
          e.preventDefault()
          container.scrollLeft += wheelEvent.deltaY
        }
      }
      
      container.addEventListener('wheel', handleWheel, { passive: false })
      
      return () => {
        container.removeEventListener('scroll', checkScroll)
        container.removeEventListener('wheel', handleWheel)
        window.removeEventListener('resize', checkScroll)
      }
    }
  }, [tabs])

  return (
    <div className="topbar">

      {/* ── Brand (Left Flank) ── */}
      <div style={{ display: 'flex', alignItems: 'center', flex: 1, flexBasis: 0 }}>
        {/* Premium KORE Logo */}
        <img 
          src="/tplogo.png" 
          alt="Company Logo" 
          style={{ height: 22, paddingLeft: 4, objectFit: 'contain', filter: 'brightness(0)' }} 
        />

        {/* ── Divider ── */}
        <div style={{ width: 1, background: 'var(--border)', height: 20, margin: '0 16px', flexShrink: 0 }} />

        {/* Dynamic Context */}
        <div style={{
          fontFamily: 'Inter, system-ui',
          fontSize: 17,
          fontWeight: 600,
          color: brandColor,
          letterSpacing: '-0.3px',
        }}>
          {pageTitle}
        </div>
      </div>

      {/* ── Tabs (Centered with Scroll) ── */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        flex: 2,
        maxWidth: '60%',
      }}>
        {/* Tabs container with fade edges */}
        <div style={{ 
          position: 'relative',
          flex: 1,
          overflow: 'hidden',
        }}>
          {/* Left fade gradient - transparent to white */}
          {canScrollLeft && (
            <div style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 60,
              background: 'linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
              pointerEvents: 'none',
              zIndex: 5,
            }} />
          )}

          {/* Scrollable tabs container */}
          <div 
            ref={tabsContainerRef}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 6,
              overflowX: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              padding: '4px 0',
              WebkitOverflowScrolling: 'touch',
              cursor: 'grab',
            }}
            className="hide-scrollbar"
            onMouseDown={(e) => {
              const container = e.currentTarget
              container.style.cursor = 'grabbing'
            }}
            onMouseUp={(e) => {
              const container = e.currentTarget
              container.style.cursor = 'grab'
            }}
            onMouseLeave={(e) => {
              const container = e.currentTarget
              container.style.cursor = 'grab'
            }}
          >
            {tabs.map(tab => {
              const isActive = tab.id === activeTab
              const isTemporary = tab.isTemporary
              
              return (
                <div key={tab.id} style={{ position: 'relative', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  <button
                    onClick={() => onTabChange(tab.id)}
                    style={{
                      padding: '7px 16px',
                      paddingRight: isTemporary ? '32px' : '16px',
                      borderRadius: 8,
                      border: isActive ? '1px solid var(--border)' : '1px solid transparent',
                      background: isActive ? '#FFFFFF' : 'transparent',
                      color: isActive ? 'var(--t-primary)' : 'var(--t-muted)',
                      fontSize: 13,
                      fontWeight: isActive ? 600 : 500,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease',
                      boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                      position: 'relative',
                      minWidth: 'fit-content',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(0,0,0,0.02)'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent'
                      }
                    }}
                  >
                    {/* Temporary tab indicator */}
                    {isTemporary && (
                      <span style={{
                        display: 'inline-block',
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: brandColor,
                        marginRight: 7,
                      }} />
                    )}
                    {tab.label}
                  </button>
                  
                  {/* Close button for temporary tabs */}
                  {isTemporary && onRemoveTab && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onRemoveTab(tab.id)
                      }}
                      style={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 18,
                        height: 18,
                        borderRadius: 4,
                        border: 'none',
                        background: isActive ? 'rgba(0,0,0,0.05)' : 'transparent',
                        color: 'var(--t-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 14,
                        fontWeight: 400,
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(0,0,0,0.1)'
                        e.currentTarget.style.color = 'var(--t-primary)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = isActive ? 'rgba(0,0,0,0.05)' : 'transparent'
                        e.currentTarget.style.color = 'var(--t-muted)'
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          {/* Right fade gradient - transparent to white */}
          {canScrollRight && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: 60,
              background: 'linear-gradient(to left, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
              pointerEvents: 'none',
              zIndex: 5,
            }} />
          )}
        </div>
      </div>

      {/* ── Right actions (Right Flank) ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, flex: 1, flexBasis: 0 }}>
        {onClear && (
          <button
            onClick={onClear}
            style={{
              padding: '7px 14px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: '#FAFAF9',
              color: 'var(--t-secondary)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
            }}
            onMouseEnter={e => {
              const t = e.currentTarget
              t.style.background = '#F0EFED'
              t.style.borderColor = 'var(--border-hover)'
            }}
            onMouseLeave={e => {
              const t = e.currentTarget
              t.style.background = '#FAFAF9'
              t.style.borderColor = 'var(--border)'
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            New Analysis
          </button>
        )}

        {/* Profile with dropdown */}
        <div style={{ position: 'relative' }}>
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              width: 34, height: 34, borderRadius: '50%',
              background: brandColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: '#fff',
              cursor: 'pointer',
              border: '2px solid #fff',
              outline: '1px solid var(--border)',
              letterSpacing: '-0.3px',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            K
          </div>

          {/* Dropdown menu */}
          {showProfileMenu && (
            <>
              {/* Backdrop to close menu */}
              <div 
                onClick={() => setShowProfileMenu(false)}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 999,
                }}
              />
              
              {/* Menu */}
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                minWidth: 200,
                background: '#fff',
                border: '1px solid var(--border)',
                borderRadius: 10,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                zIndex: 1000,
                overflow: 'hidden',
              }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t-primary)' }}>
                    Kore User
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--t-muted)', marginTop: 2 }}>
                    user@kore.ai
                  </div>
                </div>

                <MenuItem 
                  icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>}
                  label="Settings"
                  onClick={() => {
                    setShowApiKeySettings(!showApiKeySettings)
                  }}
                  expandable
                  expanded={showApiKeySettings}
                />

                {/* API Key Settings Submenu */}
                {showApiKeySettings && (
                  <div style={{ 
                    background: '#F9F9F8', 
                    padding: '8px 0',
                    borderTop: '1px solid var(--border)',
                    borderBottom: '1px solid var(--border)',
                  }}>
                    <div style={{ 
                      padding: '8px 16px', 
                      fontSize: 11, 
                      fontWeight: 600, 
                      color: 'var(--t-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}>
                      API Key Selection
                    </div>
                    {apiKeys.map(apiKey => (
                      <button
                        key={apiKey.id}
                        onClick={() => {
                          handleApiKeyChange(apiKey.id)
                        }}
                        style={{
                          width: '100%',
                          padding: '8px 16px 8px 32px',
                          border: 'none',
                          background: selectedApiKey === apiKey.id ? 'rgba(0,0,0,0.03)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          cursor: 'pointer',
                          fontSize: 12,
                          color: selectedApiKey === apiKey.id ? 'var(--t-primary)' : 'var(--t-secondary)',
                          transition: 'all 0.15s ease',
                          textAlign: 'left',
                          position: 'relative',
                        }}
                        onMouseEnter={e => {
                          if (selectedApiKey !== apiKey.id) {
                            e.currentTarget.style.background = 'rgba(0,0,0,0.02)'
                          }
                        }}
                        onMouseLeave={e => {
                          if (selectedApiKey !== apiKey.id) {
                            e.currentTarget.style.background = 'transparent'
                          }
                        }}
                      >
                        {/* Check mark for selected */}
                        {selectedApiKey === apiKey.id && (
                          <span style={{
                            position: 'absolute',
                            left: 16,
                            color: brandColor,
                            fontSize: 12,
                          }}>
                            ✓
                          </span>
                        )}
                        <span style={{ fontWeight: selectedApiKey === apiKey.id ? 600 : 400 }}>
                          {apiKey.name}
                        </span>
                        {apiKey.id !== 'default' && !apiKey.key && (
                          <span style={{
                            fontSize: 10,
                            color: 'var(--t-muted)',
                            fontStyle: 'italic',
                          }}>
                            (not configured)
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                <MenuItem 
                  icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>}
                  label="Notifications"
                  badge="3"
                  onClick={() => setShowProfileMenu(false)}
                />

                <MenuItem 
                  icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>}
                  label="Profile"
                  onClick={() => setShowProfileMenu(false)}
                />

                <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />

                <MenuItem 
                  icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                  </svg>}
                  label="Sign Out"
                  onClick={() => setShowProfileMenu(false)}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function MenuItem({ icon, label, badge, onClick, expandable, expanded }: { 
  icon: React.ReactNode
  label: string
  badge?: string
  onClick: () => void
  expandable?: boolean
  expanded?: boolean
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        padding: '10px 16px',
        border: 'none',
        background: expanded ? '#F9F9F8' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        cursor: 'pointer',
        fontSize: 13,
        color: 'var(--t-secondary)',
        transition: 'all 0.15s ease',
        textAlign: 'left',
      }}
      onMouseEnter={e => {
        if (!expanded) {
          e.currentTarget.style.background = '#F9F9F8'
          e.currentTarget.style.color = 'var(--t-primary)'
        }
      }}
      onMouseLeave={e => {
        if (!expanded) {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = 'var(--t-secondary)'
        }
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', color: 'inherit' }}>
        {icon}
      </span>
      <span style={{ flex: 1 }}>{label}</span>
      {badge && (
        <span style={{
          padding: '2px 6px',
          borderRadius: 10,
          background: 'var(--border)',
          fontSize: 10,
          fontWeight: 600,
          color: 'var(--t-muted)',
        }}>
          {badge}
        </span>
      )}
      {expandable && (
        <svg 
          width="12" 
          height="12" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round"
          style={{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.15s ease',
          }}
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      )}
    </button>
  )
}

function IconBtn({ children, aria }: { children: React.ReactNode; aria: string }) {
  return (
    <button
      aria-label={aria}
      style={{
        width: 30, height: 30, borderRadius: 7,
        border: '1px solid var(--border)',
        background: '#FAFAF9',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        color: 'var(--t-muted)',
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={e => {
        const t = e.currentTarget
        t.style.background = '#F0EFED'
        t.style.borderColor = 'var(--border-hover)'
      }}
      onMouseLeave={e => {
        const t = e.currentTarget
        t.style.background = '#FAFAF9'
        t.style.borderColor = 'var(--border)'
      }}
    >
      {children}
    </button>
  )
}
