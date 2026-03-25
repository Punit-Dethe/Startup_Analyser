// ─── Core Types ─────────────────────────────────────────────────────────────

export type AccentKey = 'brand' | 'green' | 'amber' | 'purple' | 'teal' | 'blue' | 'primary' | 'secondary' | 'tertiary' | 'quaternary'
export type LayoutRole = 'hero' | 'high' | 'medium' | 'low'
export type DashboardMode = 'company' | 'startup' | 'market'

export interface DashboardPayload {
  meta: DashboardMeta
  tabs: Tab[]
  chat_intro: string
  modules: Module[]
}

export interface DashboardMeta {
  subject: string
  mode: DashboardMode
  brand_color: string
  colors?: Record<string, string> // e.g. { brand: '#...', green: '#...', purple: '#...', etc. }
  logo_initials: string
  page_title: string
  page_subtitle: string
}

export interface Tab {
  id: string
  label: string
  isTemporary?: boolean  // Flag for temporary tabs (clear on page refresh)
}

export interface Module {
  id: string
  tab?: string
  type: string           // 'chart.bar', 'kpi.number', 'feed.news', etc.
  size: string           // '2x3', '1x1', '3x3', etc.
  layout_role?: LayoutRole
  accent: AccentKey
  variant?: string       // 'stats', 'timeline', 'pulse', 'gradient' for deco modules
  data: ModuleData
  html?: string          // AI-generated HTML mode
}

export interface ModuleData {
  title?: string
  subtitle?: string
  description?: string
  value?: string | number
  delta?: string
  direction?: 'up' | 'down' | 'neutral'
  sparkline?: number[]
  series?: any[]
  series2?: any[]
  labels?: string[]
  unit?: string
  footer_stats?: string[]
  columns?: TableColumn[]
  rows?: Record<string, unknown>[]
  items?: FeedItem[]
  segments?: DonutSegment[]
  cells?: BmcCell[]
  metrics?: DecoMetric[]      // for deco.stats
  kpis?: KpiMetric[]          // for metric.dual
  points?: TimelinePoint[]    // for deco.timeline
  max?: number
  label?: string
  [key: string]: unknown
}

export interface TableColumn {
  key: string
  label: string
  type?: 'text' | 'number' | 'currency' | 'delta_badge' | 'percent'
  sortable?: boolean
}

export interface FeedItem {
  headline: string
  source: string
  url?: string
  date?: string
  sentiment?: 'positive' | 'negative' | 'neutral'
  category?: string
}

export interface DonutSegment {
  label: string
  value: number
  color_key: AccentKey
}

export interface BmcCell {
  section: string
  points: string[]
}

export interface DecoMetric {
  label: string
  value: string
  delta?: string
  sub?: string
}

export interface TimelinePoint {
  year: string
  event: string
  status?: 'done' | 'active' | 'pending'
}

export interface KpiMetric {
  title: string
  value: string | number
  delta?: string
  direction?: 'up' | 'down' | 'neutral'
  sparkline?: number[]
  accent?: AccentKey
}

// ─── Chat & State Types ───────────────────────────────────────────────────────

/** Compact module summary used inside CompactState */
export interface CompactModule {
  id: string
  type: string
  size: string
  title: string | null
  accent: AccentKey
  value: string | number | null
}

/** Compact per-tab summary */
export interface CompactTab {
  id: string
  label: string
  module_count: number
  modules: CompactModule[]
}

/** Compact ~2KB snapshot of the dashboard state sent with every chat message */
export interface CompactState {
  subject: string
  mode: DashboardMode
  tabs: CompactTab[]
}

/** A single message in the chat history */
export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

/** Response envelope from the /chat n8n pipeline */
export interface ChatResponse {
  action: 'CHAT' | 'NEW_DASHBOARD' | 'TEMPORARY_TAB'
  message: string | null
  new_prompt: string | null  // Populated on NEW_DASHBOARD
  
  // For TEMPORARY_TAB action
  tab?: {
    id: string
    label: string
    isTemporary: true
  }
  modules?: Module[]  // Modules for the new temporary tab
}

/** Full payload returned by /generate (wraps DashboardPayload) */
export interface GenerateResponse {
  dashboard: DashboardPayload
  dashboard_state: CompactState
  generated_at: string
}
