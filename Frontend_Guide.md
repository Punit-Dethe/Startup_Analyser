# Analysr — Frontend Setup Guide
### Complete walkthrough: setup → grid → modules → testing

---

## Table of Contents

1. [Project Setup](#1-project-setup)
2. [Folder Structure](#2-folder-structure)
3. [The Grid System](#3-the-grid-system)
4. [Responsive Scaling Strategy](#4-responsive-scaling-strategy)
5. [The Shell Layout](#5-the-shell-layout)
6. [Building the Topbar](#6-building-the-topbar)
7. [Building the Chat Panel](#7-building-the-chat-panel)
8. [Building the Module System](#8-building-the-module-system)
9. [All Module Types — Code](#9-all-module-types--code)
10. [CSS Container Queries — Two States](#10-css-container-queries--two-states)
11. [The Dummy JSON — Testing Without Backend](#11-the-dummy-json--testing-without-backend)
12. [Testing Checklist](#12-testing-checklist)
13. [The Reveal Animation](#13-the-reveal-animation)

---

## 1. Project Setup

### Install everything

```bash
# Create Next.js project
npx create-next-app@latest analysr-frontend \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd analysr-frontend

# Chart libraries
npm install echarts echarts-for-react
npm install apexcharts react-apexcharts
npm install @nivo/core @nivo/bar @nivo/line @nivo/pie
npm install @nivo/treemap @nivo/sankey @nivo/heatmap

# Flow diagrams
npm install reactflow

# Utilities
npm install clsx
```

### Environment file

```bash
# .env.local
NEXT_PUBLIC_N8N_WEBHOOK=http://localhost:5678/webhook/generate
```

### tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        page:    '#F5F4F1',
        card:    '#FFFFFF',
        border:  '#EBEBEA',
        'border-hover': '#D0D0CC',
        't-primary':   '#111110',
        't-secondary': '#3D3D3A',
        't-muted':     '#9B9B97',
        't-hint':      '#C0C0BC',
        'accent-brand':  '#DA291C',
        'accent-green':  '#16A34A',
        'accent-amber':  '#D97706',
        'accent-purple': '#7C3AED',
        'accent-teal':   '#0D9488',
        'accent-blue':   '#2563EB',
      },
    },
  },
  plugins: [],
}

export default config
```

### globals.css — the critical CSS that makes everything work

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --page-bg:      #F5F4F1;
  --card-bg:      #FFFFFF;
  --border:       #EBEBEA;
  --border-hover: #D0D0CC;
  --t-primary:    #111110;
  --t-secondary:  #3D3D3A;
  --t-muted:      #9B9B97;

  --accent-brand:  #DA291C;
  --accent-green:  #16A34A;
  --accent-amber:  #D97706;
  --accent-purple: #7C3AED;
  --accent-teal:   #0D9488;
  --accent-blue:   #2563EB;

  --topbar-height: 52px;
  --chat-width:    220px;
  --grid-gap:      8px;
  --grid-cols:     5;
  --grid-rows:     5;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  height: 100%;
  background: var(--page-bg);
  -webkit-font-smoothing: antialiased;
}

#app-shell {
  height: 100dvh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
```

---

## 2. Folder Structure

```
src/
├── app/
│   ├── page.tsx                  ← Landing / prompt input
│   ├── dashboard/
│   │   └── page.tsx              ← Main dashboard renderer
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx          ← Outermost container
│   │   ├── Topbar.tsx            ← Logo + tabs + icons
│   │   ├── ChatPanel.tsx         ← Left chat column
│   │   └── ModuleGrid.tsx        ← The 5×5 grid
│   │
│   ├── modules/
│   │   ├── ModuleCard.tsx        ← Card shell (accent bar + content)
│   │   ├── ModuleCard.module.css ← Container queries live here
│   │   ├── ModuleFactory.tsx     ← Reads type → renders right module
│   │   │
│   │   └── types/
│   │       ├── ChartModule.tsx   ← ECharts
│   │       ├── KpiModule.tsx     ← Pure CSS bars
│   │       ├── GaugeModule.tsx   ← Inline SVG arc
│   │       ├── TableModule.tsx   ← HTML table
│   │       ├── FeedModule.tsx    ← News items
│   │       └── BmcModule.tsx     ← 9-cell canvas
│   │
│   └── ui/
│       ├── LoadingOverlay.tsx
│       └── PromptInput.tsx
│
├── lib/
│   ├── types.ts                  ← All TypeScript interfaces
│   ├── api.ts                    ← fetch to n8n webhook
│   ├── revealAnimation.ts        ← Stagger reveal logic
│   └── dummyData.ts              ← Fake payload for testing
│
└── hooks/
    └── useDashboard.ts           ← Dashboard state management
```

---

## 3. The Grid System

### Why 5×5 and not just CSS columns

The grid is 5 columns × 5 rows. You do NOT write
`grid-template-columns: repeat(5, 1fr)` and call it done.
That gives fixed cells. Instead use fractional units so the grid
always fills the available space exactly with no leftover gaps and
no overflow.

```
Total width  = viewport - chat panel (220px) - padding
Total height = viewport - topbar (52px) - padding
Cell width   = (total width  - 4 gaps) / 5
Cell height  = (total height - 4 gaps) / 5
```

A module at size `2x3` gets `grid-column: span 2; grid-row: span 3`.
CSS handles all pixel math automatically.

### ModuleGrid.tsx

```tsx
// src/components/layout/ModuleGrid.tsx
'use client'

import { Module } from '@/lib/types'
import ModuleCard from '@/components/modules/ModuleCard'

interface ModuleGridProps {
  modules: Module[]
  activeTab: string
}

export default function ModuleGrid({ modules, activeTab }: ModuleGridProps) {
  const visible = modules.filter(m => m.tab === activeTab)

  return (
    <div className="module-grid">
      {visible.map((module, index) => (
        <ModuleCard key={module.id} module={module} index={index} />
      ))}
    </div>
  )
}
```

### The grid CSS

```css
/* In globals.css */

.module-grid {
  display: grid;
  /* minmax(140px, 1fr) = scales down but never below 140px */
  grid-template-columns: repeat(5, minmax(140px, 1fr));
  grid-template-rows: repeat(5, minmax(120px, 1fr));
  gap: var(--grid-gap);

  flex: 1;
  padding: 10px;
  min-height: 0;   /* CRITICAL — without this grid won't shrink in flex */
  min-width: 0;
  overflow: auto;  /* scroll only when minimum sizes are hit */
}

/* Module size classes */
.mod-1x1 { grid-column: span 1; grid-row: span 1; }
.mod-1x2 { grid-column: span 1; grid-row: span 2; }
.mod-1x3 { grid-column: span 1; grid-row: span 3; }
.mod-2x1 { grid-column: span 2; grid-row: span 1; }
.mod-2x2 { grid-column: span 2; grid-row: span 2; }
.mod-2x3 { grid-column: span 2; grid-row: span 3; }
.mod-3x1 { grid-column: span 3; grid-row: span 1; }
.mod-3x2 { grid-column: span 3; grid-row: span 2; }
.mod-3x3 { grid-column: span 3; grid-row: span 3; }
.mod-4x2 { grid-column: span 4; grid-row: span 2; }
.mod-5x1 { grid-column: span 5; grid-row: span 1; }
.mod-5x2 { grid-column: span 5; grid-row: span 2; }
.mod-5x3 { grid-column: span 5; grid-row: span 3; }
.mod-5x5 { grid-column: span 5; grid-row: span 5; }
```

---

## 4. Responsive Scaling Strategy

### The problem

A 5×5 grid at 1440px looks spacious. On 768px it's cramped.
If cells just shrink, a 3×3 hero at 600px becomes 250px — too small.

### Recommended: proportional + minimum

```css
.module-grid {
  grid-template-columns: repeat(5, minmax(140px, 1fr));
  grid-template-rows:    repeat(5, minmax(120px, 1fr));
  overflow: auto; /* scroll if minimums aren't met */
}
```

**Result:**
- Large screen (1440px): cells are ~250px wide. Everything fits, no scroll.
- Medium screen (1024px): cells shrink proportionally to ~170px. Still fits.
- Small screen (768px): cells would go below 140px → scrolling kicks in.
  Modules never get too small to read.

### Container queries handle the internal adaptation

The modules themselves use CSS `@container` to decide what to show
based on their actual rendered size. When a module shrinks, it
automatically hides labels, legends, and subtitles. The chart stays
visible — just stripped of decoration.

This means:
- On large screens: full chart with axes, legend, title, footer stats
- On medium screens: chart with title, no legend
- On small screens: bare visual only — pure shape of the data

All automatic. Zero JavaScript. Zero React state changes.

---

## 5. The Shell Layout

### AppShell.tsx

```tsx
// src/components/layout/AppShell.tsx
'use client'

import { ReactNode } from 'react'
import Topbar from './Topbar'
import ChatPanel from './ChatPanel'

interface AppShellProps {
  children: ReactNode
  tabs: Array<{ id: string; label: string }>
  activeTab: string
  onTabChange: (id: string) => void
  brandColor: string
  logoInitials: string
  pageTitle: string
  chatIntro: string
}

export default function AppShell({
  children, tabs, activeTab, onTabChange,
  brandColor, logoInitials, pageTitle, chatIntro,
}: AppShellProps) {
  return (
    <div id="app-shell">

      <Topbar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        brandColor={brandColor}
        logoInitials={logoInitials}
        pageTitle={pageTitle}
      />

      <div style={{
        display: 'flex',
        flex: 1,
        minHeight: 0, /* critical for flex children to shrink */
        overflow: 'hidden',
      }}>
        <ChatPanel intro={chatIntro} brandColor={brandColor} />
        <div style={{ flex: 1, minWidth: 0, minHeight: 0, display: 'flex' }}>
          {children}
        </div>
      </div>

    </div>
  )
}
```

### Shell CSS

```css
/* globals.css */

#app-shell {
  height: 100dvh;       /* dvh = dynamic viewport height, handles mobile bars */
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--page-bg);
}

.topbar {
  height: var(--topbar-height);
  flex-shrink: 0;       /* never shrinks regardless of viewport */
  background: #FFFFFF;
  border-bottom: 1px solid var(--border);
}

.chat-panel {
  width: var(--chat-width);
  flex-shrink: 0;       /* never shrinks */
  background: #FFFFFF;
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
}
```

---

## 6. Building the Topbar

```tsx
// src/components/layout/Topbar.tsx
'use client'

interface Tab { id: string; label: string }

interface TopbarProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (id: string) => void
  brandColor: string
  logoInitials: string
  pageTitle: string
}

export default function Topbar({
  tabs, activeTab, onTabChange, brandColor, logoInitials, pageTitle,
}: TopbarProps) {
  return (
    <div className="topbar" style={{
      display: 'flex', alignItems: 'center',
      padding: '0 18px', gap: 0,
    }}>

      {/* BRAND — left zone */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 200, flexShrink: 0 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9,
          background: brandColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, color: '#fff',
          letterSpacing: '-0.3px', flexShrink: 0,
        }}>
          {logoInitials}
        </div>
        <div>
          <div style={{
            fontSize: 14, fontWeight: 600, color: 'var(--t-primary)',
            letterSpacing: '-0.3px', lineHeight: 1.1,
          }}>
            {pageTitle}
          </div>
          <div style={{ fontSize: 10, color: 'var(--t-muted)', marginTop: 1 }}>
            Business analysis
          </div>
        </div>
      </div>

      {/* SEPARATOR */}
      <div style={{
        width: 1, background: 'var(--border)',
        height: 26, margin: '0 18px', flexShrink: 0,
      }} />

      {/* TABS — center zone */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, overflow: 'hidden' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              padding: '5px 13px', borderRadius: 7,
              border: activeTab === tab.id
                ? '1px solid var(--border)'
                : '1px solid transparent',
              background: activeTab === tab.id ? '#FFFFFF' : 'transparent',
              color: activeTab === tab.id ? 'var(--t-primary)' : 'var(--t-muted)',
              fontSize: 12,
              fontWeight: activeTab === tab.id ? 500 : 400,
              cursor: 'pointer', whiteSpace: 'nowrap',
              display: 'flex', alignItems: 'center', gap: 5,
            }}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span style={{
                width: 4, height: 4, borderRadius: '50%',
                background: brandColor, display: 'inline-block',
              }} />
            )}
          </button>
        ))}
      </div>

      {/* RIGHT ACTIONS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginLeft: 12, flexShrink: 0 }}>
        <IconBtn aria="Search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
        </IconBtn>
        <div style={{ position: 'relative' }}>
          <IconBtn aria="Notifications">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </IconBtn>
          <span style={{
            position: 'absolute', top: 5, right: 5,
            width: 5, height: 5, borderRadius: '50%',
            background: brandColor, border: '1.5px solid #fff',
          }} />
        </div>
        <IconBtn aria="Settings">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </IconBtn>
        {/* Avatar */}
        <div style={{
          width: 30, height: 30, borderRadius: '50%',
          background: brandColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 600, color: '#fff',
          cursor: 'pointer', marginLeft: 2,
          border: '1.5px solid #fff', outline: '1px solid var(--border)',
        }}>
          PD
        </div>
      </div>
    </div>
  )
}

function IconBtn({ children, aria }: { children: React.ReactNode; aria: string }) {
  return (
    <button aria-label={aria} style={{
      width: 30, height: 30, borderRadius: 7,
      border: '1px solid var(--border)', background: '#FAFAF9',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', color: 'var(--t-muted)',
    }}>
      {children}
    </button>
  )
}
```

---

## 7. Building the Chat Panel

```tsx
// src/components/layout/ChatPanel.tsx
'use client'

import { useState } from 'react'

interface Message { role: 'ai' | 'user'; text: string }

interface ChatPanelProps { intro: string; brandColor: string }

export default function ChatPanel({ intro, brandColor }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: intro }
  ])
  const [input, setInput] = useState('')

  function send() {
    if (!input.trim()) return
    setMessages(prev => [...prev, { role: 'user', text: input }])
    setInput('')
    // Placeholder AI response — replace with real Gemini call later
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: 'I can see what you\'re asking. Let me point you to the relevant module on the dashboard...'
      }])
    }, 800)
  }

  return (
    <div className="chat-panel">

      {/* Header */}
      <div style={{
        padding: '12px 14px 10px',
        borderBottom: '1px solid #F0F0EE',
        display: 'flex', alignItems: 'center', gap: 7,
      }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', flexShrink: 0 }} />
        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--t-secondary)' }}>AI analyst</div>
        <div style={{ fontSize: 10, color: 'var(--t-muted)', marginLeft: 'auto' }}>online</div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflow: 'auto', padding: 12,
        display: 'flex', flexDirection: 'column', gap: 9,
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            background: msg.role === 'ai' ? '#F7F7F5' : brandColor,
            border: msg.role === 'ai' ? '1px solid var(--border)' : 'none',
            borderRadius: msg.role === 'ai' ? '2px 10px 10px 10px' : '10px 2px 10px 10px',
            padding: '8px 10px',
            fontSize: 11, lineHeight: 1.55,
            color: msg.role === 'ai' ? 'var(--t-secondary)' : '#fff',
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '90%',
          }}>
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{
        padding: '10px', borderTop: '1px solid #F0F0EE',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask anything..."
          style={{
            flex: 1, background: '#F7F7F5',
            border: '1px solid var(--border)', borderRadius: 8,
            padding: '7px 10px', fontSize: 11,
            color: 'var(--t-secondary)', outline: 'none',
          }}
        />
        <button onClick={send} style={{
          width: 28, height: 28, borderRadius: 7,
          background: brandColor, border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', flexShrink: 0,
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
```

---

## 8. Building the Module System

### types.ts

```typescript
// src/lib/types.ts

export interface DashboardPayload {
  meta: {
    subject: string
    mode: 'company' | 'startup' | 'market'
    brand_color: string
    logo_initials: string
    page_title: string
    page_subtitle: string
  }
  tabs: Tab[]
  chat_intro: string
  modules: Module[]
}

export interface Tab { id: string; label: string }

export interface Module {
  id: string
  tab: string
  type: string           // 'chart.bar', 'kpi.number', 'feed.news' etc.
  size: string           // '2x3', '1x1', '3x3' etc.
  layout_role: 'hero' | 'high' | 'medium' | 'low'
  accent: AccentKey
  data: ModuleData
  html?: string          // Present when using AI-generated HTML mode
}

export type AccentKey = 'brand' | 'green' | 'amber' | 'purple' | 'teal' | 'blue'

export interface ModuleData {
  title?: string
  subtitle?: string
  value?: string
  delta?: string
  direction?: 'up' | 'down' | 'neutral'
  sparkline?: number[]
  series?: number[]
  labels?: string[]
  unit?: string
  footer_stats?: string[]
  columns?: TableColumn[]
  rows?: Record<string, unknown>[]
  items?: FeedItem[]
  segments?: DonutSegment[]
  [key: string]: unknown
}

export interface TableColumn {
  key: string; label: string
  type?: 'text' | 'number' | 'currency' | 'delta_badge'
  sortable?: boolean
}

export interface FeedItem {
  headline: string; source: string
  url?: string; date?: string
  sentiment?: 'positive' | 'negative' | 'neutral'
}

export interface DonutSegment { label: string; value: number; color_key: AccentKey }
```

### ModuleCard.tsx

```tsx
// src/components/modules/ModuleCard.tsx
'use client'

import { Module, AccentKey } from '@/lib/types'
import ModuleFactory from './ModuleFactory'
import styles from './ModuleCard.module.css'

const ACCENT_COLORS: Record<AccentKey, string> = {
  brand:  '#DA291C', green:  '#16A34A', amber:  '#D97706',
  purple: '#7C3AED', teal:   '#0D9488', blue:   '#2563EB',
}

export default function ModuleCard({ module, index }: { module: Module; index: number }) {
  const accentColor = ACCENT_COLORS[module.accent] || '#DA291C'
  const sizeClass   = `mod-${module.size}`

  return (
    <div
      className={`${styles.card} ${sizeClass}`}
      style={{ '--accent': accentColor } as React.CSSProperties}
      data-module-id={module.id}
      data-reveal-index={index}
    >
      <div className={styles.accentBar} />
      <div className={styles.content}>
        {module.html ? (
          <div
            className={styles.htmlContent}
            dangerouslySetInnerHTML={{ __html: module.html }}
          />
        ) : (
          <ModuleFactory module={module} />
        )}
      </div>
    </div>
  )
}
```

### ModuleCard.module.css

```css
/* src/components/modules/ModuleCard.module.css */

.card {
  background: #FFFFFF;
  border: 1px solid var(--border, #EBEBEA);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;

  /* Declare as container — enables @container queries */
  container-type: size;
  container-name: mod;

  /* Start hidden — reveal animation brings it in */
  opacity: 0;
  transform: translateY(8px);
}

.card:hover {
  border-color: var(--border-hover, #D0D0CC);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.accentBar {
  height: 3px;
  width: 100%;
  background: var(--accent, #DA291C);
  flex-shrink: 0;
}

.content {
  flex: 1;
  padding: 11px 13px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow: hidden;
  min-height: 0;
}

.htmlContent {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* ─────────────────────────────────────
   CONTAINER QUERIES
   Module adapts based on its own size
   ───────────────────────────────────── */

/* COMPACT: visual only, no text at all */
@container mod (max-width: 220px) {
  .mod-title, .mod-subtitle, .axis-labels,
  .legend, .footer-stats, .source-text { display: none !important; }
  .visual-area { height: 100%; padding: 4px; }
}

/* SMALL: title only */
@container mod (min-width: 221px) and (max-width: 360px) {
  .mod-title    { display: block; font-size: 10px; }
  .mod-subtitle { display: none; }
  .legend       { display: none; }
  .footer-stats { display: none; }
}

/* STANDARD: title + subtitle */
@container mod (min-width: 361px) and (max-width: 520px) {
  .mod-title    { display: block; }
  .mod-subtitle { display: block; }
  .legend       { display: none; }
}

/* FULL: everything */
@container mod (min-width: 521px) {
  .mod-title, .mod-subtitle,
  .legend, .footer-stats { display: block; }
}
```

### ModuleFactory.tsx

```tsx
// src/components/modules/ModuleFactory.tsx

import { Module } from '@/lib/types'
import KpiModule    from './types/KpiModule'
import ChartModule  from './types/ChartModule'
import GaugeModule  from './types/GaugeModule'
import TableModule  from './types/TableModule'
import FeedModule   from './types/FeedModule'
import BmcModule    from './types/BmcModule'

export default function ModuleFactory({ module }: { module: Module }) {
  const [category, variant] = module.type.split('.')

  switch (category) {
    case 'kpi':    return <KpiModule module={module} />
    case 'chart':  return <ChartModule module={module} variant={variant} />
    case 'gauge':  return <GaugeModule module={module} />
    case 'table':  return <TableModule module={module} />
    case 'feed':   return <FeedModule module={module} />
    case 'canvas': return <BmcModule module={module} />
    default:
      return (
        <div style={{ padding: 12, fontSize: 11, color: 'var(--t-muted)' }}>
          Unknown: {module.type}
        </div>
      )
  }
}
```

---

## 9. All Module Types — Code

### KpiModule.tsx — pure CSS, no library

```tsx
// src/components/modules/types/KpiModule.tsx
import { Module } from '@/lib/types'

const ACCENT: Record<string, string> = {
  brand: '#DA291C', green: '#16A34A', amber: '#D97706',
  purple: '#7C3AED', teal: '#0D9488', blue: '#2563EB',
}

export default function KpiModule({ module }: { module: Module }) {
  const { data, accent } = module
  const color     = ACCENT[accent] || '#DA291C'
  const sparkline = (data.sparkline as number[]) || [30, 45, 38, 60, 75, 82, 100]
  const max       = Math.max(...sparkline)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 4 }}>

      {/* Label */}
      <div className="mod-title" style={{
        fontSize: 10, fontWeight: 700,
        letterSpacing: '0.07em', textTransform: 'uppercase',
        color,
      }}>
        {data.title}
      </div>

      {/* Big number — clamp scales with container width */}
      <div style={{
        fontSize: 'clamp(18px, 4cqw, 32px)',
        fontWeight: 800, color: 'var(--t-primary)',
        letterSpacing: '-1.5px', lineHeight: 1.05,
        flex: 1, display: 'flex', alignItems: 'center',
      }}>
        {data.value}
      </div>

      {/* Bottom row */}
      <div className="footer-stats" style={{
        display: 'flex', alignItems: 'flex-end',
        justifyContent: 'space-between', marginTop: 4,
      }}>

        {/* Delta */}
        <div style={{
          fontSize: 11, fontWeight: 600,
          color: data.direction === 'up'
            ? '#16A34A'
            : data.direction === 'down'
              ? '#DA291C'
              : 'var(--t-muted)',
          display: 'flex', alignItems: 'center', gap: 2,
        }}>
          {data.direction === 'up' ? '↗' : data.direction === 'down' ? '↘' : '→'}
          {data.delta}
        </div>

        {/* Sparkline — pure CSS divs, no library */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 28 }}>
          {sparkline.map((val, i) => {
            const h = (val / max) * 100
            const isLast = i === sparkline.length - 1
            const opacity = isLast ? 1 : 0.15 + (i / (sparkline.length - 1)) * 0.35
            return (
              <div key={i} style={{
                width: 9, height: `${h}%`,
                background: color, opacity,
                borderRadius: '3px 3px 0 0', flexShrink: 0,
              }} />
            )
          })}
        </div>
      </div>
    </div>
  )
}
```

### GaugeModule.tsx — inline SVG arc, no library

```tsx
// src/components/modules/types/GaugeModule.tsx
import { Module } from '@/lib/types'

const ACCENT: Record<string, string> = {
  brand: '#DA291C', green: '#16A34A', amber: '#D97706',
  purple: '#7C3AED', teal: '#0D9488', blue: '#2563EB',
}

export default function GaugeModule({ module }: { module: Module }) {
  const { data, accent } = module
  const color = ACCENT[accent] || '#DA291C'
  const value = (data.value as number) || 0
  const max   = (data.max as number) || 100
  const pct   = Math.min(value / max, 1)

  const R  = 36
  const cx = 50, cy = 54
  const startAngle = -210
  const totalArc   = 240
  const toRad = (d: number) => (d * Math.PI) / 180

  const arcPoint = (angleDeg: number) => ({
    x: cx + R * Math.cos(toRad(startAngle + angleDeg)),
    y: cy + R * Math.sin(toRad(startAngle + angleDeg)),
  })

  const start    = arcPoint(0)
  const end      = arcPoint(totalArc * pct)
  const trackEnd = arcPoint(totalArc)
  const large    = totalArc * pct > 180 ? 1 : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 6 }}>
      <div className="mod-title" style={{ fontSize: 11, fontWeight: 600, color: 'var(--t-primary)' }}>
        {data.title}
      </div>
      <div className="mod-subtitle" style={{ fontSize: 10, color: 'var(--t-muted)' }}>
        {data.subtitle}
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 100 70" style={{ width: '100%', maxWidth: 160 }}>
          {/* Track */}
          <path
            d={`M ${start.x} ${start.y} A ${R} ${R} 0 ${totalArc > 180 ? 1 : 0} 1 ${trackEnd.x} ${trackEnd.y}`}
            fill="none" stroke="#EBEBEA" strokeWidth="10" strokeLinecap="round"
          />
          {/* Fill */}
          {pct > 0 && (
            <path
              d={`M ${start.x} ${start.y} A ${R} ${R} 0 ${large} 1 ${end.x} ${end.y}`}
              fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
            />
          )}
          <text x="50" y="46" textAnchor="middle" fontSize="14" fontWeight="800" fill="var(--t-primary)">
            {value}{data.unit}
          </text>
        </svg>
      </div>
      <div className="footer-stats" style={{ fontSize: 10, color: 'var(--t-muted)', textAlign: 'center' }}>
        {data.label}
      </div>
    </div>
  )
}
```

### ChartModule.tsx — ECharts

```tsx
// src/components/modules/types/ChartModule.tsx
'use client'

import { useEffect, useRef } from 'react'
import { Module } from '@/lib/types'
import * as echarts from 'echarts'

const ACCENT: Record<string, string> = {
  brand: '#DA291C', green: '#16A34A', amber: '#D97706',
  purple: '#7C3AED', teal: '#0D9488', blue: '#2563EB',
}

export default function ChartModule({ module, variant }: { module: Module; variant: string }) {
  const ref  = useRef<HTMLDivElement>(null)
  const inst = useRef<echarts.ECharts | null>(null)
  const color = ACCENT[module.accent] || '#DA291C'
  const { data } = module

  useEffect(() => {
    if (!ref.current) return
    inst.current = echarts.init(ref.current, null, { renderer: 'canvas' })
    inst.current.setOption(buildOption(variant, data, color))

    const obs = new ResizeObserver(() => inst.current?.resize())
    obs.observe(ref.current)
    return () => { obs.disconnect(); inst.current?.dispose() }
  }, [variant, color])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 6 }}>
      <div>
        <div className="mod-title" style={{ fontSize: 11, fontWeight: 600, color: 'var(--t-primary)' }}>
          {data.title as string}
        </div>
        <div className="mod-subtitle" style={{ fontSize: 10, color: 'var(--t-muted)' }}>
          {data.subtitle as string}
        </div>
      </div>
      <div ref={ref} style={{ flex: 1, minHeight: 0 }} />
      <div className="footer-stats" style={{
        display: 'flex', gap: 14, paddingTop: 6,
        borderTop: '1px solid #F4F4F2',
      }}>
        {((data.footer_stats as string[]) || []).map((s, i) => (
          <span key={i} style={{ fontSize: 10, color: 'var(--t-muted)' }}>{s}</span>
        ))}
      </div>
    </div>
  )
}

function buildOption(variant: string, data: Record<string, unknown>, color: string) {
  const series = (data.series as number[]) || []
  const labels = (data.labels as string[]) || []
  const unit   = (data.unit as string) || ''

  const base = {
    animation: true,
    animationDuration: 600,
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#fff',
      borderColor: '#EBEBEA',
      textStyle: { color: '#3D3D3A', fontSize: 11 },
    },
    grid: { top: 8, right: 8, bottom: 20, left: 36, containLabel: true },
  }

  const axisStyles = {
    xAxis: {
      type: 'category' as const,
      data: labels,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { fontSize: 10, color: '#9B9B97' },
    },
    yAxis: {
      type: 'value' as const,
      axisLabel: { fontSize: 10, color: '#9B9B97', formatter: `{value}${unit}` },
      splitLine: { lineStyle: { color: '#F4F4F2' } },
    },
  }

  if (variant === 'bar') {
    return {
      ...base, ...axisStyles,
      series: [{
        type: 'bar',
        data: series,
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: (p: { dataIndex: number }) => {
            const opacity = 0.25 + (p.dataIndex / Math.max(series.length - 1, 1)) * 0.75
            return color + Math.round(opacity * 255).toString(16).padStart(2, '0')
          },
        },
      }],
    }
  }

  if (variant === 'line') {
    return {
      ...base, ...axisStyles,
      series: [{
        type: 'line', data: series, smooth: true,
        lineStyle: { color, width: 2 },
        itemStyle: { color },
        areaStyle: { color: color + '18' },
      }],
    }
  }

  if (variant === 'donut' || variant === 'pie') {
    const segs = (data.segments as Array<{ label: string; value: number; color_key: string }>) || []
    const segColors: Record<string, string> = {
      brand: '#DA291C', green: '#16A34A', amber: '#D97706',
      purple: '#7C3AED', teal: '#0D9488', blue: '#2563EB',
    }
    return {
      animation: true,
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        radius: variant === 'donut' ? ['50%', '75%'] : '75%',
        data: segs.map(s => ({
          name: s.label,
          value: s.value,
          itemStyle: { color: segColors[s.color_key] || color },
        })),
        label: { show: false },
      }],
    }
  }

  return base
}
```

### FeedModule.tsx

```tsx
// src/components/modules/types/FeedModule.tsx
import { Module, FeedItem } from '@/lib/types'

export default function FeedModule({ module }: { module: Module }) {
  const items = (module.data.items as FeedItem[]) || []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 8 }}>
      <div className="mod-title" style={{ fontSize: 11, fontWeight: 600, color: 'var(--t-primary)' }}>
        {module.data.title as string}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7, overflow: 'hidden' }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: 'flex', gap: 8, alignItems: 'flex-start',
            paddingBottom: i < items.length - 1 ? 7 : 0,
            borderBottom: i < items.length - 1 ? '1px solid #F4F4F2' : 'none',
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: 6, flexShrink: 0,
              background: '#F4F4F2', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C0C0BC" strokeWidth="1.5">
                <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 10, fontWeight: 500, color: 'var(--t-primary)',
                lineHeight: 1.4, overflow: 'hidden',
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              }}>
                {item.headline}
              </div>
              <div style={{ fontSize: 9, color: 'var(--t-muted)', marginTop: 2, display: 'flex', gap: 5 }}>
                <span>{item.source}</span>
                {item.sentiment && (
                  <span style={{
                    fontSize: 9, fontWeight: 500, padding: '1px 4px', borderRadius: 3,
                    background: item.sentiment === 'positive' ? '#DCFCE7' : item.sentiment === 'negative' ? '#FEE2E2' : '#F3F4F6',
                    color: item.sentiment === 'positive' ? '#166534' : item.sentiment === 'negative' ? '#991B1B' : '#6B7280',
                  }}>
                    {item.sentiment}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### TableModule.tsx

```tsx
// src/components/modules/types/TableModule.tsx
import { Module, TableColumn } from '@/lib/types'

export default function TableModule({ module }: { module: Module }) {
  const columns = (module.data.columns as TableColumn[]) || []
  const rows    = (module.data.rows as Record<string, unknown>[]) || []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 8 }}>
      <div className="mod-title" style={{ fontSize: 11, fontWeight: 600, color: 'var(--t-primary)' }}>
        {module.data.title as string}
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key} style={{
                  padding: '4px 8px', textAlign: 'left', fontSize: 10,
                  fontWeight: 500, color: 'var(--t-muted)',
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                  borderBottom: '1px solid var(--border)',
                }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} style={{ borderBottom: i < rows.length - 1 ? '1px solid #F4F4F2' : 'none' }}>
                {columns.map(col => {
                  const val = row[col.key] as string
                  const isDelta = col.type === 'delta_badge'
                  const isUp = isDelta && val?.startsWith('+')
                  return (
                    <td key={col.key} style={{ padding: '5px 8px', color: 'var(--t-secondary)' }}>
                      {isDelta ? (
                        <span style={{
                          fontSize: 10, fontWeight: 500, padding: '1px 5px', borderRadius: 3,
                          background: isUp ? '#DCFCE7' : '#FEE2E2',
                          color: isUp ? '#166534' : '#991B1B',
                        }}>
                          {val}
                        </span>
                      ) : val}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

---

## 10. CSS Container Queries — The Two-State System

The module component is ONE component. CSS container queries make it
self-adapt based on its rendered size — not the screen size.

```
Module at 1×1 → container is ~150px wide
  → @container mod (max-width: 220px) fires
  → title, labels, legend all hidden
  → User sees: bare chart shape only

User clicks expand → module goes to 2×2 → container is ~320px wide
  → @container mod (min-width: 361px) fires
  → everything visible
  → User sees: full chart with all labels
```

This happens with zero JavaScript and zero React re-renders.
ECharts detects its container resized via ResizeObserver and
redraws at the correct size automatically.

**Important note on cqw units:**
The `clamp(18px, 4cqw, 32px)` used for KPI numbers means the font
scales with container width. `1cqw = 1% of container width`.
At 200px wide: `4cqw = 8px` → clamped to 18px minimum.
At 400px wide: `4cqw = 16px` → clamped to 18px minimum.
At 600px wide: `4cqw = 24px` → renders at 24px.
This is how the big number stays properly proportioned at every size.

---

## 11. The Dummy JSON — Testing Without Backend

```typescript
// src/lib/dummyData.ts
import { DashboardPayload } from './types'

export const DUMMY_PAYLOAD: DashboardPayload = {
  meta: {
    subject: "McDonald's",
    mode: 'company',
    brand_color: '#DA291C',
    logo_initials: 'Mc',
    page_title: "McDonald's",
    page_subtitle: 'Business analysis',
  },
  tabs: [
    { id: 'overview',    label: 'Overview' },
    { id: 'financials',  label: 'Financials' },
    { id: 'market',      label: 'Market' },
    { id: 'competitors', label: 'Competitors' },
  ],
  chat_intro: "McDonald's real moat isn't the food — it's the real estate. 95% franchise model means they collect rent and royalties regardless of sales performance.",
  modules: [
    {
      id: 'revenue_trend', tab: 'overview',
      type: 'chart.bar', size: '3x3',
      layout_role: 'hero', accent: 'brand',
      data: {
        title: 'Global revenue 2018–2024',
        subtitle: 'Total USD billions · annual',
        series: [19.2, 21.1, 19.2, 23.2, 23.2, 25.0, 26.1],
        labels: ['2018','2019','2020','2021','2022','2023','2024'],
        unit: '$B',
        footer_stats: ['2024: $26.1B', 'YoY: +4.4%', '5yr CAGR: 4.2%'],
      },
    },
    {
      id: 'locations_kpi', tab: 'overview',
      type: 'kpi.number', size: '1x1',
      layout_role: 'high', accent: 'brand',
      data: {
        title: 'Locations', value: '40,275',
        delta: '+1.2%', direction: 'up',
        sparkline: [38000, 38500, 39000, 39500, 40000, 40100, 40275],
      },
    },
    {
      id: 'franchise_kpi', tab: 'overview',
      type: 'kpi.number', size: '1x1',
      layout_role: 'high', accent: 'green',
      data: {
        title: 'Franchise %', value: '95%',
        delta: 'stable', direction: 'neutral',
        sparkline: [93, 93.5, 94, 94.5, 95, 95, 95],
      },
    },
    {
      id: 'margin_kpi', tab: 'overview',
      type: 'kpi.number', size: '1x1',
      layout_role: 'medium', accent: 'amber',
      data: {
        title: 'Op. margin', value: '44.6%',
        delta: '-0.8%', direction: 'down',
        sparkline: [46, 45.5, 45.8, 45.2, 45.0, 44.9, 44.6],
      },
    },
    {
      id: 'news_feed', tab: 'overview',
      type: 'feed.news', size: '2x2',
      layout_role: 'medium', accent: 'purple',
      data: {
        title: 'Latest news',
        items: [
          { headline: "McDonald's Q3 profit beats estimates by 12% on China expansion", source: 'Reuters', date: '2026-03-15', sentiment: 'positive' },
          { headline: "India franchisee dispute delays 200-store expansion plan", source: 'FT', date: '2026-03-14', sentiment: 'negative' },
          { headline: "New AI ordering kiosks roll out across 15,000 US locations", source: 'WSJ', date: '2026-03-12', sentiment: 'positive' },
        ],
      },
    },
    {
      id: 'market_split', tab: 'overview',
      type: 'chart.donut', size: '1x2',
      layout_role: 'medium', accent: 'teal',
      data: {
        title: 'Store model split', subtitle: 'By ownership type',
        segments: [
          { label: 'Franchise',     value: 60, color_key: 'brand' },
          { label: 'Company-owned', value: 25, color_key: 'green' },
          { label: 'Licensed',      value: 15, color_key: 'amber' },
        ],
      },
    },
    /* Financials tab */
    {
      id: 'revenue_breakdown', tab: 'financials',
      type: 'chart.bar', size: '5x3',
      layout_role: 'hero', accent: 'brand',
      data: {
        title: 'Revenue by segment 2024', subtitle: 'USD billions',
        series: [13.2, 8.1, 4.8],
        labels: ['Franchise fees', 'Company-owned', 'Other'],
        unit: '$B',
      },
    },
    {
      id: 'margin_trend', tab: 'financials',
      type: 'chart.line', size: '5x2',
      layout_role: 'high', accent: 'green',
      data: {
        title: 'Operating margin 5-year', subtitle: 'Percent',
        series: [42.1, 43.8, 44.9, 45.3, 44.6],
        labels: ['2020','2021','2022','2023','2024'],
        unit: '%',
      },
    },
    /* Market tab */
    {
      id: 'competitors_table', tab: 'market',
      type: 'table.ranked', size: '5x3',
      layout_role: 'hero', accent: 'blue',
      data: {
        title: 'Fast food competitive landscape',
        columns: [
          { key: 'company', label: 'Company' },
          { key: 'revenue', label: 'Revenue ($B)', type: 'number', sortable: true },
          { key: 'locations', label: 'Locations', type: 'number', sortable: true },
          { key: 'growth', label: 'YoY Growth', type: 'delta_badge' },
        ],
        rows: [
          { company: "McDonald's", revenue: '26.1', locations: '40,275', growth: '+4.4%' },
          { company: 'Starbucks',  revenue: '23.1', locations: '38,000', growth: '+3.2%' },
          { company: 'Subway',     revenue: '9.4',  locations: '37,000', growth: '-0.8%' },
          { company: 'Chick-fil-A',revenue: '21.6', locations: '3,000',  growth: '+8.1%' },
        ],
      },
    },
  ],
}
```

### Using dummy data in dashboard/page.tsx

```tsx
// src/app/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { DashboardPayload } from '@/lib/types'
import { DUMMY_PAYLOAD } from '@/lib/dummyData'
import { playReveal } from '@/lib/revealAnimation'
import AppShell from '@/components/layout/AppShell'
import ModuleGrid from '@/components/layout/ModuleGrid'

export default function DashboardPage() {
  const [dashboard] = useState<DashboardPayload>(DUMMY_PAYLOAD)
  const [activeTab, setActiveTab]   = useState(DUMMY_PAYLOAD.tabs[0].id)

  useEffect(() => {
    const t = setTimeout(playReveal, 50)
    return () => clearTimeout(t)
  }, [activeTab])

  return (
    <AppShell
      tabs={dashboard.tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      brandColor={dashboard.meta.brand_color}
      logoInitials={dashboard.meta.logo_initials}
      pageTitle={dashboard.meta.page_title}
      chatIntro={dashboard.chat_intro}
    >
      <ModuleGrid modules={dashboard.modules} activeTab={activeTab} />
    </AppShell>
  )
}
```

When ready to connect n8n — change two lines:

```tsx
// Before:
const [dashboard] = useState<DashboardPayload>(DUMMY_PAYLOAD)

// After:
const [dashboard, setDashboard] = useState<DashboardPayload | null>(null)
const prompt = new URLSearchParams(window.location.search).get('q') || ''
useEffect(() => {
  fetch(process.env.NEXT_PUBLIC_N8N_WEBHOOK!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  }).then(r => r.json()).then(setDashboard)
}, [prompt])
```

Frontend never knows whether JSON came from dummy data, n8n, or Python.

---

## 12. Testing Checklist

### Layout tests

- [ ] Topbar is 52px, never wraps on any window width
- [ ] Chat panel is 220px, never shrinks or grows
- [ ] Module grid fills ALL remaining space — no visible gaps at edges
- [ ] No horizontal scrollbar at 1280px window width
- [ ] Tab switching swaps modules, chat panel does not move

### Grid tests

- [ ] 1440px: hero 3×3 takes up roughly 57% of grid width
- [ ] 1280px: still no scroll, proportional
- [ ] 1024px: slight compression, still all readable
- [ ] 900px: minimum cell sizes kick in, scroll appears — modules don't squash below 140px

### Container query tests — use DevTools

1. Open DevTools → Elements
2. Find a module card
3. Force its width to 180px using DevTools styles
4. Title and labels should disappear → bare chart visible
5. Set to 300px → title visible, legend still hidden
6. Set to 500px → everything visible

### Module type tests

- [ ] KpiModule: renders number + CSS sparkline bars (no library)
- [ ] ChartModule bar: ECharts instance fills container, bars graduated
- [ ] ChartModule line: smooth curve with area fill
- [ ] ChartModule donut: ring with correct segments
- [ ] GaugeModule: SVG arc with correct fill percentage
- [ ] FeedModule: news items with sentiment colour badges
- [ ] TableModule: rows with delta badge cells coloured correctly

### Reveal animation test

- [ ] On page load all cards start at opacity 0
- [ ] Within 50ms cards begin fading up one by one
- [ ] Last card finishes its animation within 700ms of page load
- [ ] Tab switch replays the animation for the new tab's modules

---

## 13. The Reveal Animation

```typescript
// src/lib/revealAnimation.ts
export function playReveal() {
  const cards = document.querySelectorAll<HTMLElement>('[data-reveal-index]')

  cards.forEach(card => {
    const index = parseInt(card.getAttribute('data-reveal-index') || '0')

    // Reset first so tab switches replay cleanly
    card.style.opacity = '0'
    card.style.transform = 'translateY(8px)'

    // Apply animation with stagger
    card.style.animation = 'none'
    card.offsetHeight // force reflow

    card.style.animation = `cardReveal 0.35s ease forwards`
    card.style.animationDelay = `${index * 40}ms`
  })
}
```

```css
/* globals.css */
@keyframes cardReveal {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## Quick Reference Tables

### Size class → grid span

| AI JSON size | CSS class | Cols × Rows |
|-------------|-----------|-------------|
| `1x1` | `mod-1x1` | 1 × 1 |
| `1x2` | `mod-1x2` | 1 × 2 |
| `2x1` | `mod-2x1` | 2 × 1 |
| `2x2` | `mod-2x2` | 2 × 2 |
| `2x3` | `mod-2x3` | 2 × 3 |
| `3x2` | `mod-3x2` | 3 × 2 |
| `3x3` | `mod-3x3` | 3 × 3 |
| `5x2` | `mod-5x2` | full width × 2 |
| `5x3` | `mod-5x3` | full width × 3 |
| `5x5` | `mod-5x5` | entire grid |

### Module type → rendering approach

| Type | Renders with | Reason |
|------|-------------|--------|
| `kpi.number` | Pure CSS divs | 5–7 bars, no interaction |
| `kpi.gauge` | Inline SVG | One arc value, no library |
| `chart.bar` | ECharts | Axes, tooltips, many points |
| `chart.line` | ECharts | Smooth curve, zoom |
| `chart.donut` | ECharts | Segments with hover |
| `chart.waterfall` | ECharts | Complex stacking |
| `feed.news` | Plain HTML | List layout |
| `table.basic` | HTML table | Rows and columns |
| `canvas.flow` | React Flow | Node graph |
| `canvas.bmc` | Plain HTML | 9-cell CSS grid |

---

*Build order: dummy dashboard working → looks great → connect n8n → real data flows in.*