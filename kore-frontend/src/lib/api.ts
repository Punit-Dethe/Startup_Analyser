import { DashboardPayload, ChatMessage, CompactState, ChatResponse, GenerateResponse } from './types'
import { DUMMY_PAYLOAD } from './dummyData'
import { summarizeDashboard } from './summarize'

// ─── Generate ─────────────────────────────────────────────────────────────────

/**
 * Calls /api/generate (Next.js proxy → backend).
 * Falls back to dummy data when the route returns an error or isn't configured.
 */
export async function generateDashboard(query: string): Promise<GenerateResponse> {
  try {
    // Get selected API key from localStorage
    const apiKey = typeof window !== 'undefined' 
      ? localStorage.getItem('currentGeminiApiKey') 
      : null

    // Debug logging
    if (apiKey) {
      console.log('[KORE] Using custom API key:', apiKey.substring(0, 20) + '...')
    } else {
      console.log('[KORE] No custom API key selected, using backend default')
    }

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(apiKey ? { 'X-Gemini-API-Key': apiKey } : {}),
      },
      body: JSON.stringify({ query, apiKey }),
    })

    if (!res.ok) throw new Error(`/api/generate returned ${res.status}`)

    const data = await res.json()

    // v2 shape: { dashboard, dashboard_state, generated_at }
    if (data?.dashboard) return data as GenerateResponse

    // Backwards compat: if n8n returns flat DashboardPayload, wrap it
    const dashboard = data as DashboardPayload
    return {
      dashboard,
      dashboard_state: summarizeDashboard(dashboard),
      generated_at: new Date().toISOString(),
    }
  } catch (err) {
    console.warn('[KORE] /api/generate failed, using dummy data:', err)
    return new Promise(resolve =>
      setTimeout(() => resolve({
        dashboard: DUMMY_PAYLOAD,
        dashboard_state: summarizeDashboard(DUMMY_PAYLOAD),
        generated_at: new Date().toISOString(),
      }), 1200)
    )
  }
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

export interface ChatPayload {
  message: string
  history: ChatMessage[]
  context: {
    subject: string
    active_tab: string
    visible_modules: CompactState['tabs'][0]['modules']
  }
}

/**
 * Calls /api/chat (Next.js proxy → backend).
 * Returns a CHAT / REFRESH / RELOAD action object.
 */
export async function sendChatMessage(payload: ChatPayload): Promise<ChatResponse> {
  // Get selected API key from localStorage
  const apiKey = typeof window !== 'undefined' 
    ? localStorage.getItem('currentGeminiApiKey') 
    : null

  // Debug logging
  if (apiKey) {
    console.log('[KORE] Using custom API key:', apiKey.substring(0, 20) + '...')
  } else {
    console.log('[KORE] No custom API key selected, using backend default')
  }

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...(apiKey ? { 'X-Gemini-API-Key': apiKey } : {}),
    },
    body: JSON.stringify({ ...payload, apiKey }),
  })

  if (!res.ok) throw new Error(`/api/chat returned ${res.status}`)
  return res.json() as Promise<ChatResponse>
}
