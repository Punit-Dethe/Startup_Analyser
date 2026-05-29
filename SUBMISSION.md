<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: #fff;
    color: #0f0f0f;
    max-width: 800px;
    margin: 0 auto;
    padding: 56px 64px 48px;
    font-size: 13.5px;
    line-height: 1.7;
    -webkit-font-smoothing: antialiased;
  }

  /* ─── Top accent rule ─── */
  .top-rule {
    height: 3px;
    background: linear-gradient(90deg, #0f0f0f 55%, #d4d4d4 100%);
    margin-bottom: 32px;
    border-radius: 2px;
  }

  /* ─── Title block ─── */
  .title-block {
    margin-bottom: 28px;
    padding-bottom: 24px;
    border-bottom: 1px solid #e2e2e2;
  }

  .title-block h1 {
    font-size: 34px;
    font-weight: 800;
    letter-spacing: -0.7px;
    color: #0f0f0f;
    line-height: 1.1;
    margin-bottom: 5px;
  }

  .title-block .subtitle {
    font-size: 13.5px;
    color: #666;
    font-weight: 400;
  }

  .github-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 14px;
    padding: 7px 14px 7px 11px;
    background: #0f0f0f;
    color: #fff;
    text-decoration: none;
    border-radius: 5px;
    font-size: 11.5px;
    font-weight: 500;
    letter-spacing: 0.01em;
  }

  /* ─── Team row ─── */
  .team-row {
    display: flex;
    gap: 32px;
    margin-bottom: 28px;
    flex-wrap: wrap;
  }

  .team-member {
    display: flex;
    flex-direction: column;
  }

  .team-member .name {
    font-size: 13.5px;
    font-weight: 600;
    color: #0f0f0f;
  }

  .team-member .roll {
    font-family: 'Courier New', monospace;
    font-size: 11.5px;
    color: #888;
    margin-top: 1px;
  }

  /* ─── Section label ─── */
  .section-label {
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #aaa;
    margin-bottom: 8px;
  }

  /* ─── Body text ─── */
  .body-text {
    font-size: 13.5px;
    color: #2a2a2a;
    line-height: 1.8;
    text-align: justify;
    hyphens: auto;
    margin-bottom: 26px;
  }

  .body-text + .section-label {
    margin-top: 4px;
  }

  /* ─── Feature list ─── */
  .feature-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 28px;
  }

  .feature-item {
    display: flex;
    gap: 11px;
    align-items: flex-start;
    padding: 10px 13px;
    border: 1px solid #ebebeb;
    border-radius: 6px;
    background: #fdfdfd;
  }

  .feature-num {
    font-size: 10.5px;
    font-weight: 700;
    color: #ccc;
    min-width: 16px;
    padding-top: 2px;
  }

  .feature-body strong {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #111;
    margin-bottom: 1px;
  }

  .feature-body span {
    font-size: 11.5px;
    color: #777;
    line-height: 1.55;
  }

  /* ─── Footer ─── */
  .footer {
    margin-top: 8px;
    padding-top: 14px;
    border-top: 1px solid #e2e2e2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 10.5px;
    color: #c0c0c0;
  }

  .footer a {
    color: #c0c0c0;
    text-decoration: none;
  }

  @media print {
    body { padding: 30px 38px; }
    @page { size: A4; margin: 0; }
  }
</style>

<div class="top-rule"></div>

<div class="title-block">
  <h1>KORE Dashboard</h1>
  <div class="subtitle">Knowledge-Oriented Research Engine &nbsp;—&nbsp; AI-Powered Business Intelligence Platform</div>
  <a class="github-pill" href="https://github.com/Punit-Dethe/Startup_Analyser">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
    github.com/Punit-Dethe/Startup_Analyser
  </a>
</div>

<div class="section-label">Team</div>
<div class="team-row">
  <div class="team-member">
    <span class="name">Punit Dethe</span>
    <span class="roll">24102C0076</span>
  </div>
  <div class="team-member">
    <span class="name">Parth Pathak</span>
    <span class="roll">24102C0084</span>
  </div>
  <div class="team-member">
    <span class="name">Ziyad Mujawar</span>
    <span class="roll">24102C0082</span>
  </div>
</div>

<div class="section-label">Abstract</div>
<p class="body-text">
  KORE Dashboard is an AI-powered business intelligence platform that transforms a natural language query — such as <em>"Analyse Apple Inc."</em> — into a fully structured, multi-tab analytical dashboard in 15 to 30 seconds. The platform employs a two-tier architecture consisting of a <strong>Next.js 16</strong> frontend with <strong>React 19</strong> and <strong>TypeScript</strong>, paired with a <strong>FastAPI (Python)</strong> backend that handles AI orchestration and schema validation. Google's <strong>Gemini API</strong> is integrated with real-time Search Grounding to ensure all generated data reflects current, factual information. The interface is styled with <strong>Tailwind CSS 4</strong>, and data visualisations are powered by <strong>ECharts</strong> and <strong>Three.js</strong>. An embedded AI chat layer allows users to interrogate the dashboard, generate additional analytical views on demand, and switch subjects — all without a page reload.
</p>

<div class="section-label">Key Features</div>
<div class="feature-grid">
  <div class="feature-item">
    <span class="feature-num">01</span>
    <div class="feature-body">
      <strong>AI Dashboard Generation</strong>
      <span>Natural language input generates a structured 5×5 grid of 25 data modules in under 30 seconds.</span>
    </div>
  </div>
  <div class="feature-item">
    <span class="feature-num">02</span>
    <div class="feature-body">
      <strong>Google Search Grounding</strong>
      <span>Gemini fetches live data at generation time, eliminating hallucinated or outdated figures.</span>
    </div>
  </div>
  <div class="feature-item">
    <span class="feature-num">03</span>
    <div class="feature-body">
      <strong>13 Visualisation Module Types</strong>
      <span>KPIs, bar / line / area / grouped charts, pie, donut, tables, feeds, and stat strips.</span>
    </div>
  </div>
  <div class="feature-item">
    <span class="feature-num">04</span>
    <div class="feature-body">
      <strong>Contextual AI Chat</strong>
      <span>Three-action system: respond in chat, inject a live analysis tab, or regenerate for a new subject.</span>
    </div>
  </div>
  <div class="feature-item">
    <span class="feature-num">05</span>
    <div class="feature-body">
      <strong>Startup &amp; Company Modes</strong>
      <span>Lean Canvas, TAM/SAM/SOM, SWOT, and GTM for startups; financials and market data for companies.</span>
    </div>
  </div>
  <div class="feature-item">
    <span class="feature-num">06</span>
    <div class="feature-body">
      <strong>Persistent Session State</strong>
      <span>Dashboard JSON and chat history persist in localStorage and restore automatically on reload.</span>
    </div>
  </div>
</div>

<div class="footer">
  <span>KORE Dashboard &nbsp;·&nbsp; Project Submission &nbsp;·&nbsp; 2025–26</span>
  <a href="https://github.com/Punit-Dethe/Startup_Analyser">github.com/Punit-Dethe/Startup_Analyser</a>
</div>
