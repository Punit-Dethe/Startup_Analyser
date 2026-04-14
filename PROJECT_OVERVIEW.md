<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
  
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.6;
    color: #1a1a1a;
    max-width: 900px;
    margin: 0 auto;
    padding: 40px 20px;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  }
  
  .header {
    text-align: center;
    padding: 60px 0 40px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 16px;
    margin-bottom: 50px;
    box-shadow: 0 20px 60px rgba(102, 126, 234, 0.4);
  }
  
  .header h1 {
    font-size: 3em;
    font-weight: 700;
    margin: 0 0 10px;
    letter-spacing: -1px;
  }
  
  .header .tagline {
    font-size: 1.2em;
    font-weight: 300;
    opacity: 0.95;
    margin: 0;
  }
  
  .section {
    background: white;
    padding: 40px;
    margin-bottom: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }
  
  .section h2 {
    color: #667eea;
    font-size: 1.8em;
    font-weight: 600;
    margin-top: 0;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 3px solid #667eea;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin: 30px 0;
  }
  
  .stat-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 30px 20px;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  }
  
  .stat-card .number {
    font-size: 2.5em;
    font-weight: 700;
    margin: 0;
    line-height: 1;
  }
  
  .stat-card .label {
    font-size: 0.9em;
    opacity: 0.9;
    margin-top: 8px;
    font-weight: 400;
  }
  
  .team-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 25px;
    margin: 30px 0;
  }
  
  .team-member {
    background: #f8f9fa;
    padding: 30px 20px;
    border-radius: 12px;
    text-align: center;
    border: 2px solid #e9ecef;
    transition: all 0.3s ease;
  }
  
  .team-member:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
    border-color: #667eea;
  }
  
  .team-member .avatar {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    margin: 0 auto 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2em;
    font-weight: 700;
    color: white;
  }
  
  .team-member .name {
    font-size: 1.2em;
    font-weight: 600;
    color: #1a1a1a;
    margin: 10px 0 5px;
  }
  
  .team-member .role {
    color: #667eea;
    font-size: 0.95em;
    font-weight: 500;
  }
  
  .team-member .row-number {
    display: inline-block;
    background: #667eea;
    color: white;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.85em;
    font-weight: 600;
    margin-top: 10px;
  }
  
  .tech-stack {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin: 20px 0;
  }
  
  .tech-badge {
    background: #f8f9fa;
    color: #495057;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.9em;
    font-weight: 500;
    border: 2px solid #e9ecef;
  }
  
  .feature-list {
    list-style: none;
    padding: 0;
  }
  
  .feature-list li {
    padding: 12px 0;
    padding-left: 30px;
    position: relative;
    font-size: 1.05em;
  }
  
  .feature-list li:before {
    content: "✓";
    position: absolute;
    left: 0;
    color: #667eea;
    font-weight: 700;
    font-size: 1.2em;
  }
  
  .highlight-box {
    background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
    border-left: 4px solid #667eea;
    padding: 20px 25px;
    margin: 25px 0;
    border-radius: 8px;
  }
  
  .highlight-box p {
    margin: 0;
    font-size: 1.05em;
    color: #495057;
  }
  
  .footer {
    text-align: center;
    padding: 40px 20px;
    color: #6c757d;
    font-size: 0.95em;
  }
</style>

<div class="header">
  <h1>KORE Dashboard</h1>
  <p class="tagline">AI-Powered Business Intelligence Platform</p>
</div>

<div class="section">
  <h2>📊 Project Overview</h2>
  <p>KORE Dashboard is a sophisticated AI-powered business intelligence platform that transforms natural language queries into comprehensive, interactive dashboards. Built with cutting-edge technology, it provides instant startup and company analysis with rich visualizations and strategic insights.</p>
  
  <div class="highlight-box">
    <p><strong>Mission:</strong> Democratize business intelligence by making complex market analysis accessible through conversational AI, enabling entrepreneurs and analysts to make data-driven decisions in seconds, not hours.</p>
  </div>
</div>

<div class="section">
  <h2>🎯 Key Metrics</h2>
  <div class="stats-grid">
    <div class="stat-card">
      <div class="number">10x</div>
      <div class="label">Faster Analysis</div>
    </div>
    <div class="stat-card">
      <div class="number">25+</div>
      <div class="label">Module Types</div>
    </div>
    <div class="stat-card">
      <div class="number">15-30s</div>
      <div class="label">Generation Time</div>
    </div>
  </div>
</div>

<div class="section">
  <h2>👥 Core Team</h2>
  <div class="team-grid">
    <div class="team-member">
      <div class="avatar">1</div>
      <div class="name">[Name]</div>
      <div class="role">Lead Developer</div>
      <div class="row-number">Row #1</div>
    </div>
    <div class="team-member">
      <div class="avatar">2</div>
      <div class="name">[Name]</div>
      <div class="role">AI Engineer</div>
      <div class="row-number">Row #2</div>
    </div>
    <div class="team-member">
      <div class="avatar">3</div>
      <div class="name">[Name]</div>
      <div class="role">Product Designer</div>
      <div class="row-number">Row #3</div>
    </div>
  </div>
</div>

<div class="section">
  <h2>⚡ Core Features</h2>
  <ul class="feature-list">
    <li><strong>Startup Analysis Mode:</strong> Comprehensive analysis with Lean Canvas, TAM/SAM/SOM, SWOT, Competitive Matrix, and GTM Strategy</li>
    <li><strong>Company Analysis Mode:</strong> Deep-dive into existing companies with business model analysis, market positioning, and competitive landscape</li>
    <li><strong>AI-Powered Chat:</strong> Interactive Q&A about generated dashboards with context-aware responses</li>
    <li><strong>Rich Visualizations:</strong> 25+ module types including charts, tables, gauges, timelines, and custom matrices</li>
    <li><strong>Multi-Provider Support:</strong> Seamless integration with Gemini, Groq, and OpenRouter APIs</li>
    <li><strong>Real-Time Generation:</strong> Dashboard creation in 15-30 seconds with streaming updates</li>
  </ul>
</div>

<div class="section">
  <h2>🛠️ Technology Stack</h2>
  <div class="tech-stack">
    <span class="tech-badge">Next.js 15</span>
    <span class="tech-badge">React 19</span>
    <span class="tech-badge">TypeScript</span>
    <span class="tech-badge">FastAPI</span>
    <span class="tech-badge">Python 3.9+</span>
    <span class="tech-badge">Google Gemini</span>
    <span class="tech-badge">Groq</span>
    <span class="tech-badge">OpenRouter</span>
    <span class="tech-badge">Tailwind CSS</span>
    <span class="tech-badge">Recharts</span>
  </div>
</div>

<div class="section">
  <h2>🏗️ Architecture</h2>
  <p>KORE Dashboard follows a modern, scalable architecture with clear separation of concerns:</p>
  
  <div style="margin: 25px 0;">
    <h3 style="color: #495057; font-size: 1.2em; margin-bottom: 15px;">Frontend (Next.js)</h3>
    <ul style="color: #6c757d; line-height: 1.8;">
      <li>Server-side rendering for optimal performance</li>
      <li>Component-based architecture with reusable modules</li>
      <li>Real-time state management with React hooks</li>
      <li>Responsive design with Tailwind CSS</li>
    </ul>
  </div>
  
  <div style="margin: 25px 0;">
    <h3 style="color: #495057; font-size: 1.2em; margin-bottom: 15px;">Backend (FastAPI)</h3>
    <ul style="color: #6c757d; line-height: 1.8;">
      <li>RESTful API with automatic OpenAPI documentation</li>
      <li>Async/await for concurrent request handling</li>
      <li>Retry logic and error handling for AI providers</li>
      <li>Structured logging and monitoring</li>
    </ul>
  </div>
</div>

<div class="section">
  <h2>📈 Performance</h2>
  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
    <thead>
      <tr style="background: #f8f9fa; border-bottom: 2px solid #dee2e6;">
        <th style="padding: 12px; text-align: left; font-weight: 600;">Operation</th>
        <th style="padding: 12px; text-align: left; font-weight: 600;">Time</th>
        <th style="padding: 12px; text-align: left; font-weight: 600;">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #e9ecef;">
        <td style="padding: 12px;">Simple Dashboard Generation</td>
        <td style="padding: 12px; color: #667eea; font-weight: 600;">15-30 seconds</td>
        <td style="padding: 12px; color: #28a745;">✓ Optimized</td>
      </tr>
      <tr style="border-bottom: 1px solid #e9ecef;">
        <td style="padding: 12px;">Complex Dashboard Generation</td>
        <td style="padding: 12px; color: #667eea; font-weight: 600;">30-60 seconds</td>
        <td style="padding: 12px; color: #28a745;">✓ Optimized</td>
      </tr>
      <tr style="border-bottom: 1px solid #e9ecef;">
        <td style="padding: 12px;">Chat Response</td>
        <td style="padding: 12px; color: #667eea; font-weight: 600;">10-20 seconds</td>
        <td style="padding: 12px; color: #28a745;">✓ Optimized</td>
      </tr>
      <tr>
        <td style="padding: 12px;">Health Check</td>
        <td style="padding: 12px; color: #667eea; font-weight: 600;">&lt; 1 second</td>
        <td style="padding: 12px; color: #28a745;">✓ Optimized</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="section">
  <h2>🚀 Deployment</h2>
  <p>KORE Dashboard supports multiple deployment options for maximum flexibility:</p>
  <ul class="feature-list">
    <li><strong>Railway:</strong> Recommended for production with automatic deployments and scaling</li>
    <li><strong>Render:</strong> Alternative cloud platform with free tier support</li>
    <li><strong>Vercel:</strong> Frontend deployment with edge network optimization</li>
    <li><strong>Docker:</strong> Containerized deployment for any cloud provider</li>
    <li><strong>Local:</strong> Development and testing on localhost</li>
  </ul>
</div>

<div class="section">
  <h2>🎯 Future Roadmap</h2>
  <ul style="color: #6c757d; line-height: 1.8;">
    <li>📊 Export dashboards to PDF/PowerPoint</li>
    <li>🔄 Real-time collaboration features</li>
    <li>📱 Mobile app for iOS and Android</li>
    <li>🌐 Multi-language support</li>
    <li>🔌 API access for third-party integrations</li>
    <li>💾 Dashboard templates and presets</li>
  </ul>
</div>

<div class="footer">
  <p>Built with ❤️ using Next.js, FastAPI, and Google Gemini</p>
  <p style="margin-top: 10px; font-size: 0.9em;">© 2024 KORE Dashboard. All rights reserved.</p>
</div>
