<div align="center">

<img src="kore-frontend/public/tplogo.png" alt="KORE Dashboard" width="280"/>

### AI-Powered Business Intelligence, Instantaneously.

**Type a company name. Get a full analyst-grade dashboard in seconds.**  
Powered by Gemini & Groq · Built on Next.js 16 + FastAPI · Deployed on Vercel + Railway

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Gemini](https://img.shields.io/badge/Gemini-2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3_70B-FF6B35?style=for-the-badge&logo=groq&logoColor=white)](https://groq.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

</div>

---

## What is KORE?

**KORE** (Knowledge-Oriented Research Engine) is a full-stack AI platform that transforms a plain-text query like `"Analyse Apple Inc."` into a richly visualised, multi-tab business intelligence dashboard — in **15–30 seconds**.

It's not a report generator. It's a **live analytical workspace** where you can:

- Explore AI-generated dashboards across multiple thematic tabs
- Chat with the AI directly about what you see
- Ask it to **refresh specific modules**, **create temporary analysis tabs**, or **reload for a different subject** — all from a single chat input

> *"Business intelligence at the speed of thought."*

---

## Features

| | Feature | Description |
|---|---|---|
| ![company](https://img.shields.io/badge/-Company_Analysis-1a1a2e?style=flat-square&logo=building-columns&logoColor=white) | **Company Analysis** | Full financial, market, competitor, and business model breakdowns |
| ![startup](https://img.shields.io/badge/-Startup_Analysis-1a1a2e?style=flat-square&logo=rocket&logoColor=white) | **Startup Analysis** | Lean Canvas, TAM/SAM/SOM, SWOT, GTM strategy, competitive matrix |
| ![chat](https://img.shields.io/badge/-AI_Chat-1a1a2e?style=flat-square&logo=openai&logoColor=white) | **AI Chat** | Three-action system: `CHAT`, `TEMPORARY_TAB`, `NEW_DASHBOARD` |
| ![modules](https://img.shields.io/badge/-13_Module_Types-1a1a2e?style=flat-square&logo=chartdotjs&logoColor=white) | **Module Types** | KPIs, bar/line/area/grouped charts, pie/donut, tables, feeds, stats |
| ![grid](https://img.shields.io/badge/-5×5_Grid_Engine-1a1a2e?style=flat-square&logo=grid&logoColor=white) | **Grid System** | Rigid 25-cell layout — no gaps, no overflows, guaranteed |
| ![multi](https://img.shields.io/badge/-Multi_Provider_AI-1a1a2e?style=flat-square&logo=ai&logoColor=white) | **Multi-Provider AI** | Auto-detects Gemini (`AIzaSy…`) or Groq (`gsk_…`) from key prefix |
| ![persist](https://img.shields.io/badge/-Persistent_State-1a1a2e?style=flat-square&logo=databricks&logoColor=white) | **Persistent State** | Dashboard + chat history survive page refresh via localStorage |
| ![groq](https://img.shields.io/badge/-Groq_Mode-1a1a2e?style=flat-square&logo=lightning&logoColor=white) | **Groq Mode** | Ultra-fast inference via LLaMA-3.3-70B for sub-10s responses |
| ![search](https://img.shields.io/badge/-Search_Grounding-1a1a2e?style=flat-square&logo=googlesearch&logoColor=white) | **Google Search Grounding** | Live data fetched during research — no hallucinated numbers |

---

## Architecture

KORE is a clean two-service architecture. The Next.js frontend proxies all AI calls through a FastAPI backend, which routes to the correct AI provider based on API key type.

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

## Module System

The dashboard is built on a **5×5 grid (25 cells)**. Every module occupies a `width × height` slice, rendered from a strict JSON schema.

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

## Tech Stack

**Frontend**

[![Next.js](https://img.shields.io/badge/Next.js-black?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![ECharts](https://img.shields.io/badge/ECharts-AA344D?style=flat-square&logo=apache&logoColor=white)](https://echarts.apache.org/)
[![Three.js](https://img.shields.io/badge/Three.js-black?style=flat-square&logo=threedotjs)](https://threejs.org/)

- [ECharts](https://echarts.apache.org/) for data visualisations
- [Three.js](https://threejs.org/) + [OGL](https://github.com/oframe/ogl) for landing page animations
- [React Flow](https://reactflow.dev/) for node-based layouts
- [React Markdown](https://github.com/remarkjs/react-markdown) + `rehype-raw` for rich chat formatting

**Backend**

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python_3.9+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org/)
[![Gemini](https://img.shields.io/badge/Gemini_API-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)
[![Groq](https://img.shields.io/badge/Groq_API-FF6B35?style=flat-square)](https://groq.com/)

- Async/await with exponential backoff retry logic
- Prompt-from-disk architecture — no caching, always fresh

**AI & Orchestration**

- **Research Phase** — Gemini with Google Search grounding (live data, no hallucinations)
- **Orchestration Phase** — Structured JSON output with strict schema validation
- **Chat Phase** — Context-aware with compact `dashboard_state` summary per request

---

## Quick Start

**Prerequisites**

- Node.js 18+ and npm
- Python 3.9+
- A [Gemini API Key](https://ai.google.dev/) (`AIzaSy…`) or [Groq API Key](https://console.groq.com/) (`gsk_…`)

**1. Clone**

```bash
git clone https://github.com/your-username/Startup_Analyser.git
cd Startup_Analyser
```

**2. Backend Setup**

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
# Edit .env → set GEMINI_API_KEY=AIzaSy... or gsk_...

# Start server
uvicorn app.main:app --reload --port 8000
```

**3. Frontend Setup**

```bash
cd kore-frontend

npm install

cp .env.local.example .env.local
# Edit .env.local → set NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

npm run dev
```

**4. Open** → [http://localhost:3000](http://localhost:3000) and type any company or startup name.

---

## Environment Variables

**Backend** (`fastapi-backend/.env`)

```env
GEMINI_API_KEY=AIzaSy...    # Gemini (auto-detected from prefix)
# or
GEMINI_API_KEY=gsk_...      # Groq   (auto-detected from prefix)
```

**Frontend** (`kore-frontend/.env.local`)

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Optional: named key slots for the key-switcher UI
NEXT_PUBLIC_GEMINI_KEY_1=gsk_...      # TACO — Groq (ultra-fast)
NEXT_PUBLIC_GEMINI_KEY_2=AIzaSy...    # Max  — Gemini
NEXT_PUBLIC_GEMINI_KEY_3=AIzaSy...    # Sam  — Gemini
```

> The backend auto-detects the AI provider from the API key prefix. No manual provider selection needed.

---

## Project Structure

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
│   │   ├── main.py             # Entry point
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

## Usage

1. **Enter a query** — e.g. `Analyse Zomato` or `Startup: AI code review tool`
2. **KORE generates** a full multi-tab dashboard using live research data
3. **Switch tabs** — Overview, Financials, Market, Business Model, Competitors
4. **Open the chat panel** and ask:
   - *"Why did revenue drop in Q3?"* → Analytical answer in chat
   - *"Compare with its top 3 competitors"* → New temporary tab created
   - *"Now analyse Swiggy instead"* → Full dashboard regenerated
5. **State persists** — refresh the page and your dashboard is still there

---

## Deployment

| Platform | Component | Notes |
|---|---|---|
| [![Vercel](https://img.shields.io/badge/Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/) | Frontend | `cd kore-frontend && vercel` |
| [![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=flat-square&logo=railway)](https://railway.app/) | Backend | Uses `Procfile` / `nixpacks.toml` |
| [![Render](https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=black)](https://render.com/) | Backend | Uses `render.yaml` — free tier supported |
| [![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docker.com/) | Backend | `Dockerfile` included |

Set `NEXT_PUBLIC_BACKEND_URL` in Vercel to your Railway/Render backend URL.

---

## Performance

| Operation | Time |
|---|---|
| Dashboard generation (simple) | 15–30 s |
| Dashboard generation (complex) | 30–60 s |
| Groq mode (LLaMA-3.3-70B) | ~5–10 s |
| Chat response | 5–15 s |
| Temporary tab creation | 10–20 s |

---

## Roadmap

- [ ] PDF / PowerPoint export of dashboards
- [ ] Dashboard templates and saved presets
- [ ] Real-time collaboration (shared dashboards)
- [ ] Public API for programmatic access
- [ ] Mobile-optimised layout
- [ ] Multi-language support

---

## Contributing

Pull requests are welcome. For major changes, open an issue first.

1. Fork the repo
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m 'Add your feature'`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built with
[![Next.js](https://img.shields.io/badge/Next.js-black?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Gemini](https://img.shields.io/badge/Gemini-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)
[![Groq](https://img.shields.io/badge/Groq-FF6B35?style=flat-square)](https://groq.com/)

</div>
