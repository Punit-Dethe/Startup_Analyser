<style>
  @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600;700&display=swap');

  /* ─── Reset & Base ─────────────────────────────────────────────────── */
  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'EB Garamond', Georgia, 'Times New Roman', serif;
    font-size: 11.5pt;
    line-height: 1.75;
    color: #1a1a1a;
    background: #ffffff;
    max-width: 780px;
    margin: 0 auto;
    padding: 60px 60px;
  }

  /* ─── Cover Page ────────────────────────────────────────────────────── */
  .cover {
    text-align: center;
    padding: 100px 0 80px;
    border-bottom: 2px solid #1a1a1a;
    margin-bottom: 60px;
    page-break-after: always;
  }

  .cover .institution {
    font-family: 'Inter', sans-serif;
    font-size: 9pt;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #555;
    margin-bottom: 40px;
  }

  .cover h1 {
    font-family: 'EB Garamond', serif;
    font-size: 28pt;
    font-weight: 700;
    letter-spacing: -0.5px;
    line-height: 1.2;
    margin-bottom: 12px;
    color: #111;
  }

  .cover .subtitle {
    font-family: 'EB Garamond', serif;
    font-size: 14pt;
    font-style: italic;
    color: #444;
    margin-bottom: 50px;
  }

  .cover .rule {
    width: 60px;
    border: none;
    border-top: 1.5px solid #1a1a1a;
    margin: 0 auto 50px;
  }

  .cover-meta {
    font-family: 'Inter', sans-serif;
    font-size: 9.5pt;
    color: #333;
    line-height: 2;
  }

  .cover-meta .label {
    font-weight: 600;
    font-size: 7.5pt;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #888;
    display: block;
    margin-top: 14px;
  }

  .cover-meta .value {
    font-weight: 400;
    font-size: 10.5pt;
    display: block;
    color: #1a1a1a;
  }

  .name-block {
    border: 1px solid #ccc;
    padding: 20px 32px;
    display: inline-block;
    margin-top: 40px;
    text-align: left;
    min-width: 460px;
  }

  .name-block .submitted-label {
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    font-size: 7.5pt;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #888;
    display: block;
    margin-bottom: 12px;
  }

  .members-table {
    width: 100%;
    border-collapse: collapse;
    font-family: 'Inter', sans-serif;
    font-size: 9.5pt;
  }

  .members-table th {
    font-size: 7pt;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #aaa;
    padding: 4px 10px 6px;
    border-bottom: 1px solid #ddd;
    text-align: left;
  }

  .members-table td {
    padding: 6px 10px;
    color: #1a1a1a;
    border-bottom: 1px solid #efefef;
    font-size: 9.5pt;
    line-height: 1.4;
  }

  .members-table tr:last-child td { border-bottom: none; }
  .members-table .sno { color: #bbb; font-size: 8.5pt; width: 24px; }

  /* ─── Table of Contents ─────────────────────────────────────────────── */
  .toc {
    margin-bottom: 60px;
    page-break-after: always;
  }

  .toc h2 {
    font-family: 'Inter', sans-serif;
    font-size: 8.5pt;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #888;
    margin-bottom: 20px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e0e0e0;
  }

  .toc-entry {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    font-family: 'Inter', sans-serif;
    font-size: 9.5pt;
    color: #333;
    padding: 5px 0;
    border-bottom: 1px dotted #ddd;
  }

  .toc-entry .toc-title { font-weight: 500; }
  .toc-entry .toc-num { color: #888; font-size: 8.5pt; }
  .toc-entry.toc-sub { padding-left: 20px; font-size: 9pt; color: #555; }

  /* ─── Section Headings ──────────────────────────────────────────────── */
  h1 {
    font-family: 'EB Garamond', serif;
    font-size: 20pt;
    font-weight: 700;
    color: #111;
    margin-top: 48px;
    margin-bottom: 8px;
    padding-bottom: 6px;
    border-bottom: 1.5px solid #1a1a1a;
  }

  h2 {
    font-family: 'EB Garamond', serif;
    font-size: 15pt;
    font-weight: 600;
    color: #1a1a1a;
    margin-top: 32px;
    margin-bottom: 6px;
  }

  h3 {
    font-family: 'Inter', sans-serif;
    font-size: 9pt;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #555;
    margin-top: 22px;
    margin-bottom: 4px;
  }

  /* ─── Paragraphs & Body ─────────────────────────────────────────────── */
  p {
    margin-bottom: 12px;
    text-align: justify;
    hyphens: auto;
  }

  .section-num {
    font-family: 'Inter', sans-serif;
    font-size: 8pt;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #aaa;
    margin-bottom: 2px;
    display: block;
  }

  /* ─── Tables ────────────────────────────────────────────────────────── */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0 24px;
    font-family: 'Inter', sans-serif;
    font-size: 9pt;
  }

  thead tr {
    background: #f5f5f5;
    border-bottom: 1.5px solid #bbb;
  }

  thead th {
    padding: 8px 12px;
    text-align: left;
    font-weight: 700;
    font-size: 8pt;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #444;
  }

  tbody td {
    padding: 7px 12px;
    border-bottom: 1px solid #ebebeb;
    color: #222;
    vertical-align: top;
    line-height: 1.5;
  }

  tbody tr:last-child td { border-bottom: 1.5px solid #bbb; }
  tbody tr:nth-child(even) td { background: #fafafa; }

  /* ─── Pull Quotes ───────────────────────────────────────────────────── */
  blockquote {
    border-left: 3px solid #1a1a1a;
    margin: 24px 0;
    padding: 10px 20px;
    font-style: italic;
    color: #333;
    font-size: 12pt;
    line-height: 1.7;
    background: #fafafa;
  }

  /* ─── Code / Monospace ──────────────────────────────────────────────── */
  code {
    font-family: 'Courier New', Courier, monospace;
    font-size: 9pt;
    background: #f5f5f5;
    padding: 2px 5px;
    border-radius: 2px;
    color: #333;
    border: 1px solid #e5e5e5;
  }

  pre {
    background: #f7f7f7;
    border: 1px solid #e0e0e0;
    border-left: 3px solid #666;
    padding: 14px 18px;
    font-family: 'Courier New', monospace;
    font-size: 8.5pt;
    line-height: 1.6;
    color: #222;
    overflow-x: auto;
    margin: 16px 0;
    white-space: pre-wrap;
  }

  /* ─── Figure Callout ────────────────────────────────────────────────── */
  .callout {
    background: #f9f9f9;
    border: 1px solid #ddd;
    border-top: 3px solid #333;
    padding: 16px 20px;
    margin: 24px 0;
    font-family: 'Inter', sans-serif;
    font-size: 9.5pt;
  }

  .callout .callout-label {
    font-weight: 700;
    font-size: 7.5pt;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #888;
    margin-bottom: 6px;
  }

  /* ─── Lists ─────────────────────────────────────────────────────────── */
  ul, ol {
    margin: 10px 0 14px 22px;
    line-height: 1.75;
  }

  li {
    margin-bottom: 4px;
  }

  /* ─── Module Grid Visual ────────────────────────────────────────────── */
  .module-grid-visual {
    display: inline-grid;
    grid-template-columns: repeat(5, 32px);
    grid-template-rows: repeat(5, 32px);
    gap: 3px;
    margin: 16px 0;
  }

  .grid-cell {
    background: #e0e0e0;
    border-radius: 2px;
  }

  .grid-cell.filled {
    background: #333;
  }

  /* ─── Page Breaks ───────────────────────────────────────────────────── */
  .page-break { page-break-after: always; }
  .no-break { page-break-inside: avoid; }

  /* ─── Footer rule ───────────────────────────────────────────────────── */
  .report-footer {
    margin-top: 60px;
    padding-top: 16px;
    border-top: 1px solid #ccc;
    font-family: 'Inter', sans-serif;
    font-size: 8pt;
    color: #999;
    text-align: center;
  }

  /* ─── Diagram boxes ─────────────────────────────────────────────────── */
  .arch-diagram {
    background: #f7f7f7;
    border: 1px solid #ddd;
    padding: 18px 22px;
    margin: 20px 0;
    font-family: 'Courier New', monospace;
    font-size: 8.5pt;
    line-height: 1.65;
    color: #222;
    white-space: pre;
    overflow-x: auto;
  }

  /* ─── Section separator ─────────────────────────────────────────────── */
  hr.section-rule {
    border: none;
    border-top: 1px solid #e0e0e0;
    margin: 40px 0;
  }

  @media print {
    body { padding: 0; }
    .cover { page-break-after: always; }
    .toc   { page-break-after: always; }
    h1 { page-break-before: auto; }
  }
</style>

<!-- ═══════════════════════════════════════════════════════════════════════ -->
<!-- COVER PAGE                                                              -->
<!-- ═══════════════════════════════════════════════════════════════════════ -->

<div class="cover">
  <div class="institution">Vidyalankar Institute of Technology</div>
  <div style="font-family:'Inter',sans-serif;font-size:8pt;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;color:#888;margin-bottom:38px;">Department of Computer Science &amp; Engineering</div>

  <h1>KORE Dashboard</h1>
  <div class="subtitle">AI-Powered Business Intelligence Platform<br>Project Report</div>
  <hr class="rule">

  <div class="cover-meta">
    <span class="label">Subject</span>
    <span class="value">Advanced Application Development</span>
  </div>

  <div class="name-block">
    <span class="submitted-label">Submitted By</span>
    <table class="members-table">
      <thead>
        <tr>
          <th class="sno">#</th>
          <th>Name</th>
          <th>Roll Number</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="sno">1</td>
          <td>Punit Nethe</td>
          <td>24102-C0076</td>
        </tr>
        <tr>
          <td class="sno">2</td>
          <td>Ziyad Mujawar</td>
          <td>24102-C0082</td>
        </tr>
        <tr>
          <td class="sno">3</td>
          <td>Parth Pathak</td>
          <td>24102-C0084</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════════════════════ -->
<!-- TABLE OF CONTENTS                                                       -->
<!-- ═══════════════════════════════════════════════════════════════════════ -->

<div class="toc">
  <h2>Table of Contents</h2>

  <div class="toc-entry"><span class="toc-title">1. Introduction &amp; Motivation</span><span class="toc-num">1</span></div>
  <div class="toc-entry"><span class="toc-title">2. System Architecture</span><span class="toc-num">2</span></div>
  <div class="toc-entry toc-sub"><span class="toc-title">2.1 Frontend — Next.js Application</span><span class="toc-num">2</span></div>
  <div class="toc-entry toc-sub"><span class="toc-title">2.2 Backend — FastAPI Service</span><span class="toc-num">3</span></div>
  <div class="toc-entry toc-sub"><span class="toc-title">2.3 AI Provider Layer</span><span class="toc-num">3</span></div>
  <div class="toc-entry"><span class="toc-title">3. The Dashboard Grid</span><span class="toc-num">4</span></div>
  <div class="toc-entry toc-sub"><span class="toc-title">3.1 The 5×5 Grid Constraint</span><span class="toc-num">4</span></div>
  <div class="toc-entry toc-sub"><span class="toc-title">3.2 Module Sizing</span><span class="toc-num">5</span></div>
  <div class="toc-entry"><span class="toc-title">4. Module System</span><span class="toc-num">5</span></div>
  <div class="toc-entry toc-sub"><span class="toc-title">4.1 KPI &amp; Metric Modules</span><span class="toc-num">6</span></div>
  <div class="toc-entry toc-sub"><span class="toc-title">4.2 Chart Modules</span><span class="toc-num">6</span></div>
  <div class="toc-entry toc-sub"><span class="toc-title">4.3 Table &amp; Feed Modules</span><span class="toc-num">7</span></div>
  <div class="toc-entry toc-sub"><span class="toc-title">4.4 Decorative &amp; Structural Modules</span><span class="toc-num">7</span></div>
  <div class="toc-entry toc-sub"><span class="toc-title">4.5 Startup-Specific Modules</span><span class="toc-num">8</span></div>
  <div class="toc-entry toc-sub"><span class="toc-title">4.6 How Modules Accept Data</span><span class="toc-num">9</span></div>
  <div class="toc-entry"><span class="toc-title">5. Temporary Tabs</span><span class="toc-num">10</span></div>
  <div class="toc-entry"><span class="toc-title">6. The Chat System</span><span class="toc-num">11</span></div>
  <div class="toc-entry toc-sub"><span class="toc-title">6.1 Chat Architecture</span><span class="toc-num">11</span></div>
  <div class="toc-entry toc-sub"><span class="toc-title">6.2 The Three Chat Actions</span><span class="toc-num">12</span></div>
  <div class="toc-entry toc-sub"><span class="toc-title">6.3 Dashboard State &amp; Context</span><span class="toc-num">12</span></div>
  <div class="toc-entry"><span class="toc-title">7. AI Prompts</span><span class="toc-num">13</span></div>
  <div class="toc-entry toc-sub"><span class="toc-title">7.1 Data Collector Prompt</span><span class="toc-num">13</span></div>
  <div class="toc-entry toc-sub"><span class="toc-title">7.2 Dashboard Generation Prompt</span><span class="toc-num">14</span></div>
  <div class="toc-entry toc-sub"><span class="toc-title">7.3 Startup Analysis Prompt</span><span class="toc-num">15</span></div>
  <div class="toc-entry toc-sub"><span class="toc-title">7.4 Chat System Prompt</span><span class="toc-num">16</span></div>
  <div class="toc-entry"><span class="toc-title">8. Startup Analysis Mode</span><span class="toc-num">17</span></div>
  <div class="toc-entry"><span class="toc-title">9. Technology Stack</span><span class="toc-num">18</span></div>
  <div class="toc-entry"><span class="toc-title">10. Conclusion</span><span class="toc-num">19</span></div>
</div>

---

<span class="section-num">Section 1</span>

# Introduction &amp; Motivation

**KORE Dashboard** is an AI-powered business intelligence platform built as a college project. A user types a single natural-language query — a company name, a startup idea, or a market question — and the system generates a fully populated, multi-tab, interactive analytical dashboard within 15 to 30 seconds. No manual data wiring, no schema configuration, no chart setup.

The defining design principle is that a single JSON payload generated by AI controls everything: the page title, brand colour, tabs, modules, and all data within them. The frontend is a **pure renderer** — it makes no decisions about what to show or how to structure information. That responsibility belongs entirely to the AI layer.

The platform supports three analysis modes: **Company** (public corporations), **Startup** (early-stage ideas), and **Market** (sector/industry research), each producing a structurally different dashboard from the same rendering engine.

<hr class="section-rule">

<span class="section-num">Section 2</span>

# System Architecture

The system has three layers communicating over HTTP: a **Next.js frontend** that renders dashboards, a **FastAPI backend** that orchestrates AI calls, and an **AI provider layer** that performs generation.

## 2.1 Frontend

Built with Next.js 15 and React 19 (TypeScript). The frontend receives a JSON payload and renders it — no generation logic lives here. React hooks manage three pieces of state: the full dashboard JSON, a compact context summary for chat, and the chat message history. All three are also persisted to `localStorage` so sessions survive page refreshes. Next.js API route handlers proxy backend calls so the backend URL never reaches the client.

## 2.2 Backend

A FastAPI (Python) service exposing two endpoints — `/generate` and `/chat`. An `AIClientFactory` inspects the API key in the request header and routes automatically to the correct provider:

- Keys prefixed `AIzaSy` → **GeminiClient** (Google Gemini 2.5 Flash)
- Keys prefixed `gsk_` → **GroqClient** (Meta LLaMA 3.3-70B)

Both clients implement an identical interface, making the provider transparent to the services above. The backend loads a prompt file, sends it with the user query to the selected AI, validates the returned JSON, and responds to the frontend.

## 2.3 AI Workflows

Two workflows exist: the **generation pipeline** (accepts a query → researches via Google Search grounding → synthesises dashboard JSON → validates → returns) and the **chat pipeline** (accepts a message + dashboard context → decides action type → returns structured JSON). In the n8n deployment, these are visual node pipelines; in the FastAPI deployment, they are direct API calls.

<hr class="section-rule">

<span class="section-num">Section 3</span>

# The Dashboard Grid

Each dashboard tab renders as a **5 columns × 5 rows CSS grid — exactly 25 cells per tab.** This is a hard constraint enforced through prompt engineering. The grid fills left-to-right, top-to-bottom (like reading text). Every row must be filled to width 5 before the next row begins.

<table>
  <thead><tr><th>Size</th><th>Cells</th><th>Typical Use</th><th>Size</th><th>Cells</th><th>Typical Use</th></tr></thead>
  <tbody>
    <tr><td><code>1×1</code></td><td>1</td><td>Single KPI card</td><td><code>3×2</code></td><td>6</td><td>Standard chart or table</td></tr>
    <tr><td><code>2×1</code></td><td>2</td><td>Dual metric strip</td><td><code>4×2</code></td><td>8</td><td>Wide chart</td></tr>
    <tr><td><code>5×1</code></td><td>5</td><td>Full-width stats bar</td><td><code>4×4</code></td><td>16</td><td>SWOT matrix</td></tr>
    <tr><td><code>2×2</code></td><td>4</td><td>Pie / donut chart</td><td><code>5×5</code></td><td>25</td><td>Full-tab canvas</td></tr>
  </tbody>
</table>

The AI generation prompts require a mandatory running cell count as each module is added, stopping at exactly 25. This converts a common failure mode (gaps or overflow) into a structural invariant. Any tab with 24 or 26 cells is considered a generation failure and must be corrected before the JSON is output.

<hr class="section-rule">

<span class="section-num">Section 4</span>

# Module System

A **module** is a single card occupying one or more grid cells. The frontend's `ModuleFactory` component receives a module definition and dispatches it to the correct React component based on the `type` field. There are 13+ implemented module types across five categories.

Every module JSON object has a consistent outer shape:

```json
{ "id": "fin-1", "tab": "financials", "type": "chart.area",
  "size": "4x2", "accent": "primary", "data": { ... } }
```

The `accent` field references one of four colour slots (`primary`, `secondary`, `tertiary`, `quaternary`) defined in `meta.colors`. The AI maps brand colours to these slots (black for Apple, green for Spotify, etc.), giving every module on the dashboard a consistent thematic colour without hard-coding values per module.

## 4.1 Standard Module Types

<table>
  <thead><tr><th>Type</th><th>Description</th><th>Key Data Fields</th><th>Size(s)</th></tr></thead>
  <tbody>
    <tr><td><code>metric.kpi</code></td><td>Single KPI — big number, delta, directional sparkline</td><td><code>title, value, delta, direction, sparkline[]</code></td><td><code>1×1</code></td></tr>
    <tr><td><code>metric.dual</code></td><td>Two KPIs in one card (exactly 2 items)</td><td><code>title?, kpis[2]</code></td><td><code>2×1</code></td></tr>
    <tr><td><code>gauge</code></td><td>Dial gauge with value vs. maximum</td><td><code>title, value, max, unit?</code></td><td><code>1×1</code>–<code>2×2</code></td></tr>
    <tr><td><code>chart.bar / line / area / hbar</code></td><td>Single-series charts. `hbar` is horizontal for ranked comparisons</td><td><code>labels[], series[]</code></td><td><code>2×2</code>–<code>5×4</code></td></tr>
    <tr><td><code>chart.grouped</code></td><td>Multi-series bar chart</td><td><code>labels[], series_list[{name, values[]}]</code></td><td><code>2×2</code>–<code>5×3</code></td></tr>
    <tr><td><code>chart.pie / donut</code></td><td>Pie or ring chart. Strictly <code>2×2</code> only</td><td><code>segments[{label, value, color_key}]</code></td><td><code>2×2</code></td></tr>
    <tr><td><code>chart.radar</code></td><td>Spider chart for multi-axis comparison</td><td><code>labels[], series[]</code></td><td><code>2×2</code>, <code>3×3</code></td></tr>
    <tr><td><code>chart.waterfall</code></td><td>Financial waterfall (cumulative adds/subtracts)</td><td><code>labels[], series[], invisible[]</code></td><td><code>3×3</code>–<code>5×3</code></td></tr>
    <tr><td><code>table</code></td><td>Sortable data table. Column types: <code>delta_badge</code>, <code>currency</code>, <code>percent</code></td><td><code>columns[{key,label}], rows[{key:val}]</code></td><td><code>3×1</code>–<code>5×5</code></td></tr>
    <tr><td><code>feed</code></td><td>Structured list — news, rankings, announcements. Supports sentiment badges</td><td><code>items[{headline, source, sentiment?}]</code></td><td><code>2×1</code>–<code>5×3</code></td></tr>
    <tr><td><code>deco.stats</code></td><td>Full-width horizontal statistics strip (3–5 stats)</td><td><code>metrics[{label, value}]</code></td><td><code>3×1</code>–<code>5×1</code></td></tr>
    <tr><td><code>deco.timeline</code></td><td>Milestone timeline with <code>done / active / pending</code> states</td><td><code>points[{year, event, status}]</code></td><td><code>4×2</code>, <code>5×2</code></td></tr>
    <tr><td><code>freeform</code></td><td>Raw HTML injected directly. Last-resort filler only</td><td><code>html: string</code></td><td><code>1×1</code>–<code>2×2</code></td></tr>
  </tbody>
</table>

A critical rule enforced across both prompts and frontend validation: single-series charts (`bar`, `line`, `area`, `hbar`) must use a flat `series` array; only `chart.grouped` uses the nested `series_list` structure. Confusion between these two is identified as the most common generation error.

## 4.2 Startup-Specific Module Types

Six additional module types are exclusively used in Startup Analysis mode. These are large framework modules that anchor an entire tab.

<table>
  <thead><tr><th>Type</th><th>Framework</th><th>Size</th><th>Description</th></tr></thead>
  <tbody>
    <tr><td><code>canvas.lean</code></td><td>Lean Canvas</td><td><code>5×5</code></td><td>Full-tab, nine-section business model canvas (Problem, Solution, Key Metrics, UVP, Unfair Advantage, Channels, Segments, Costs, Revenue)</td></tr>
    <tr><td><code>canvas.bmc</code></td><td>Business Model Canvas</td><td><code>5×4</code></td><td>Osterwalder BMC with the same nine sections, each as bullet-point lists</td></tr>
    <tr><td><code>market.tamsamsom</code></td><td>TAM / SAM / SOM</td><td><code>3×3</code></td><td>Concentric-circle market sizing visualisation with value, percentage, and description per ring</td></tr>
    <tr><td><code>matrix.swot</code></td><td>SWOT Analysis</td><td><code>4×4</code></td><td>Four-quadrant strategic matrix. Leaves 9 cells that must be filled with a mandatory companion layout</td></tr>
    <tr><td><code>matrix.competitive</code></td><td>Competitive Positioning</td><td><code>4×3</code></td><td>XY scatter plot placing competitors on configurable axes (e.g., Price vs. Speed) with bubble sizes for market share</td></tr>
    <tr><td><code>strategy.gtm</code></td><td>Go-to-Market</td><td><code>5×3</code></td><td>Seven-step GTM strategy, each step with a title, icon, colour, and bullet points</td></tr>
  </tbody>
</table>

<hr class="section-rule">

<span class="section-num">Section 5</span>

# Temporary Tabs

When a chat query demands more than a text response but less than a full dashboard regeneration, the AI can respond with a **Temporary Tab** — an ephemeral tab appended to the dashboard's tab bar for the current session only.

Examples: *"Compare this company against its top three competitors"*, *"Deep dive into the revenue model"*. A Temporary Tab is a fully valid KORE tab: it must contain exactly 25 cells, follow all grid rules, and use only valid module types. It is generated entirely within a single chat response — no separate call to `/generate` is made.

The chat response for a Temporary Tab contains three simultaneous fields: `message` (detailed analytical text shown in the chat panel), `tab` (metadata including `isTemporary: true`), and `modules[]` (all module definitions for the new tab). The chat system prompt explicitly requires that the `message` field contain substantive analysis — not merely "Created temporary tab." The tab shows the data; the message explains what it means.

<hr class="section-rule">

<span class="section-num">Section 6</span>

# The Chat System

## 6.1 Architecture

The chat panel is a fixed UI region always co-visible with the module grid. It contains a scrollable message thread and a persistent text input. When a user sends a message, the frontend builds a payload containing the message text, up to 14 messages of recent history (7 turns), and a compact summary of the current tab's visible modules — then POSTs it to `/chat`.

The backend forwards this to a Gemini model with **Google Search grounding enabled**, allowing the AI to look up live data when answering questions about current metrics. The response is always a structured JSON object conforming to one of four action types.

## 6.2 The Four Chat Actions

<table>
  <thead><tr><th>Action</th><th>Trigger</th><th>Dashboard Effect</th></tr></thead>
  <tbody>
    <tr><td><code>CHAT</code></td><td>Analytical question answerable from existing data</td><td>Message appended to chat thread only; no dashboard change</td></tr>
    <tr><td><code>REFRESH</code></td><td>User requests updated module data (e.g., newer figures)</td><td>Specific modules patched in-place; dashboard state recalculated</td></tr>
    <tr><td><code>NEW_DASHBOARD</code></td><td>User asks to analyse a different subject entirely</td><td>Full <code>/generate</code> call triggered with new prompt; entire dashboard replaced</td></tr>
    <tr><td><code>TEMPORARY_TAB</code></td><td>Focused analysis too large for chat; no full regeneration needed</td><td>New ephemeral tab appended to tab bar</td></tr>
  </tbody>
</table>

## 6.3 Dashboard State

State is stored entirely on the frontend — n8n and the backend are stateless. The `summarizeDashboard()` function (pure JavaScript, no API call) traverses the full dashboard JSON and produces a ~2 KB compact summary: subject name, mode, and for each tab a list of module ids, types, sizes, titles, and one representative value. This summary is sent with every chat POST as `context.visible_modules`. The full dashboard JSON, compact state, and last 20 chat messages are all persisted to `localStorage`.

<hr class="section-rule">

<span class="section-num">Section 7</span>

# AI Prompts

The system uses four distinct prompts, each scoped to one function. All prompts mandate raw JSON output with no markdown fences or conversational wrapper text.

<table>
  <thead><tr><th>Prompt</th><th>File</th><th>Model / Grounding</th><th>Purpose</th></tr></thead>
  <tbody>
    <tr><td><strong>Data Collector</strong></td><td>Inline (n8n node)</td><td>Gemini + Search ON</td><td>Produces a structured plain-text research brief covering company overview, financials, market position, competitors, and recent news. Instructs the model to cite sources for every number and write "NOT PUBLICLY AVAILABLE" rather than inventing data.</td></tr>
    <tr><td><strong>Dashboard Generation</strong></td><td><code>prompts/generate.md</code></td><td>Gemini / Groq, Search OFF</td><td>Converts the research brief into valid dashboard JSON. Defines the 5×5 grid rule, all module types and their data schemas, brand colour selection logic, and a mandatory 8-step thinking process the model must complete before producing any output.</td></tr>
    <tr><td><strong>Startup Analysis</strong></td><td><code>prompts/startupanalysis.md</code></td><td>Gemini / Groq, Search OFF</td><td>Superset of the generation prompt with startup-specific rules: mandatory 5-tab structure, anchor module requirements per tab, anti-repetition rules (charts/tables preferred over KPI cards for market data), and a fixed SWOT-tab companion layout.</td></tr>
    <tr><td><strong>Chat</strong></td><td><code>prompts/chat.md</code></td><td>Gemini + Search ON</td><td>Governs the AI analyst persona. Defines the four action types, a complete catalogue of valid module types with annotated JSON examples, the 25-cell temporary tab constraint, and a 14-point validation checklist required before outputting a TEMPORARY_TAB response.</td></tr>
  </tbody>
</table>

The generation prompt enforces an 8-phase mandatory reasoning process before any JSON is output: (1) understand the query, (2) gather and verify data, (3) categorise into tabs, (4) choose visualisation types, (5) plan each tab row-by-row to exactly 25 cells, (6) assign brand colours, (7) write the `chat_intro` executive report, and (8) run the final validation checklist. The `chat_intro` field — a structured markdown report included in the dashboard payload — must follow a defined format: executive summary paragraphs, section headers, markdown tables for data, inline HTML colour spans for directional indicators (green for positive, red for negative), and blockquotes for key insights.

<hr class="section-rule">

<span class="section-num">Section 8</span>

# Startup Analysis Mode

Startup mode routes the query to the startup analysis prompt and produces a fixed **five-tab structure**:

<table>
  <thead><tr><th>Tab</th><th>Anchor Module</th><th>Size</th><th>Remaining Cells</th></tr></thead>
  <tbody>
    <tr><td><strong>Business Model</strong></td><td><code>canvas.lean</code></td><td><code>5×5</code></td><td>0 — fills the entire grid</td></tr>
    <tr><td><strong>Market</strong></td><td><code>market.tamsamsom</code></td><td><code>3×3</code></td><td>16 — filled with market growth charts, segment breakdowns, demographic data</td></tr>
    <tr><td><strong>Competition</strong></td><td><code>matrix.competitive</code></td><td><code>4×3</code></td><td>13 — head-to-head comparison tables, feature scoring charts</td></tr>
    <tr><td><strong>Execution</strong></td><td><code>strategy.gtm</code></td><td><code>5×3</code></td><td>10 — acquisition funnel, milestone timeline, key execution KPIs</td></tr>
    <tr><td><strong>SWOT</strong></td><td><code>matrix.swot</code></td><td><code>4×4</code></td><td>9 — mandatory fixed layout: <code>table 1×2</code> + <code>metric.kpi 1×1</code> + <code>gauge 1×1</code> + <code>deco.stats 5×1</code></td></tr>
  </tbody>
</table>

The startup prompt explicitly prohibits filling market or competition tabs with multiple KPI cards showing the same numbers. Charts and tables are preferred for comparative and trend data; KPIs are reserved for critical single metrics only. Each module on every tab must add new information — repetition across modules is flagged as a generation failure.

The local development demonstration uses a fictional food delivery startup called *QuickBite*, targeting tier-2 Indian cities with a 15-minute delivery guarantee. Its data populates all five tabs as a reference example showing how real-world startup metrics map to the module schema.

<hr class="section-rule">

<span class="section-num">Section 9</span>

# Technology Stack

<table>
  <thead><tr><th>Layer</th><th>Technology</th><th>Role</th></tr></thead>
  <tbody>
    <tr><td>Frontend Framework</td><td>Next.js 15 + React 19</td><td>Server-side rendering, routing, API proxying</td></tr>
    <tr><td>Language</td><td>TypeScript</td><td>Type-safe frontend and API contracts</td></tr>
    <tr><td>Styling</td><td>Tailwind CSS</td><td>Utility classes; CSS variables for dynamic theming</td></tr>
    <tr><td>Charting</td><td>Recharts 2.x</td><td>Bar, line, area, pie, radar, and grouped chart components</td></tr>
    <tr><td>Backend Framework</td><td>FastAPI (Python 3.9+)</td><td>Async REST API, prompt orchestration, JSON validation</td></tr>
    <tr><td>AI Model — Primary</td><td>Google Gemini 2.5 Flash</td><td>Dashboard generation and chat with Google Search grounding</td></tr>
    <tr><td>AI Model — Alternative</td><td>Groq / LLaMA 3.3-70B</td><td>Ultra-fast generation without live search capability</td></tr>
    <tr><td>Workflow Automation</td><td>n8n (self-hosted)</td><td>Visual pipeline for generation and chat (optional deployment)</td></tr>
    <tr><td>Deployment — Frontend</td><td>Vercel</td><td>Edge-network Next.js hosting</td></tr>
    <tr><td>Deployment — Backend</td><td>Railway / Render</td><td>Containerised FastAPI hosting</td></tr>
  </tbody>
</table>

<hr class="section-rule">

<span class="section-num">Section 10</span>

# Conclusion

KORE Dashboard demonstrates a generation-first approach to business intelligence: rather than connecting to data sources and configuring charts manually, the system produces a complete, coherent analytical interface from a single sentence. The JSON contract between the AI and the frontend — where the AI is the architect and the frontend is the builder — is the design choice that makes this possible.

The 5×5 grid constraint, enforced entirely through prompt engineering, shows how structural invariants can be maintained through instruction design rather than corrective post-processing. The chat system's four-action model (`CHAT`, `REFRESH`, `NEW_DASHBOARD`, `TEMPORARY_TAB`) demonstrates how AI-driven interactivity can be made deterministic: the AI commits to a typed action, and the frontend responds to it predictably.

As a college project, KORE Dashboard illustrates how large language models can be guided through careful prompt engineering alone to produce schema-compliant, structured outputs that drive complex user interfaces — without fine-tuning, RAG pipelines, or custom model training.

<div class="report-footer">
  KORE Dashboard — Project Report &nbsp;|&nbsp; Vidyalankar Institute of Technology &nbsp;|&nbsp; Department of Computer Science &amp; Engineering
</div>

