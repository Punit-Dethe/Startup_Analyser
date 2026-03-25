# Temporary Tabs System
## Technical Design Document

**Feature**: Temporary tabs within a single dashboard  
**Version**: 3.0 (Corrected)  
**Date**: 2025-01-24  
**Status**: Draft

---

## 1. High-Level Design

### 1.1 System Overview

The Temporary Tabs System allows the chat AI to create NEW tabs that appear in the existing tab navigation bar alongside permanent tabs (Overview, Financials, Market, Business Model, Competitors). These temporary tabs contain modules in a 5x5 grid, just like permanent tabs.

```
┌─────────────────────────────────────────────────────────────┐
│  TOPBAR — Logo | [Overview] [Financials] [Market] [🔸Temp]  │
├──────────────┬──────────────────────────────────────────────┤
│              │                                              │
│  CHAT PANEL  │         ACTIVE TAB CONTENT                   │
│              │         (5x5 module grid)                    │
│              │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

**Key Insight**: This is NOT about multiple dashboards. It's about adding temporary tabs to the EXISTING dashboard's tab bar.

### 1.2 Core Concepts

#### Permanent Tabs
The 5 tabs generated when the dashboard is first created:
- Overview
- Financials
- Market
- Business Model
- Competitors

These tabs are part of `dashboard.tabs[]` and persist until the dashboard is cleared.

#### Temporary Tabs
NEW tabs created by the chat AI when:
- User asks for focused analysis ("Deep dive into revenue model")
- User asks for comparisons ("Compare with competitors")
- User asks for specific views ("Show me market analysis")

Temporary tabs:
- Appear in the SAME tab bar as permanent tabs
- Contain modules in 5x5 grid (just like permanent tabs)
- Have a visual indicator (badge, icon, or color)
- Can be closed/removed individually
- Clear on page refresh (no persistence)

#### Chat AI Response Modes
The chat AI has THREE response modes:
1. **CHAT** - Just answer in chat (text only, no dashboard changes)
2. **REFRESH** - Regenerate the entire 5-tab dashboard (existing behavior)
3. **TEMPORARY_TAB** - Create a NEW temporary tab in the existing tab bar

### 1.3 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  useDashboard Hook (Extended)                        │  │
│  │  - dashboard.tabs[] (permanent + temporary)          │  │
│  │  - dashboard.modules[] (all modules)                 │  │
│  │  - addTemporaryTab(), removeTab()                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ▲                                   │
│                          │                                   │
│  ┌───────────────────┬──┴──────────┬──────────────────┐    │
│  │                   │             │                   │    │
│  │  Dashboard        │  Topbar     │  Chat             │    │
│  │  Renderer         │  (Tab Bar)  │  Interface        │    │
│  │  (ModuleGrid)     │             │  (ChatPanel)      │    │
│  │                   │             │                   │    │
│  └───────────────────┴─────────────┴──────────────────┘    │
│                                                              │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (n8n)                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Chat AI (Gemini)                                    │  │
│  │  - Analyzes user intent                              │  │
│  │  - Decides: CHAT / REFRESH / TEMPORARY_TAB           │  │
│  │  - Generates tab content if TEMPORARY_TAB            │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ▲                                   │
│                          │                                   │
│  ┌───────────────────┬──┴──────────┬──────────────────┐    │
│  │                   │             │                   │    │
│  │  /generate        │  /chat      │  Data             │    │
│  │  (Full)           │  (Actions)  │  Collector        │    │
│  │                   │             │                   │    │
│  └───────────────────┴─────────────┴──────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 1.4 Data Flow

#### Scenario 1: Initial Dashboard Generation
```
User: "Analyze Apple Inc"
  ↓
Frontend → /api/generate { query: "Analyze Apple Inc" }
  ↓
n8n → Generates: 5 permanent tabs (Overview, Financials, Market, Business Model, Competitors)
  ↓
Frontend ← Dashboard payload
  ↓
dashboard.tabs = [
  { id: "overview", label: "Overview" },
  { id: "financials", label: "Financials" },
  { id: "market", label: "Market" },
  { id: "business_model", label: "Business Model" },
  { id: "competitors", label: "Competitors" }
]
```

#### Scenario 2: Generate Temporary Tab (Competitor Comparison)
```
User: "Compare Apple with Samsung and Google"
  ↓
Chat → /api/chat { message: "...", current_dashboard: {...} }
  ↓
n8n Chat AI → Determines: TEMPORARY_TAB (Competitor Comparison)
  ↓
Chat Response: {
  action: "TEMPORARY_TAB",
  tab: {
    id: "temp_comp_123",
    label: "Competitor Comparison",
    isTemporary: true
  },
  modules: [ /* 5x5 grid of modules */ ]
}
  ↓
Frontend → Adds tab to dashboard.tabs[] and modules to dashboard.modules[]
  ↓
dashboard.tabs = [
  { id: "overview", label: "Overview" },
  { id: "financials", label: "Financials" },
  { id: "market", label: "Market" },
  { id: "business_model", label: "Business Model" },
  { id: "competitors", label: "Competitors" },
  { id: "temp_comp_123", label: "Competitor Comparison", isTemporary: true } ← NEW
]
  ↓
UI switches to new temporary tab
```

#### Scenario 3: Remove Temporary Tab
```
User clicks: [X] button on temporary tab
  ↓
Frontend → removeTemporaryTab(tabId)
  ↓
- Remove tab from dashboard.tabs[]
- Remove all modules with tab === tabId from dashboard.modules[]
- Switch to first permanent tab
```

#### Scenario 4: Page Refresh
```
User refreshes page
  ↓
localStorage loads dashboard
  ↓
Filter out all temporary tabs (isTemporary === true)
  ↓
Only permanent tabs remain
```

---

## 2. Low-Level Design

### 2.1 Data Structures

#### Extended Tab Interface (TypeScript)
```typescript
// src/lib/types.ts

export interface Tab {
  id: string
  label: string
  isTemporary?: boolean  // NEW: Flag for temporary tabs
}
```

#### Extended DashboardPayload (TypeScript)
```typescript
// src/lib/types.ts

export interface DashboardPayload {
  meta: DashboardMeta
  tabs: Tab[]              // Now includes permanent + temporary tabs
  chat_intro: string
  modules: Module[]        // All modules (permanent + temporary)
}
```

#### Chat Action Extension (TypeScript)
```typescript
// src/lib/types.ts

export interface ChatResponse {
  action: 'CHAT' | 'REFRESH' | 'TEMPORARY_TAB'  // NEW: TEMPORARY_TAB action
  message: string | null
  
  // For REFRESH action
  new_prompt?: string
  
  // For TEMPORARY_TAB action
  tab?: {
    id: string
    label: string
    isTemporary: true
  }
  modules?: Module[]  // Modules for the new temporary tab
}
```

### 2.2 Component Changes

#### Extended useDashboard Hook
```typescript
// src/hooks/useDashboard.ts

export function useDashboard() {
  const [state, setState] = useState<KoreState>(INITIAL)
  
  // ... existing code ...
  
  // NEW: Add temporary tab
  const addTemporaryTab = useCallback((tab: Tab, modules: Module[]) => {
    setState(s => {
      if (!s.dashboard) return s
      
      // Add tab to tabs array
      const newTabs = [...s.dashboard.tabs, tab]
      
      // Add modules to modules array
      const newModules = [...s.dashboard.modules, ...modules]
      
      // Update dashboard payload
      const newDashboard = {
        ...s.dashboard,
        tabs: newTabs,
        modules: newModules,
      }
      
      // Update compact state
      const newDashboardState = summarizeDashboard(newDashboard)
      
      // Persist to localStorage
      persist(newDashboard, newDashboardState, s.chatHistory)
      
      return {
        ...s,
        dashboard: newDashboard,
        dashboardState: newDashboardState,
        activeTab: tab.id,  // Switch to new tab
      }
    })
  }, [])
  
  // NEW: Remove temporary tab
  const removeTemporaryTab = useCallback((tabId: string) => {
    setState(s => {
      if (!s.dashboard) return s
      
      // Remove tab from tabs array
      const newTabs = s.dashboard.tabs.filter(t => t.id !== tabId)
      
      // Remove all modules for this tab
      const newModules = s.dashboard.modules.filter(m => m.tab !== tabId)
      
      // Update dashboard payload
      const newDashboard = {
        ...s.dashboard,
        tabs: newTabs,
        modules: newModules,
      }
      
      // Update compact state
      const newDashboardState = summarizeDashboard(newDashboard)
      
      // Persist to localStorage
      persist(newDashboard, newDashboardState, s.chatHistory)
      
      // Switch to first permanent tab if we're on the removed tab
      const newActiveTab = s.activeTab === tabId 
        ? newTabs[0]?.id ?? '' 
        : s.activeTab
      
      return {
        ...s,
        dashboard: newDashboard,
        dashboardState: newDashboardState,
        activeTab: newActiveTab,
      }
    })
  }, [])
  
  // MODIFIED: sendChat() handles TEMPORARY_TAB action
  const sendChat = useCallback(async (userMessage: string) => {
    // ... existing chat logic ...
    
    try {
      const result = await sendChatMessage(payload)

      // Handle TEMPORARY_TAB action
      if (result.action === 'TEMPORARY_TAB' && result.tab && result.modules) {
        const msg = `Created temporary tab: "${result.tab.label}"`
        setState(s => {
          const history = addMsg(s.chatHistory, 'assistant', msg)
          persist(s.dashboard!, s.dashboardState!, history)
          return { ...s, chatHistory: history, isChatLoading: false }
        })
        // Add the temporary tab
        addTemporaryTab(result.tab, result.modules)
        return
      }

      // Handle REFRESH action (existing behavior)
      if (result.action === 'REFRESH' && result.new_prompt) {
        const reloadMsg = `Generating new dashboard for: "${result.new_prompt}"…`
        setState(s => {
          const reloadHist = addMsg(s.chatHistory, 'assistant', reloadMsg)
          persist(s.dashboard!, s.dashboardState!, reloadHist)
          return { ...s, chatHistory: reloadHist, isChatLoading: false, isLoading: true }
        })
        generate(result.new_prompt)
        return
      }

      // Handle CHAT action (unchanged)
      setState(s => {
        const history = addMsg(s.chatHistory, 'assistant', result.message ?? '')
        persist(s.dashboard!, s.dashboardState!, history)
        return { ...s, chatHistory: history, isChatLoading: false }
      })
    } catch (err) {
      // ... error handling ...
    }
  }, [generate, addTemporaryTab])
  
  // MODIFIED: Restore from localStorage (filter out temporary tabs)
  useEffect(() => {
    try {
      const dash = localStorage.getItem(LS_DASHBOARD)
      const compact = localStorage.getItem(LS_STATE)
      const hist = localStorage.getItem(LS_HISTORY)
      if (dash && compact) {
        const dashboard: DashboardPayload = JSON.parse(dash)
        const dashboardState: CompactState = JSON.parse(compact)
        const chatHistory: ChatMessage[] = hist ? JSON.parse(hist) : []
        
        // Filter out temporary tabs on restore
        const permanentTabs = dashboard.tabs.filter(t => !t.isTemporary)
        const permanentTabIds = new Set(permanentTabs.map(t => t.id))
        const permanentModules = dashboard.modules.filter(m => 
          !m.tab || permanentTabIds.has(m.tab)
        )
        
        const cleanedDashboard = {
          ...dashboard,
          tabs: permanentTabs,
          modules: permanentModules,
        }
        
        setState(s => ({
          ...s,
          dashboard: cleanedDashboard,
          dashboardState: summarizeDashboard(cleanedDashboard),
          chatHistory,
          activeTab: cleanedDashboard.tabs[0]?.id ?? '',
        }))
      }
    } catch { /* corrupt storage – ignore */ }
  }, [])
  
  return {
    // Existing exports
    dashboard: state.dashboard,
    dashboardState: state.dashboardState,
    chatHistory: state.chatHistory,
    activeTab: state.activeTab,
    isLoading: state.isLoading,
    isChatLoading: state.isChatLoading,
    error: state.error,
    generate,
    sendChat,
    setActiveTab,
    clearDashboard,
    
    // NEW exports
    addTemporaryTab,
    removeTemporaryTab,
  }
}
```

#### Extended Topbar Component
```typescript
// src/components/layout/Topbar.tsx

interface TopbarProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (id: string) => void
  onRemoveTab?: (id: string) => void  // NEW: Callback to remove temporary tabs
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
      {/* ... existing brand section ... */}

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

      {/* ... existing right actions ... */}
    </div>
  )
}
```

#### Updated page.tsx Integration
```typescript
// src/app/page.tsx

export default function LandingPage() {
  const { 
    payload, 
    loading, 
    error, 
    activeTab, 
    submit, 
    setActiveTab, 
    chatHistory, 
    isChatLoading, 
    sendChat, 
    clearDashboard,
    removeTemporaryTab,  // NEW
  } = useDashboard()

  // ... existing code ...

  if (payload && !loading && !error) {
    return (
      <AppShell
        tabs={payload.tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRemoveTab={removeTemporaryTab}  // NEW: Pass remove handler
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

  // ... rest of component ...
}
```

### 2.3 Backend Changes

#### Updated Chat System Prompt
```markdown
# KORE Dashboard — Chat Node System Prompt

**System Instructions for Gemini (n8n Chat Node)**

You are the KORE AI analyst — a senior business intelligence expert embedded inside a live, interactive dashboard. You are not a generic chatbot. You are direct, precise, authoritative, and deeply analytical.

A dashboard is currently loaded on the user's screen. Your context for this conversation is:
Subject: {{ $json.body.context.subject }}
Active tab: {{ $json.body.context.active_tab }}
Visible modules on this tab:
{{ JSON.stringify($json.body.context.visible_modules, null, 2) }}

You have THREE response actions available to you:

## ACTION: CHAT
**Use when:** The user's question can be answered analytically from the existing data, or requires a conversational explanation, synthesis, or strategic recommendation. 
**Behavior:** No dashboard changes are needed. Provide a premium, markdown-formatted analytical response.

**You can use FULL HTML and Markdown capabilities:**
- Tables, lists, blockquotes
- Inline HTML for styling
- Code blocks for technical content
- Rich formatting for complex analysis

## ACTION: REFRESH
**Use when:** The user wants a completely different analysis subject or a full dashboard regeneration.

**Examples:**
- "Analyze [Different Company]" → REFRESH
- "Start over with [New Subject]" → REFRESH
- "Generate a new dashboard for [Subject]" → REFRESH

**Behavior:** Provide a `new_prompt` that will trigger the full generation pipeline. The entire dashboard will be regenerated with 5 permanent tabs.

## ACTION: TEMPORARY_TAB
**Use when:** The user wants focused analysis that's too big for chat but doesn't need a full dashboard refresh.

**Examples:**
- "Compare [Company] with [Competitors]" → TEMPORARY_TAB
- "Deep dive into [Company]'s revenue model" → TEMPORARY_TAB
- "Show me market analysis" → TEMPORARY_TAB
- "Create a competitor comparison" → TEMPORARY_TAB

**Behavior:** Generate a NEW tab with modules in a 5x5 grid. The tab will appear in the existing tab bar alongside permanent tabs (Overview, Financials, Market, Business Model, Competitors).

**CRITICAL**: For TEMPORARY_TAB, you MUST generate:
1. A tab object with id, label, and isTemporary: true
2. An array of 15-25 modules (5x5 grid) with proper sizing
3. All modules MUST have `tab` field set to the new tab's id

---

### DECISION GUIDE:
- "What does this chart mean?" → **CHAT**
- "Why did revenue drop in Q3?" → **CHAT** (Use Google Search to find the answer)
- "What are the risks with this strategy?" → **CHAT** (Provide detailed analysis)
- "Compare Apple with Samsung and Google" → **TEMPORARY_TAB** (Create competitor comparison tab)
- "Deep dive into Apple's revenue model" → **TEMPORARY_TAB** (Create revenue-focused tab)
- "Show me market analysis" → **TEMPORARY_TAB** (Create market-focused tab)
- "Now analyze Microsoft instead" → **REFRESH** (Different subject, full regeneration)

---

### CRITICAL RULE: JSON OUTPUT ONLY
You MUST use Google Search to find live, accurate data if you need it to answer the question.

You MUST ALWAYS respond in this EXACT raw JSON format. No markdown fences (```json). No conversational filler outside the JSON. Just the raw JSON object:

**For CHAT:**
{
  "action": "CHAT",
  "message": "Your premium, analytical response here. Use bolding, tables, lists, and markdown formatting."
}

**For REFRESH:**
{
  "action": "REFRESH",
  "message": "Generating a new dashboard for [subject]...",
  "new_prompt": "Detailed, context-rich prompt for the generation system"
}

**For TEMPORARY_TAB:**
{
  "action": "TEMPORARY_TAB",
  "message": "Created temporary tab: [Tab Name]",
  "tab": {
    "id": "temp_[unique_id]",
    "label": "[Tab Name]",
    "isTemporary": true
  },
  "modules": [
    {
      "id": "mod_[unique_id]",
      "tab": "temp_[unique_id]",
      "type": "chart.bar",
      "size": "2x2",
      "accent": "brand",
      "data": {
        "title": "Module Title",
        "series": [...],
        "labels": [...]
      }
    },
    // ... 14-24 more modules to fill 5x5 grid
  ]
}

**CRITICAL RULES FOR TEMPORARY_TAB:**
1. Generate 15-25 modules (5x5 grid rule)
2. All modules MUST have `tab` field set to the new tab's id
3. Use proper module types: chart.bar, chart.line, kpi.number, table.data, feed.news, etc.
4. Use proper sizing: 1x1, 2x2, 3x3, 2x3, 3x2, etc.
5. Ensure modules have complete data structures
6. Use appropriate accent colors: brand, green, amber, purple, teal, blue
```

---

## 3. Implementation Phases

### Phase 1: Extend Type Definitions (Day 1)
- [ ] Add `isTemporary?: boolean` to Tab interface
- [ ] Extend ChatResponse to include TEMPORARY_TAB action
- [ ] Add tab and modules fields to ChatResponse
- [ ] Test type definitions compile

### Phase 2: Extend useDashboard Hook (Day 1-2)
- [ ] Implement `addTemporaryTab()` function
- [ ] Implement `removeTemporaryTab()` function
- [ ] Modify `sendChat()` to handle TEMPORARY_TAB action
- [ ] Modify localStorage restore to filter out temporary tabs
- [ ] Test temporary tab addition/removal

### Phase 3: Update Topbar UI (Day 2-3)
- [ ] Add temporary tab indicator (colored dot)
- [ ] Add close button for temporary tabs
- [ ] Add extra padding for close button
- [ ] Pass `onRemoveTab` prop from page.tsx
- [ ] Test UI interactions

### Phase 4: Update Chat System Prompt (Day 3-4)
- [ ] Add TEMPORARY_TAB action documentation
- [ ] Add decision guide for when to use TEMPORARY_TAB
- [ ] Add JSON output format for TEMPORARY_TAB
- [ ] Add critical rules for module generation
- [ ] Test with example prompts

### Phase 5: Integration & Testing (Day 4-5)
- [ ] Wire up all components
- [ ] Test full flow: chat → TEMPORARY_TAB → add tab → switch → remove
- [ ] Test localStorage restore (temporary tabs filtered out)
- [ ] Test edge cases (no dashboard, single tab, multiple temporary tabs)
- [ ] Test module rendering in temporary tabs

### Phase 6: Polish & Documentation (Day 5)
- [ ] Improve temporary tab styling
- [ ] Add hover effects
- [ ] Add keyboard shortcuts (optional)
- [ ] Update documentation
- [ ] Create demo video

---

## 4. Key Design Decisions

### Decision 1: Temporary Tabs in Same Tab Bar
**Rationale**: Simpler UX than dropdown selector. Users can see all tabs at once.

**Alternatives Considered**:
- Dropdown selector (too complex)
- Separate temporary tabs section (confusing)
- Modal/overlay (breaks flow)

### Decision 2: Filter Temporary Tabs on Restore
**Rationale**: Temporary tabs are session-only. Refreshing page should clear them.

**Alternatives Considered**:
- Persist temporary tabs (adds complexity)
- Ask user before clearing (annoying)
- TTL expiration (unnecessary)

### Decision 3: Visual Indicator (Colored Dot)
**Rationale**: Subtle but clear indicator that tab is temporary.

**Alternatives Considered**:
- Badge with "TEMP" text (too noisy)
- Different background color (too prominent)
- Icon (takes up space)

### Decision 4: Close Button on Hover
**Rationale**: Clean UI when not hovering, functional when needed.

**Alternatives Considered**:
- Always visible close button (cluttered)
- Right-click context menu (not discoverable)
- Drag to remove (not intuitive)

### Decision 5: Chat AI Generates Modules
**Rationale**: Chat AI already has context and can generate focused modules.

**Alternatives Considered**:
- Separate generation endpoint (adds latency)
- Reuse /generate endpoint (too heavy)
- Client-side module generation (not smart enough)

---

## 5. Open Questions & Answers

### Q1: Should we limit the number of temporary tabs?
**A**: Optional - could add max limit (e.g., 5) with warning. Not critical for v1.

### Q2: Should we show a confirmation before removing a temporary tab?
**A**: No - tabs are temporary and can be regenerated. Keep UX fast.

### Q3: Should temporary tabs persist across page refreshes?
**A**: No - they're explicitly temporary. Refreshing clears them.

### Q4: Should we add keyboard shortcuts for switching tabs?
**A**: Nice to have - Cmd+1, Cmd+2, etc. Not critical for v1.

### Q5: How do we handle chat context when on a temporary tab?
**A**: Send the temporary tab's modules in the context, just like permanent tabs.

### Q6: Can temporary tabs have the same label as permanent tabs?
**A**: Yes - the colored dot distinguishes them. But AI should use descriptive labels.

### Q7: What happens if the AI generates invalid modules?
**A**: Frontend validation should catch this. Fall back to CHAT action with error message.

---

## 6. Success Metrics

### Quantitative Metrics
- **Temporary Tab Usage**: 30%+ of chat sessions create at least one temporary tab
- **Tab Switching**: Average 3-5 tab switches per session
- **Generation Accuracy**: 90%+ of TEMPORARY_TAB actions generate valid modules
- **Performance**: <50ms to add/remove temporary tabs

### Qualitative Metrics
- User feedback on temporary tabs feature
- Reduction in "regenerate everything" requests
- Increased analytical depth per session

---

## 7. Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| AI generates invalid modules | High | Medium | Add frontend validation, fallback to CHAT |
| Too many temporary tabs clutter UI | Medium | Low | Add max limit (5 tabs) |
| User confusion about temporary nature | Medium | Medium | Clear visual indicator + tooltip |
| Performance with many tabs | Low | Low | Lazy rendering if needed |
| Chat context becomes too large | Medium | Low | Limit context to active tab only |

---

## 8. Future Enhancements (Out of Scope for v1)

### Persistence (If Requested)
- Save temporary tabs to localStorage
- Restore on page refresh
- Add TTL expiration (e.g., 24 hours)

### Advanced Features
- Rename temporary tabs
- Convert temporary tab to permanent
- Duplicate temporary tabs
- Export temporary tab data

### UI Improvements
- Drag-and-drop tab reordering
- Tab groups/categories
- Tab search/filter
- Tab history

---

**End of Design Document**
