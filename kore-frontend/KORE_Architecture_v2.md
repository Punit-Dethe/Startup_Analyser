# KORE Dashboard — Architecture & Build Plan
### Revised System Design | March 2026

---

## Table of Contents

1. [What We Have Now](#1-what-we-have-now)
2. [What We Are Building](#2-what-we-are-building)
3. [The Full Architecture](#3-the-full-architecture)
4. [Generation Pipeline (n8n)](#4-generation-pipeline-n8n)
5. [Chat Pipeline (n8n)](#5-chat-pipeline-n8n)
6. [Dashboard State & Storage](#6-dashboard-state--storage)
7. [The Dashboard Summarizer](#7-the-dashboard-summarizer)
8. [AI Prompts — Complete Text](#8-ai-prompts--complete-text)
9. [Frontend Architecture](#9-frontend-architecture)
10. [JSON Schema Reference](#10-json-schema-reference)
11. [Build Order](#11-build-order)

---

## 1. What We Have Now

The current n8n workflow has three nodes:

```
Webhook (POST) → Message a Model (Gemini) → Code in JavaScript
```

- The Gemini node receives the raw user prompt
- The system prompt contains the full KORE Master Generation Prompt
- The Gemini output is the raw dashboard JSON string
- The Code node currently does basic cleanup and passes it to the frontend
- The frontend renders modules from the JSON — no HTML generation, pure JSON-driven React components
- There is no chat system yet
- There is no live data fetching yet

---

## 2. What We Are Building

### Summary of Changes

| Area | Current State | Target State |
|------|--------------|--------------|
| Data collection | None — Gemini uses training data only | Gemini Data Collector node with Google Search grounding |
| Dashboard generation | 1 Gemini node (data + generation combined) | 2 Gemini nodes: Collector → Orchestrator |
| Schema validation | Basic code cleanup | Full schema check + structural validation |
| Dashboard state | Not saved | Saved in frontend (localStorage + React state) |
| Chat system | Does not exist | New `/chat` webhook — 3-node pipeline |
| Chat context | N/A | Compact dashboard summary sent with every message |
| Chat actions | N/A | CHAT / REFRESH / RELOAD — handled by frontend |

### What We Are NOT Building (Deliberately Removed)

- ❌ Dedicated web scraper nodes (Crawl4AI, Firecrawl)
- ❌ Tavily API calls
- ❌ yFinance nodes
- ❌ Classifier Gemini node
- ❌ Separate finance/market/news fetcher nodes
- ❌ Chat classifier/router Gemini node
- ❌ n8n session/state storage
- ❌ HTML generation layer (we stay JSON-driven)

Everything is replaced by **Google Search grounding** built into Gemini's API. One research call. No extra services. No extra costs.

---

## 3. The Full Architecture

### Two Separate n8n Workflows

```
WORKFLOW 1: /generate  (Dashboard Generation)
─────────────────────────────────────────────
POST { query: "Analyse Apple Inc" }
    │
    ▼
[Node 1] Webhook Trigger
    │
    ▼
[Node 2] Gemini: Data Collector
         - Google Search grounding ON
         - Researches the subject extensively
         - Outputs: raw research brief (text)
    │
    ▼
[Node 3] Gemini: Orchestrator
         - Google Search grounding OFF
         - Receives research brief
         - Applies KORE Master Generation Prompt
         - Outputs: raw dashboard JSON string
    │
    ▼
[Node 4] Code: Validate + Save State
         - Strips markdown fences
         - Parses JSON
         - Checks required keys (meta, tabs, modules)
         - Builds compact dashboard_state summary
         - Returns { dashboard, dashboard_state, generated_at }
    │
    ▼
Response → Frontend


WORKFLOW 2: /chat  (Chat Follow-Up)
────────────────────────────────────
POST { message, history[], context: { subject, active_tab, visible_modules[] } }
    │
    ▼
[Node 1] Webhook Trigger
    │
    ▼
[Node 2] Gemini: Chat Node
         - Google Search grounding ON (for live lookups when needed)
         - Receives message + history + dashboard context
         - Decides action: CHAT / REFRESH / RELOAD
         - Outputs: raw action JSON string
    │
    ▼
[Node 3] Code: Parse + Return
         - Strips markdown fences
         - Parses JSON
         - Returns action object to frontend
    │
    ▼
Response → Frontend
```

### Total Node Count

| Workflow | Nodes | Purpose |
|----------|-------|---------|
| /generate | 4 | Data collection + dashboard generation |
| /chat | 3 | Conversational follow-up |
| **Total** | **7** | Entire backend |

---

## 4. Generation Pipeline (n8n)

### Node 1 — Webhook Trigger

- **Type:** Webhook
- **Method:** POST
- **Path:** `generate`
- **Response Mode:** When last node finishes

Frontend sends:
```json
{ "query": "Analyse Apple Inc" }
```

Expression to access it downstream: `{{ $json.body.query }}`

---

### Node 2 — Gemini: Data Collector

- **Type:** Google Gemini Chat Model (or HTTP Request to Gemini API directly)
- **Model:** `gemini-2.0-flash` or `gemini-2.5-flash`
- **Google Search Grounding:** ON
  - In the API call body: `"tools": [{"google_search": {}}]`

**System Prompt:**
```
You are an elite financial and market intelligence researcher.
Your job is to gather comprehensive, factual, up-to-date data on the given subject.

Research ALL of the following areas exhaustively using Google Search:

1. COMPANY OVERVIEW
   - Full legal name, founding year, headquarters, CEO, employee count
   - Core products and services, business model, revenue streams
   - Key milestones and recent strategic moves

2. FINANCIALS
   - Revenue by year (last 5 years minimum), gross margin, operating margin, net margin
   - EBITDA, free cash flow, total assets, total debt
   - Funding history (for private) OR market cap, P/E ratio, stock performance (for public)
   - Latest quarterly results

3. MARKET POSITION
   - Total Addressable Market (TAM), Serviceable Addressable Market (SAM)
   - Market share, growth rate of the industry
   - Geographic presence and key markets

4. COMPETITORS
   - Top 5 direct competitors with their key metrics
   - Competitive advantages and weaknesses vs subject

5. RECENT DEVELOPMENTS
   - Last 6 months of significant news, product launches, partnerships, controversies
   - Leadership changes, regulatory actions, major wins or losses

Search aggressively. Cross-reference multiple sources.
Output a dense, structured research brief in plain text.
Label every section clearly (OVERVIEW, FINANCIALS, MARKET, COMPETITORS, NEWS).
For every number you find, include the source and year.
If data is unavailable, write "NOT PUBLICLY AVAILABLE" — never invent numbers.
```

**User Message:** `{{ $json.body.query }}`

---

### Node 3 — Gemini: Orchestrator

- **Type:** Google Gemini Chat Model
- **Model:** `gemini-2.0-flash` or `gemini-2.5-flash`
- **Google Search Grounding:** OFF (pure synthesis, no browsing)

**System Prompt:** *(The complete KORE Master Generation Prompt — paste in full)*

The Master Generation Prompt includes:
- The 5x5 grid geometry rules and 5 certified layout templates
- All module type definitions and TypeScript interfaces
- Accent assignment rules
- The chat_intro formatting engine rules
- CRITICAL RULE: zero markdown wrapper, raw JSON only

**User Message:**
```
RESEARCH BRIEF FROM DATA COLLECTOR:
{{ $('Gemini Data Collector').item.json.candidates[0].content.parts[0].text }}

---

Generate the complete KORE dashboard JSON for the subject identified in the research above.
Apply the full schema. Output raw JSON only. Start with { and end with }.
```

> **Note on accessing the previous node's output:** The exact expression path depends on how n8n returns Gemini responses. Test with `{{ $json }}` in an expression to inspect the actual structure, then adjust the path.

---

### Node 4 — Code: Validate + Save State

- **Type:** Code (JavaScript)

```javascript
const raw = $input.first().json.candidates?.[0]?.content?.parts?.[0]?.text
         || $input.first().json.output
         || $input.first().json.text
         || $input.first().json.response;

if (!raw) throw new Error("No text output from Orchestrator node");

// 1. Strip markdown fences Gemini sometimes adds
const cleaned = raw
  .replace(/^```json\s*/i, '')
  .replace(/^```\s*/i, '')
  .replace(/```$/i, '')
  .trim();

// 2. Parse JSON
let dashboard;
try {
  dashboard = JSON.parse(cleaned);
} catch (e) {
  throw new Error("JSON parse failed: " + e.message + "\n\nFirst 500 chars: " + cleaned.slice(0, 500));
}

// 3. Validate required top-level keys
const required = ['meta', 'tabs', 'modules'];
for (const key of required) {
  if (!dashboard[key]) throw new Error("Missing required key: " + key);
}

// 4. Validate module count matches grid (basic sanity check)
if (!Array.isArray(dashboard.modules) || dashboard.modules.length === 0) {
  throw new Error("modules array is empty or missing");
}

// 5. Build compact dashboard_state for chat context
const dashboard_state = {
  subject: dashboard.meta.subject,
  mode: dashboard.meta.mode,
  tabs: dashboard.tabs.map(t => t.id),
  modules: dashboard.modules.map(m => ({
    id: m.id,
    tab: m.tab,
    type: m.type,
    size: m.size,
    title: m.data?.title ?? null,
    value: m.data?.value
        ?? m.data?.metrics?.[0]?.value
        ?? m.data?.kpis?.[0]?.value
        ?? (m.data?.series ? `series[${m.data.series.length}pts]` : null)
        ?? (m.data?.rows ? `table[${m.data.rows.length}rows]` : null)
        ?? null
  }))
};

return [{
  json: {
    dashboard,           // Full payload → sent to frontend
    dashboard_state,     // Compact summary → saved for chat
    generated_at: new Date().toISOString()
  }
}];
```

---

## 5. Chat Pipeline (n8n)

### Node 1 — Webhook Trigger

- **Type:** Webhook
- **Method:** POST
- **Path:** `chat`

Frontend sends:
```json
{
  "message": "What drove the revenue spike in Q3?",
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ],
  "context": {
    "subject": "Apple Inc.",
    "active_tab": "financials",
    "visible_modules": [
      { "id": "fin-1", "type": "chart.area", "size": "4x2", "title": "Revenue Growth", "value": "$394B" },
      { "id": "fin-2", "type": "metric.kpi", "size": "1x1", "title": "Net Margin", "value": "25.3%" }
    ]
  }
}
```

---

### Node 2 — Gemini: Chat Node

- **Type:** Google Gemini Chat Model
- **Model:** `gemini-2.0-flash`
- **Google Search Grounding:** ON

**System Prompt:**
```
You are the KORE AI analyst — a senior business intelligence expert embedded inside
a live dashboard. You are not a generic chatbot. You are direct, precise, and analytical.

A dashboard is currently loaded. Your context:
Subject: {{ $json.body.context.subject }}
Active tab: {{ $json.body.context.active_tab }}
Visible modules on this tab:
{{ JSON.stringify($json.body.context.visible_modules, null, 2) }}

You have THREE response actions available:

ACTION: CHAT
  Use when: The question can be answered analytically from existing data,
  or requires a conversational explanation.
  No dashboard changes needed.

ACTION: REFRESH
  Use when: The user wants specific module data updated with newer/different numbers.
  You must return the updated module objects in full (same schema as the original).
  Only update the modules that actually need to change.

ACTION: RELOAD
  Use when: The user asks about a completely different subject, wants a different
  type of analysis, or the current dashboard is fundamentally the wrong context.
  Provide a new_prompt that will be sent to /generate.

DECISION GUIDE:
- "What does this chart mean?" → CHAT
- "Can you explain the revenue trend?" → CHAT
- "Update the margin data to 2025" → REFRESH
- "Add a chart showing EBITDA" → REFRESH
- "Now analyse Microsoft instead" → RELOAD
- "Show me the startup version of this" → RELOAD

Use Google Search if you need live data to answer accurately.

ALWAYS respond in this EXACT raw JSON format. No markdown. No explanation:
{
  "action": "CHAT",
  "message": "Your analytical response here",
  "modules": [],
  "new_prompt": null
}

For REFRESH, populate modules[] with full updated module objects.
For RELOAD, set new_prompt to the full query string.
For CHAT, message is your response. modules and new_prompt are null/empty.
```

**User Message (built from history + current message):**
```
{{ JSON.stringify($json.body.history) }}

Current question: {{ $json.body.message }}
```

---

### Node 3 — Code: Parse + Return

- **Type:** Code (JavaScript)

```javascript
const raw = $input.first().json.candidates?.[0]?.content?.parts?.[0]?.text
         || $input.first().json.output
         || $input.first().json.text;

if (!raw) throw new Error("No output from Chat node");

const cleaned = raw
  .replace(/^```json\s*/i, '')
  .replace(/^```\s*/i, '')
  .replace(/```$/i, '')
  .trim();

let result;
try {
  result = JSON.parse(cleaned);
} catch(e) {
  // Fallback: treat the raw output as a CHAT response
  result = {
    action: "CHAT",
    message: raw,
    modules: [],
    new_prompt: null
  };
}

return [{ json: result }];
```

---

## 6. Dashboard State & Storage

### Where State Lives

State is stored **entirely on the frontend**. n8n is completely stateless. Nothing is stored in n8n nodes, databases, or external services.

```
Frontend Storage
├── React State (in-memory, current session)
│   ├── dashboard          ← Full dashboard JSON from /generate response
│   ├── dashboard_state    ← Compact summary built by summarizeDashboard()
│   └── chatHistory[]      ← Array of { role, content } message objects
│
└── localStorage (persists across page refreshes)
    ├── "kore_dashboard"       ← Full dashboard JSON (stringified)
    ├── "kore_state"           ← Compact state JSON (stringified)
    └── "kore_history"         ← Last 20 chat messages (stringified)
```

### Saving State (Frontend Code)

```typescript
// After /generate returns successfully:
function saveDashboard(payload: DashboardPayload) {
  // Build compact state
  const state = summarizeDashboard(payload.dashboard);

  // Save to React state
  setDashboard(payload.dashboard);
  setDashboardState(state);

  // Persist to localStorage
  localStorage.setItem('kore_dashboard', JSON.stringify(payload.dashboard));
  localStorage.setItem('kore_state', JSON.stringify(state));
}

// On page load — restore from localStorage:
function restoreDashboard() {
  const saved = localStorage.getItem('kore_dashboard');
  if (saved) {
    const dashboard = JSON.parse(saved);
    setDashboard(dashboard);
    setDashboardState(summarizeDashboard(dashboard));
  }
}
```

### What Gets Sent to /chat

The frontend builds the request payload before each chat POST:

```typescript
async function sendChatMessage(userMessage: string) {
  // Add user message to history
  const updatedHistory = [...chatHistory, { role: 'user', content: userMessage }];

  // Build context — only visible modules on current tab
  const visibleModules = dashboardState.modules
    .filter(m => m.tab === activeTab)
    .map(m => ({ id: m.id, type: m.type, size: m.size, title: m.title, value: m.value }));

  const payload = {
    message: userMessage,
    history: updatedHistory.slice(-14), // Last 14 messages (7 turns)
    context: {
      subject: dashboardState.subject,
      active_tab: activeTab,
      visible_modules: visibleModules
    }
  };

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const result = await response.json();

  // Handle the three actions
  if (result.action === 'CHAT') {
    addMessageToHistory('assistant', result.message);
  }

  if (result.action === 'REFRESH') {
    patchModules(result.modules); // Swap updated modules in dashboard
    addMessageToHistory('assistant', result.message);
  }

  if (result.action === 'RELOAD') {
    triggerGenerate(result.new_prompt); // Call /generate again
    addMessageToHistory('assistant', `Reloading dashboard for: ${result.new_prompt}`);
  }
}
```

---

## 7. The Dashboard Summarizer

This is a pure JavaScript function that runs on the frontend. It takes the full dashboard JSON and produces the compact `dashboard_state` object used in chat context. No AI, no API, no cost.

```javascript
function summarizeDashboard(dashboard) {
  const { meta, tabs, modules } = dashboard;

  // Group modules by tab
  const byTab = {};
  for (const tab of tabs) {
    byTab[tab.id] = { label: tab.label, modules: [] };
  }

  for (const mod of modules) {
    const entry = {
      id: mod.id,
      type: mod.type,
      size: mod.size,
      title: mod.data?.title ?? null,
      accent: mod.accent,
    };

    // Pull the single most meaningful value per module type
    if (mod.data?.value !== undefined)
      entry.value = mod.data.value;
    else if (mod.data?.kpis)
      entry.value = mod.data.kpis.map(k => `${k.title}:${k.value}`).join(', ');
    else if (mod.data?.segments)
      entry.value = mod.data.segments.map(s => `${s.label}:${s.value}`).join(', ');
    else if (mod.data?.metrics)
      entry.value = mod.data.metrics.map(m => `${m.label}:${m.value}`).join(', ');
    else if (mod.data?.series)
      entry.value = `series[${mod.data.series.length}pts]`;
    else if (mod.data?.rows)
      entry.value = `table[${mod.data.rows.length}rows]`;

    byTab[mod.tab]?.modules.push(entry);
  }

  return {
    subject: meta.subject,
    mode: meta.mode,
    tabs: Object.entries(byTab).map(([id, t]) => ({
      id,
      label: t.label,
      module_count: t.modules.length,
      modules: t.modules
    }))
  };
}
```

### Example Output (~2KB)

```json
{
  "subject": "Apple Inc.",
  "mode": "company",
  "tabs": [
    {
      "id": "overview",
      "label": "Overview",
      "module_count": 5,
      "modules": [
        { "id": "ov-1", "type": "metric.kpi",  "size": "1x1", "title": "Revenue",       "value": "$394B" },
        { "id": "ov-2", "type": "chart.area",  "size": "4x2", "title": "Revenue Trend", "value": "series[6pts]" },
        { "id": "ov-3", "type": "deco.stats",  "size": "5x1", "title": "Key Stats",     "value": "Founded:1976, Employees:161K" },
        { "id": "ov-4", "type": "feed.news",   "size": "3x2", "title": "Latest News",   "value": "table[5rows]" },
        { "id": "ov-5", "type": "gauge",       "size": "2x1", "title": "Market Share",  "value": 18.4 }
      ]
    },
    {
      "id": "financials",
      "label": "Financials",
      "module_count": 6,
      "modules": [
        { "id": "fin-1", "type": "chart.bar",     "size": "4x2", "title": "Quarterly Revenue",  "value": "series[8pts]" },
        { "id": "fin-2", "type": "chart.grouped", "size": "3x3", "title": "Margin Breakdown",   "value": "series[3pts]" }
      ]
    }
  ]
}
```

---

## 8. AI Prompts — Complete Text

### Data Collector System Prompt

```
You are an elite financial and market intelligence researcher.
Your job is to gather comprehensive, factual, up-to-date data on the given subject.

Research ALL of the following areas exhaustively using Google Search:

1. COMPANY OVERVIEW
   - Full legal name, founding year, headquarters, CEO, employee count
   - Core products and services, business model, revenue streams
   - Key milestones and recent strategic moves

2. FINANCIALS
   - Revenue by year (last 5 years minimum), gross margin, operating margin, net margin
   - EBITDA, free cash flow, total assets, total debt
   - Funding history (for private) OR market cap, P/E ratio, stock performance (for public)
   - Latest quarterly results

3. MARKET POSITION
   - Total Addressable Market (TAM), Serviceable Addressable Market (SAM)
   - Market share, growth rate of the industry
   - Geographic presence and key markets

4. COMPETITORS
   - Top 5 direct competitors with key metrics
   - Competitive advantages and weaknesses vs subject

5. RECENT DEVELOPMENTS
   - Last 6 months of news, product launches, partnerships, controversies
   - Leadership changes, regulatory actions, major wins or losses

Search aggressively. Cross-reference multiple sources.
Output a dense, structured research brief in plain text.
Label every section clearly: OVERVIEW, FINANCIALS, MARKET, COMPETITORS, NEWS.
For every number, include the source year.
If data is unavailable, write "NOT PUBLICLY AVAILABLE" — never invent numbers.
```

---

### Orchestrator System Prompt

*(Paste the full KORE Master Generation Prompt here — the one you already have,
starting with "You are the absolute core intelligence engine...")*

The prompt already handles:
- Zero markdown wrapper rule
- 5x5 grid geometry + 5 certified layout templates
- All module type definitions and TypeScript interfaces
- Accent assignment
- chat_intro formatting engine

No changes needed to this prompt.

---

### Chat Node System Prompt

*(Already written in full in Section 5, Node 2 above)*

---

## 9. Frontend Architecture

### React State Shape

```typescript
// The three pieces of state that drive everything
const [dashboard, setDashboard] = useState<DashboardPayload | null>(null);
const [dashboardState, setDashboardState] = useState<CompactState | null>(null);
const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
const [activeTab, setActiveTab] = useState<string>('overview');
const [isLoading, setIsLoading] = useState<boolean>(false);
```

### Handling the Three Chat Actions

```typescript
function handleChatResponse(result: ChatResponse) {
  switch (result.action) {

    case 'CHAT':
      // Append message to chat panel. No dashboard change.
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: result.message
      }]);
      break;

    case 'REFRESH':
      // Patch specific modules in the full dashboard JSON
      // Re-run summarizeDashboard to update compact state
      setDashboard(prev => {
        if (!prev) return prev;
        const updatedModules = prev.modules.map(existing => {
          const updated = result.modules.find(m => m.id === existing.id);
          return updated ?? existing;
        });
        const patched = { ...prev, modules: updatedModules };
        setDashboardState(summarizeDashboard(patched));
        return patched;
      });
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: result.message
      }]);
      break;

    case 'RELOAD':
      // Re-trigger the full /generate pipeline with new prompt
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: `Generating new dashboard for: "${result.new_prompt}"...`
      }]);
      generateDashboard(result.new_prompt);
      break;
  }
}
```

### API Layer (Next.js Route Handlers)

Proxy calls through Next.js API routes so the n8n URL stays server-side:

```typescript
// app/api/generate/route.ts
export async function POST(req: Request) {
  const body = await req.json();
  const res = await fetch(process.env.N8N_GENERATE_WEBHOOK!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  return Response.json(data);
}

// app/api/chat/route.ts
export async function POST(req: Request) {
  const body = await req.json();
  const res = await fetch(process.env.N8N_CHAT_WEBHOOK!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  return Response.json(data);
}
```

### Environment Variables

```bash
# .env.local
N8N_GENERATE_WEBHOOK=http://localhost:5678/webhook/generate
N8N_CHAT_WEBHOOK=http://localhost:5678/webhook/chat
```

---

## 10. JSON Schema Reference

### Dashboard Generation Response

```json
{
  "dashboard": {
    "meta": {
      "subject": "Apple Inc.",
      "mode": "company",
      "brand_color": "#555555",
      "colors": {
        "primary": "#111111",
        "secondary": "#333333",
        "tertiary": "#555555",
        "quaternary": "#888888"
      },
      "logo_initials": "AP",
      "page_title": "Apple Intelligence Dashboard",
      "page_subtitle": "Business & Financial Analysis"
    },
    "tabs": [
      { "id": "overview",    "label": "Overview" },
      { "id": "financials",  "label": "Financials" },
      { "id": "market",      "label": "Market" },
      { "id": "biz_model",   "label": "Business Model" },
      { "id": "competitors", "label": "Competitors" }
    ],
    "chat_intro": "# Apple Inc. — Executive Brief\n\n...",
    "modules": [
      {
        "id": "ov-1",
        "tab": "overview",
        "type": "metric.kpi",
        "size": "1x1",
        "accent": "primary",
        "data": {
          "title": "Annual Revenue",
          "value": "$394B",
          "delta": "+2.0%",
          "direction": "up",
          "sparkline": [274, 365, 394, 383, 394]
        }
      }
    ]
  },
  "dashboard_state": { ... },
  "generated_at": "2026-03-23T15:30:00.000Z"
}
```

### Chat Response Shape

```json
{
  "action": "CHAT",
  "message": "The revenue spike in Q3 2024 was driven primarily by iPhone 15 Pro cycle...",
  "modules": [],
  "new_prompt": null
}
```

```json
{
  "action": "REFRESH",
  "message": "Updated the revenue chart with 2025 data.",
  "modules": [
    {
      "id": "fin-1",
      "tab": "financials",
      "type": "chart.area",
      "size": "4x2",
      "accent": "primary",
      "data": {
        "title": "Revenue Growth",
        "labels": ["FY20","FY21","FY22","FY23","FY24","FY25"],
        "series": [274, 365, 394, 383, 394, 411]
      }
    }
  ],
  "new_prompt": null
}
```

```json
{
  "action": "RELOAD",
  "message": null,
  "modules": [],
  "new_prompt": "Analyse Microsoft Corporation"
}
```

---

## 11. Build Order

### Phase 1 — Dashboard Generation Works End-to-End

**Goal:** Type a query, get a rendered dashboard. No chat yet.

1. [ ] Set up n8n locally — `npx n8n`
2. [ ] Create Workflow 1 (`/generate`) with all 4 nodes
3. [ ] Add Gemini API credentials in n8n
4. [ ] Test Node 2 (Data Collector) alone — verify research output quality
5. [ ] Test Node 3 (Orchestrator) alone — paste research manually, check JSON output
6. [ ] Test full pipeline end-to-end — verify valid JSON comes back
7. [ ] Wire Next.js frontend to `/generate` webhook
8. [ ] Verify modules render correctly from the returned JSON

**Done when:** Typing "Analyse Zomato" produces a fully rendered KORE dashboard.

---

### Phase 2 — Chat System Works

**Goal:** Ask follow-up questions about a loaded dashboard.

1. [ ] Create Workflow 2 (`/chat`) with 3 nodes
2. [ ] Test chat node in isolation — send a dummy context, verify action JSON returns
3. [ ] Build `summarizeDashboard()` utility function in frontend
4. [ ] Wire chat input in the frontend to `/api/chat`
5. [ ] Implement `handleChatResponse()` — all three action branches
6. [ ] Test CHAT action — ask a question, verify answer appears in chat panel
7. [ ] Test REFRESH action — ask "update the revenue chart", verify module swaps
8. [ ] Test RELOAD action — ask "now analyse Microsoft", verify new dashboard generates

**Done when:** Full chat loop works — follow-up questions, module refreshes, dashboard reloads.

---

### Phase 3 — Polish & Edge Cases

1. [ ] Loading states — "Fetching live data..." → "Building dashboard..." progress text
2. [ ] Error handling — what happens if Gemini returns malformed JSON (auto-retry?)
3. [ ] localStorage restore — reload the page, dashboard still shows
4. [ ] Chat history restore — reload the page, conversation history still shows
5. [ ] Handle private companies (no stock data) gracefully in research prompt
6. [ ] Handle ambiguous queries ("Tell me about food delivery") — Orchestrator picks subject
7. [ ] Mobile layout adjustments if needed

---

## Quick Start

```bash
# 1. Start n8n
npx n8n
# Open http://localhost:5678
# Build Workflow 1 and Workflow 2 as documented above
# Add Gemini API key in Settings → Credentials
# Activate both workflows

# 2. Set up frontend env
echo "N8N_GENERATE_WEBHOOK=http://localhost:5678/webhook/generate" >> .env.local
echo "N8N_CHAT_WEBHOOK=http://localhost:5678/webhook/chat" >> .env.local

# 3. Start frontend
npm run dev
```

---

*KORE Dashboard — Architecture Document*
*Version: 2.0 (Simplified 2-Gemini Architecture)*
*Date: March 2026*
*Backend: 7 n8n nodes total across 2 workflows*
*AI: Gemini 2.0/2.5 Flash with Google Search grounding*
*State: Frontend-only (React state + localStorage)*
*Chat Actions: CHAT / REFRESH / RELOAD*
