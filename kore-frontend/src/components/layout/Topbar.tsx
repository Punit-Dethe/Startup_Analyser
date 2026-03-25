'use client'

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

      {/* ── Tabs (Centered) ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        {tabs.map(tab => {
          const isActive = tab.id === activeTab
          const isTemporary = tab.isTemporary
          
          return (
            <div key={tab.id} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <button
                onClick={() => onTabChange(tab.id)}
                style={{
                  padding: '6px 14px',
                  paddingRight: isTemporary ? '28px' : '14px',  // Extra space for close button
                  borderRadius: 7,
                  border: isActive ? '1px solid var(--border)' : '1px solid transparent',
                  background: isActive ? '#FFFFFF' : 'transparent',
                  color: isActive ? 'var(--t-primary)' : 'var(--t-muted)',
                  fontSize: 12,
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                  position: 'relative',
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
                    marginRight: 6,
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
                    right: 6,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    border: 'none',
                    background: isActive ? 'var(--border)' : 'transparent',
                    color: 'var(--t-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--border-hover)'
                    e.currentTarget.style.color = 'var(--t-primary)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = isActive ? 'var(--border)' : 'transparent'
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

      {/* ── Right actions (Right Flank) ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 5, flex: 1, flexBasis: 0 }}>
        {onClear && (
          <button
            onClick={onClear}
            style={{
              padding: '6px 12px',
              borderRadius: 7,
              border: '1px solid var(--border)',
              background: '#FAFAF9',
              color: 'var(--t-secondary)',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
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
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            New Analysis
          </button>
        )}
        
        <IconBtn aria="Search">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
          </svg>
        </IconBtn>

        <div style={{ position: 'relative' }}>
          <IconBtn aria="Notifications">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </IconBtn>
          <span style={{
            position: 'absolute', top: 6, right: 6,
            width: 5, height: 5, borderRadius: '50%',
            background: brandColor,
            border: '1.5px solid #fff',
          }} />
        </div>

        <IconBtn aria="Settings">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </IconBtn>

        {/* Kore wordmark / avatar */}
        <div style={{
          width: 30, height: 30, borderRadius: '50%',
          background: brandColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 700, color: '#fff',
          cursor: 'pointer', marginLeft: 4,
          border: '1.5px solid #fff',
          outline: '1px solid var(--border)',
          letterSpacing: '-0.3px',
        }}>
          K
        </div>
      </div>
    </div>
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
