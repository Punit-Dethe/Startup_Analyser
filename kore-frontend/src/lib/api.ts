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
    // Get settings from localStorage
    const apiKey = typeof window !== 'undefined' 
      ? localStorage.getItem('currentGeminiApiKey') 
      : null
    const model = typeof window !== 'undefined'
      ? localStorage.getItem('selectedGeminiModel')
      : null
    const temperature = typeof window !== 'undefined'
      ? localStorage.getItem('selectedTemperature')
      : null
    const mode = typeof window !== 'undefined'
      ? localStorage.getItem('analysisMode') || 'company'
      : 'company'

    // Debug logging
    if (apiKey) {
      console.log('[KORE] Using custom API key:', apiKey.substring(0, 20) + '...')
    } else {
      console.log('[KORE] No custom API key selected, using backend default')
    }
    if (model) {
      console.log('[KORE] Using model:', model)
    }
    if (temperature) {
      console.log('[KORE] Using temperature:', temperature)
    }
    console.log('[KORE] Using analysis mode:', mode)

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(apiKey ? { 'X-Gemini-API-Key': apiKey } : {}),
        ...(model ? { 'X-Gemini-Model': model } : {}),
        ...(temperature ? { 'X-Gemini-Temperature': temperature } : {}),
        'X-Analysis-Mode': mode,
      },
      body: JSON.stringify({ query }),
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
  // Get settings from localStorage
  const apiKey = typeof window !== 'undefined' 
    ? localStorage.getItem('currentGeminiApiKey') 
    : null
  const model = typeof window !== 'undefined'
    ? localStorage.getItem('selectedGeminiModel')
    : null
  const temperature = typeof window !== 'undefined'
    ? localStorage.getItem('selectedTemperature')
    : null

  // Debug logging
  if (apiKey) {
    console.log('[KORE] Using custom API key:', apiKey.substring(0, 20) + '...')
  } else {
    console.log('[KORE] No custom API key selected, using backend default')
  }
  if (model) {
    console.log('[KORE] Using model:', model)
  }
  if (temperature) {
    console.log('[KORE] Using temperature:', temperature)
  }

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...(apiKey ? { 'X-Gemini-API-Key': apiKey } : {}),
      ...(model ? { 'X-Gemini-Model': model } : {}),
      ...(temperature ? { 'X-Gemini-Temperature': temperature } : {}),
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) throw new Error(`/api/chat returned ${res.status}`)
  return res.json() as Promise<ChatResponse>
}
