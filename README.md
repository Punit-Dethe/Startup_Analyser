<div align="center">

<img src="kore-frontend/public/tplogo.png" alt="KORE Dashboard" width="280"/>

### AI-Powered Business Intelligence, Instantaneously.

**Type a company name. Get a full analyst-grade dashboard in seconds.**  
Powered by Gemini & Groq · Built on Next.js 16 + FastAPI · Deployed on Vercel + Railway

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Gemini](https://img.shields.io/badge/Gemini-2.5Flash-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Groq](https://img.shields.io/badge/Groq-LLaMA--3.3--70B-FF6B35?style=for-the-badge)](https://groq.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

</div>

---

## 🧠 What is KORE?

**KORE** (Knowledge-Oriented Research Engine) is a full-stack AI platform that transforms a plain-text query like `"Analyse Apple Inc."` into a richly visualised, multi-tab business intelligence dashboard — in **15–30 seconds**.

It's not a report generator. It's a **live analytical workspace** where you can:
- Explore AI-generated dashboards across multiple thematic tabs
- Chat with the AI directly about what you see
- Ask it to **refresh specific modules**, **create temporary analysis tabs**, or **reload for a different subject** — all from a single chat input

> *"Business intelligence at the speed of thought."*

---

## ✨ Features at a Glance

| Feature | Description |
|---|---|
| 🏢 **Company Analysis** | Full financial, market, competitor, and business model breakdowns |
| 🚀 **Startup Analysis** | Lean Canvas, TAM/SAM/SOM, SWOT, GTM strategy, competitive matrix |
| 💬 **AI Chat** | Three-action chat system: `CHAT`, `TEMPORARY_TAB`, `NEW_DASHBOARD` |
| 📊 **13 Module Types** | KPIs, bar/line/area/grouped charts, pie/donut, tables, feeds, stats, freeform |
| 🎨 **5×5 Grid System** | Rigid 25-cell layout engine — no gaps, no overflows, guaranteed |
| 🔄 **Multi-Provider AI** | Auto-detects Gemini (`AIzaSy…`) or Groq (`gsk_…`) from your API key prefix |
| 💾 **Persistent State** | Dashboard + chat history survive page refresh via localStorage |
| ⚡ **Groq Mode** | Ultra-fast inference via LLaMA-3.3-70B for sub-10s responses |
| 🌐 **Google Search Grounding** | Live data fetched during research — no hallucinated numbers |

---

## 🏗️ Architecture

KORE is a clean two-service architecture. The frontend proxies all AI calls through a FastAPI backend, which routes to the correct AI provider based on API key type.

```
┌─────────────────────────────────────────────────────────┐
│                   Next.js 16 Frontend                    │
│  Landing Page → [Animated Load] → Dashboard View         │
│  5×5 Grid Renderer · Tab System · Chat Panel            │
│                      │                                   │
│            /api/generate   /api/chat                     │
└──────────────────────┬──────────────────────────────────┘
                       │  (proxy — keeps API keys server-side)
┌──────────────────────▼──────────────────────────────────┐
│                  FastAPI Backend                          │
│                                                          │
│  GenerateService           ChatService                   │
│       │                        │                         │
│  AIClientFactory ──────────────┘                         │
│  ┌────────────────────────────────┐                      │
│  │ key.startswith("gsk_") → Groq  │                      │
│  │ key.startswith("AIzaSy") → Gemini                     │
│  └────────────────────────────────┘                      │
└──────┬──────────────────────────┬───────────────────────┘
       │                          │
  Groq API                   Gemini API
  llama-3.3-70b-versatile    gemini-2.5-flash-preview
  (ultra-fast inference)     (Google Search grounding)
```

### Generation Pipeline

```
User Query
    ↓
[FastAPI] Load system prompt from disk (no caching)
    ↓
[AI Client] Research phase with Google Search grounding
    ↓
[AI Client] Orchestration: apply 5×5 grid + module schema
    ↓
[Validator] Check structure, module types, grid cell count
    ↓
Dashboard JSON → Frontend → Render 25 modules
```

### Chat Pipeline

```
User Message + Chat History + Visible Modules (context)
    ↓
[FastAPI ChatService] Sends to AI with dashboard context
    ↓
AI decides action:
  ├── CHAT           → Analytical response in chat panel
  ├── TEMPORARY_TAB  → New 5×5 tab injected into dashboard
  └── NEW_DASHBOARD  → Full regeneration with new subject
```

---

## 🧩 Module System

The dashboard is built on a **5×5 grid (25 cells)**. Every module occupies a `width × height` slice. Modules are rendered from a strict JSON schema.

| Type | Sizes | Use Case |
|---|---|---|
| `metric.kpi` | 1×1 | Single KPI with sparkline |
| `metric.dual` | 2×1 | Two KPIs side by side |
| `chart.bar` / `.line` / `.area` / `.hbar` | 2×2 → 4×3 | Time-series & comparisons |
| `chart.grouped` | 2×2 → 4×3 | Multi-series comparisons |
| `chart.pie` / `.donut` | 2×2 only | Market share, segmentation |
| `table` | 3×1 → 5×3 | Structured data rows |
| `feed` | 2×1 → 5×2 | News, events, lists |
| `deco.stats` | 3×1 / 4×1 / 5×1 | Decorative stat strips |
| `freeform` | 1×1 → 3×1 | Rich HTML filler |

> **Grid Rule:** Every generated tab must fill **exactly 25 cells**. The AI validates this row-by-row before output.

---

## 🛠️ Tech Stack

**Frontend**
- [Next.js 16](https://nextjs.org/) + [React 19](https://react.dev/) + TypeScript 5
- [ECharts](https://echarts.apache.org/) for complex data visualisations
- [Three.js](https://threejs.org/) + [OGL](https://github.com/oframe/ogl) for landing page animations
- [React Flow](https://reactflow.dev/) for node-based layouts
- [React Markdown](https://github.com/remarkjs/react-markdown) + `rehype-raw` for rich chat formatting
- Tailwind CSS 4

**Backend**
- [FastAPI](https://fastapi.tiangolo.com/) + Python 3.9+
- [Google Generative AI SDK](https://ai.google.dev/) (Gemini 2.5 Flash / gemini-3-flash-preview)
- [Groq SDK](https://groq.com/) (LLaMA-3.3-70B-Versatile)
- Async/await, retry logic with exponential backoff
- Prompt-from-disk architecture (no prompt caching — always fresh)

**AI & Orchestration**
- **Research Phase:** Gemini with Google Search grounding (live data, no hallucinations)
- **Orchestration Phase:** Structured JSON output with strict schema validation
- **Chat Phase:** Context-aware with compact `dashboard_state` summary per request

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- A [Gemini API Key](https://ai.google.dev/) (`AIzaSy…`) or [Groq API Key](https://console.groq.com/) (`gsk_…`)

### 1. Clone

```bash
git clone https://github.com/your-username/Startup_Analyser.git
cd Startup_Analyser
```

### 2. Backend Setup

```bash
cd fastapi-backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and set: GEMINI_API_KEY=AIzaSy... or gsk_...

# Run the server
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd kore-frontend

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local:
#   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Run the dev server
npm run dev
```

### 4. Open

Navigate to [http://localhost:3000](http://localhost:3000) and type any company or startup name.

---

## ⚙️ Environment Variables

### Backend (`fastapi-backend/.env`)

```env
GEMINI_API_KEY=AIzaSy...         # Gemini key (default AI provider)
# or
GEMINI_API_KEY=gsk_...           # Groq key — auto-detected from prefix
```

### Frontend (`kore-frontend/.env.local`)

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Optional: named API key slots for the key-switcher UI
NEXT_PUBLIC_GEMINI_KEY_1=gsk_...      # TACO (Groq — ultra-fast)
NEXT_PUBLIC_GEMINI_KEY_2=AIzaSy...    # Max  (Gemini)
NEXT_PUBLIC_GEMINI_KEY_3=AIzaSy...    # Sam  (Gemini)
```

> **Key Detection:** The backend auto-detects the AI provider from the key prefix. No manual configuration needed.

---

## 📁 Project Structure

```
Startup_Analyser/
├── kore-frontend/              # Next.js 16 app
│   ├── src/
│   │   ├── app/                # Next.js App Router pages
│   │   ├── components/
│   │   │   ├── layout/         # ChatPanel, TabBar, Header
│   │   │   └── modules/        # All 13 module renderers
│   │   ├── hooks/
│   │   │   └── useDashboard.ts # Core state: generate, chat, patch
│   │   └── lib/                # Types, utilities, schema
│   ├── KORE_Architecture_v2.md # Full system design document
│   └── N8N_CHAT_SYSTEM_PROMPT.md
│
├── fastapi-backend/            # Python FastAPI service
│   ├── app/
│   │   ├── main.py             # FastAPI app entry point
│   │   ├── integrations/
│   │   │   ├── gemini_client.py
│   │   │   ├── groq_client.py
│   │   │   └── ai_factory.py   # Provider auto-detection
│   │   └── services/
│   │       ├── generate.py
│   │       └── chat.py
│   ├── prompts/
│   │   ├── generate.md         # Master generation prompt
│   │   └── chat.md             # Chat system prompt
│   └── requirements.txt
│
└── mds/                        # Reference docs & architecture notes
```

---

## 🎮 How to Use

1. **Enter a query** on the landing page — e.g. `Analyse Zomato` or `Startup: AI code review tool`
2. **Watch KORE generate** a complete multi-tab dashboard with live research data
3. **Switch tabs** — Overview, Financials, Market, Business Model, Competitors
4. **Open the chat panel** and ask anything:
   - *"Why did revenue drop in Q3?"* → AI answers with context
   - *"Compare with its top 3 competitors"* → Creates a new temporary tab
   - *"Now analyse Swiggy instead"* → Regenerates the entire dashboard
5. **Your dashboard persists** — refresh the page and it's still there

---

## 🚢 Deployment

| Platform | Component | Notes |
|---|---|---|
| **Vercel** | Frontend | `cd kore-frontend && vercel` |
| **Railway** | Backend | Uses `Procfile` or `nixpacks.toml` |
| **Render** | Backend | Uses `render.yaml` — free tier supported |
| **Docker** | Backend | `Dockerfile` included |

Set `NEXT_PUBLIC_BACKEND_URL` in Vercel to your deployed Railway/Render URL.

---

## ⚡ Performance

| Operation | Time |
|---|---|
| Dashboard generation (simple) | 15–30 seconds |
| Dashboard generation (complex) | 30–60 seconds |
| Groq mode (LLaMA-3.3-70B) | ~5–10 seconds |
| Chat response | 5–15 seconds |
| Temporary tab creation | 10–20 seconds |

---

## 🗺️ Roadmap

- [ ] PDF / PowerPoint export of dashboards
- [ ] Dashboard templates and saved presets
- [ ] Real-time collaboration (shared dashboards)
- [ ] Public API for programmatic access
- [ ] Mobile-optimised layout
- [ ] Multi-language support

---

## 🤝 Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create your branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built with Next.js · FastAPI · Google Gemini · Groq

*For questions or collaboration, open an issue.*

</div>
