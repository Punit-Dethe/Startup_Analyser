'use client'

import { useState, useCallback, useEffect } from 'react'
import { DashboardPayload, CompactState, ChatMessage, Module } from '@/lib/types'
import { generateDashboard as apiGenerate, sendChatMessage, ChatPayload } from '@/lib/api'
import { summarizeDashboard } from '@/lib/summarize'

const LS_DASHBOARD = 'kore_dashboard'
const LS_STATE     = 'kore_state'
const LS_HISTORY   = 'kore_history'
const MAX_HISTORY  = 20

// ─── Helpers (module-level, no closure issues) ────────────────────────────────

function persist(dashboard: DashboardPayload, dashboardState: CompactState, history: ChatMessage[]) {
  try {
    localStorage.setItem(LS_DASHBOARD, JSON.stringify(dashboard))
    localStorage.setItem(LS_STATE,     JSON.stringify(dashboardState))
    localStorage.setItem(LS_HISTORY,   JSON.stringify(history.slice(-MAX_HISTORY)))
  } catch { /* storage full – ignore */ }
}

function addMsg(history: ChatMessage[], role: ChatMessage['role'], content: string): ChatMessage[] {
  return [...history, { role, content }]
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface KoreState {
  dashboard:      DashboardPayload | null
  dashboardState: CompactState | null
  chatHistory:    ChatMessage[]
  activeTab:      string
  isLoading:      boolean
  isChatLoading:  boolean
  error:          string | null
}

const INITIAL: KoreState = {
  dashboard: null, dashboardState: null, chatHistory: [],
  activeTab: '', isLoading: false, isChatLoading: false, error: null,
}

export function useDashboard() {
  const [state, setState] = useState<KoreState>(INITIAL)

  // ── Restore from localStorage on mount ──────────────────────────────────
  useEffect(() => {
    try {
      const dash    = localStorage.getItem(LS_DASHBOARD)
      const compact = localStorage.getItem(LS_STATE)
      const hist    = localStorage.getItem(LS_HISTORY)
      if (dash && compact) {
        const dashboard:      DashboardPayload = JSON.parse(dash)
        const dashboardState: CompactState     = JSON.parse(compact)
        const chatHistory:    ChatMessage[]    = hist ? JSON.parse(hist) : []
        
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

  // ── Generate Dashboard ───────────────────────────────────────────────────

  const generate = useCallback(async (query: string) => {
    // Guard against double calls
    setState(s => {
      if (s.isLoading) {
        console.warn('[KORE] generate() called while already loading, ignoring')
        return s
      }
      return { ...s, isLoading: true, error: null }
    })
    
    try {
      const { dashboard } = await apiGenerate(query)
      const dashboardState = summarizeDashboard(dashboard)
      
      setState(s => {
        // Add chat_intro to chat history as an assistant message
        const newHistory = dashboard.chat_intro 
          ? addMsg(s.chatHistory, 'assistant', dashboard.chat_intro)
          : s.chatHistory
        
        persist(dashboard, dashboardState, newHistory)
        return {
          ...s,
          dashboard,
          dashboardState,
          chatHistory: newHistory,
          activeTab: dashboard.tabs[0]?.id ?? '',
          isLoading: false,
          error: null,
        }
      })
    } catch (err) {
      setState(s => ({
        ...s, isLoading: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      }))
    }
  }, [])

  // ── Temporary Tabs ───────────────────────────────────────────────────────

  const addTemporaryTab = useCallback((tab: { id: string; label: string; isTemporary: true }, modules: Module[]) => {
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

  // ── Send Chat ────────────────────────────────────────────────────────────

  const sendChat = useCallback(async (userMessage: string) => {
    // 1. Capture current state snapshot via setState functional form, add user msg
    let snapshot: KoreState = INITIAL
    await new Promise<void>(resolve => {
      setState(s => {
        snapshot = { ...s, chatHistory: addMsg(s.chatHistory, 'user', userMessage) }
        resolve()
        return { ...snapshot, isChatLoading: true }
      })
    })

    if (!snapshot.dashboardState) {
      setState(s => ({ ...s, isChatLoading: false }))
      return
    }

    const { dashboardState, activeTab } = snapshot
    const activeTabData  = dashboardState.tabs.find(t => t.id === activeTab)
    const visibleModules = activeTabData?.modules ?? []

    const payload: ChatPayload = {
      message: userMessage,
      history: snapshot.chatHistory.slice(-14), // last 7 turns
      context: {
        subject:         dashboardState.subject,
        active_tab:      activeTab,
        visible_modules: visibleModules,
      },
    }

    try {
      const result = await sendChatMessage(payload)

      // Handle TEMPORARY_TAB action
      if (result.action === 'TEMPORARY_TAB' && result.tab && result.modules) {
        // Use the comprehensive analysis message from Gemini, not a hardcoded notification
        const msg = result.message ?? `Created temporary tab: "${result.tab.label}"`
        setState(s => {
          const history = addMsg(s.chatHistory, 'assistant', msg)
          persist(s.dashboard!, s.dashboardState!, history)
          return { ...s, chatHistory: history, isChatLoading: false }
        })
        // Add the temporary tab
        addTemporaryTab(result.tab, result.modules)
        return
      }

      // Handle NEW_DASHBOARD outside of setState to avoid multiple calls
      if (result.action === 'NEW_DASHBOARD' && result.new_prompt) {
        const reloadMsg = `Generating new dashboard for: "${result.new_prompt}"…`
        setState(s => {
          const reloadHist = addMsg(s.chatHistory, 'assistant', reloadMsg)
          persist(s.dashboard!, s.dashboardState!, reloadHist)
          return { ...s, chatHistory: reloadHist, isChatLoading: false, isLoading: true }
        })
        // Call generate AFTER setState completes, outside the setState callback
        generate(result.new_prompt)
        return
      }

      // Handle CHAT action
      setState(s => {
        const history = addMsg(s.chatHistory, 'assistant', result.message ?? '')
        persist(s.dashboard!, s.dashboardState!, history)
        return { ...s, chatHistory: history, isChatLoading: false }
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Chat error'
      setState(s => ({
        ...s,
        chatHistory: addMsg(s.chatHistory, 'assistant', `⚠️ ${msg}`),
        isChatLoading: false,
      }))
    }
  }, [generate, addTemporaryTab])

  // ── Tab ──────────────────────────────────────────────────────────────────

  const setActiveTab = useCallback((tabId: string) => {
    setState(s => ({ ...s, activeTab: tabId }))
  }, [])

  // ── Clear ────────────────────────────────────────────────────────────────

  const clearDashboard = useCallback(() => {
    localStorage.removeItem(LS_DASHBOARD)
    localStorage.removeItem(LS_STATE)
    localStorage.removeItem(LS_HISTORY)
    setState(INITIAL)
  }, [])

  return {
    dashboard:      state.dashboard,
    dashboardState: state.dashboardState,
    chatHistory:    state.chatHistory,
    activeTab:      state.activeTab,
    isLoading:      state.isLoading,
    isChatLoading:  state.isChatLoading,
    error:          state.error,
    generate,
    sendChat,
    setActiveTab,
    clearDashboard,
    addTemporaryTab,
    removeTemporaryTab,
    // Legacy aliases — keep page.tsx working without changes
    payload:  state.dashboard,
    loading:  state.isLoading,
    submit:   generate,
  }
}
