import { Module, DashboardPayload } from './types'

export interface TabConfig {
  id: string
  label: string
  subject: string
  page_title: string
  chat_intro: string
  modules: Module[]
}

export const dummyData: Record<string, TabConfig> = {
  overview: {
    id: 'overview',
    label: 'Overview',
    subject: 'Alphabet (Google)',
    page_title: 'Google',
    chat_intro: "Google's ecosystem encompasses global Search dominance, the YouTube creator economy, and an expanding footprint in foundational AI (Gemini) and enterprise Cloud.",
    modules: [
      {
        id: 'ov-1', type: 'chart.area', size: '4x2', accent: 'tertiary',
        data: {
          title: 'Google Search query volume', subtitle: 'Billions of queries per day',
          labels: ['2020', '2021', '2022', '2023', '2024'],
          series: [5.5, 6.2, 6.9, 8.1, 8.5]
        }
      },
      {
        id: 'ov-2', type: 'metric.kpi', size: '1x1', accent: 'quaternary',
        data: { title: 'VALUATION', value: '$2.1T', delta: '+45%', direction: 'up', sparkline: [1.2, 1.5, 1.8, 2.0, 2.1] }
      },
      {
        id: 'ov-4', type: 'metric.kpi', size: '1x1', accent: 'primary',
        data: { title: 'REVENUE (TTM)', value: '$307B', delta: '+9%', direction: 'up', sparkline: [250, 270, 280, 295, 307] }
      },
      {
        id: 'ov-3', type: 'deco.stats', size: '3x1', accent: 'primary',
        data: {
          title: 'Ecosystem Scale', subtitle: 'Users worldwide',
          metrics: [
            { label: 'Android Devices', value: '3.0B+' },
            { label: 'YouTube MAU', value: '2.7B' },
            { label: 'Gmail Active', value: '1.8B' }
          ]
        }
      },
      {
        id: 'ov-5', type: 'metric.dual', size: '2x1', accent: 'secondary',
        data: {
          title: 'Search Dominance',
          kpis: [
            { title: 'GLOBAL SHARE', value: '91.5%', delta: 'Market leader', direction: 'neutral', sparkline: [92, 91.8, 91.5] },
            { title: 'MOBILE', value: '95%', delta: 'Android default', direction: 'up', sparkline: [93, 94, 95] }
          ]
        }
      },
      {
        id: 'ov-6', type: 'deco.timeline', size: '5x2', accent: 'primary',
        data: {
          title: 'Google Alphabet Evolution', subtitle: 'Search engine to AI-first conglomerate',
          points: [
            { year: '1998', event: 'Google Search founded', status: 'done' },
            { year: '2006', event: 'Acquisition of YouTube', status: 'done' },
            { year: '2008', event: 'Android OS launch', status: 'done' },
            { year: '2015', event: 'Alphabet restructuring', status: 'done' },
            { year: '2024+', event: 'Gemini Foundation AI Era', status: 'active' },
          ]
        }
      }
    ]
  },
  financials: {
    id: 'financials',
    label: 'Financials',
    subject: 'Alphabet (Google)',
    page_title: 'Google',
    chat_intro: "While Search advertising remains the unstoppable cash cow, Google Cloud has achieved operating profitability, providing a critical secondary growth engine.",
    modules: [
      {
        id: 'fin-1', type: 'chart.waterfall', size: '3x3', accent: 'brand',
        data: {
          title: 'Revenue Mix (Q4 Run Rate)', subtitle: 'Billions USD ($)',
          labels: ['Search Ads', 'YouTube', 'Network', 'Google Cloud', 'Other', 'Total'],
          invisible: [0, 48, 63, 71, 84, 0],
          series: [48, 15, 8, 13, 2, 86]
        }
      },
      {
        id: 'fin-2', type: 'metric.dual', size: '2x1', accent: 'green',
        data: {
          title: 'Profitability Highlights',
          kpis: [
            { title: 'OP MARGIN', value: '27%', delta: 'Q4 Core', direction: 'up', sparkline: [24, 25, 26, 27] },
            { title: 'CLOUD MARGIN', value: '9.4%', delta: 'Now profitable', direction: 'up', sparkline: [-4, -2, 4, 9.4] }
          ]
        }
      },
      {
        id: 'fin-3', type: 'chart.pie', size: '2x2', accent: 'blue',
        data: {
          title: 'Operating Expenses', subtitle: 'Excluding Cost of Revenues',
          segments: [
            { label: 'R&D (AI/Compute)', value: 55, color_key: 'brand' },
            { label: 'Sales & Mktg', value: 30, color_key: 'blue' },
            { label: 'G&A', value: 15, color_key: 'teal' }
          ]
        }
      },
      {
        id: 'fin-4', type: 'freeform.html', size: '3x2', accent: 'tertiary',
        data: {
          html: `
            <div style="display: flex; flex-direction: column; gap: 12px; height: 100%;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="font-size: 12px; font-weight: 700; color: var(--t-primary); letter-spacing: -0.2px;">AI Custom Insight: Cloud Economics</div>
                <div style="background: color-mix(in srgb, var(--accent-primary) 15%, transparent); color: var(--accent-primary); padding: 2px 8px; border-radius: 20px; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em;">Raw HTML Engine</div>
              </div>
              <div style="flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div style="background: var(--page-bg); border-radius: 8px; padding: 14px; display: flex; flex-direction: column; justify-content: center; border: 1px solid var(--border);">
                  <div style="font-size: 10px; font-weight: 600; color: var(--t-muted); text-transform: uppercase; margin-bottom: 6px;">Cloud Op. Margin</div>
                  <div style="font-size: 28px; font-weight: 800; color: var(--accent-quaternary); letter-spacing: -1px; line-height: 1;">9.4%</div>
                  <div style="font-size: 10px; color: var(--t-primary); margin-top: 6px; display: flex; align-items: center; gap: 4px;">
                    <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--accent-quaternary);"></span>
                    Turned profitable in FY24
                  </div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px; justify-content: center;">
                  <div style="font-size: 11px; font-weight: 600; color: var(--t-primary); line-height: 1.4;">
                    Hardware efficiency is driving margin expansion:
                  </div>
                  <ul style="margin: 0; padding-left: 16px; font-size: 10px; color: var(--t-secondary); line-height: 1.6;">
                    <li>TPUv5 rollout reducing inference costs</li>
                    <li>Extended server lifecycle to 6 years</li>
                    <li>Enterprise AI adoption surging</li>
                  </ul>
                </div>
              </div>
            </div>
          `
        }
      },
      {
        id: 'fin-5', type: 'chart.hbar', size: '2x2', accent: 'primary',
        data: {
          title: 'Traffic Acquisition Costs (TAC)',
          subtitle: 'Billions USD ($)',
          labels: ['Apple (Safari Default)', 'Android OEMs', 'Mozilla/Other'],
          series: [20, 10, 2],
          unit: 'B'
        }
      }
    ]
  },
  market: {
    id: 'market',
    label: 'Market',
    subject: 'Alphabet (Google)',
    page_title: 'Google',
    chat_intro: "Google is locked in a fierce foundational AI talent and capabilities war with Microsoft/OpenAI, accelerating the deployment of Gemini and custom TPUs.",
    modules: [
      {
        id: 'mkt-2', type: 'chart.area', size: '3x2', accent: 'brand',
        data: {
          title: 'AI Model Mindshare', subtitle: 'Search interest index',
          labels: ['Q1', 'Q2', 'Q3', 'Q4'],
          series: [10, 30, 60, 95], // Gemini
          series2: [90, 85, 95, 100] // ChatGPT/OpenAI
        }
      },
      {
        id: 'mkt-1', type: 'chart.radar', size: '2x2', accent: 'brand',
        data: {
          title: 'AI Capability Matrix', subtitle: 'Google relative strengths',
          labels: ['Data scale', 'Compute (TPUs)', 'Mobile Edge', 'B2B Distro', 'Consumer Chat'],
          series: [100, 95, 90, 75, 80]
        }
      },
      {
        id: 'mkt-3', type: 'feed.news', size: '3x2', accent: 'blue',
        data: {
          title: 'Ecosystem & Market News', subtitle: 'Regulatory & AI updates',
          items: [
            { headline: 'Google launches Gemini 1.5 Pro to enterprise developers', source: 'The Verge', date: '1W ago', sentiment: 'positive' },
            { headline: 'DOJ antitrust trial focuses on Apple default search deal', source: 'WSJ', date: '3W ago', sentiment: 'negative' },
            { headline: 'Waymo self-driving taxis expand to fully autonomous routes', source: 'TechCrunch', date: '1M ago', sentiment: 'positive' },
            { headline: 'EU opens formal AI Act compliance review against Google DeepMind', source: 'Reuters', date: '5D ago', sentiment: 'negative' },
            { headline: 'Pixel 9 Pro breaks Google\'s quarterly hardware revenue record', source: 'Bloomberg', date: '2W ago', sentiment: 'positive' },
            { headline: 'Google Maps rolls out AI-generated immersive route previews globally', source: 'Engadget', date: '1W ago', sentiment: 'positive' },
            { headline: 'Microsoft Bing AI gains 3% U.S. search share as Google faces scrutiny', source: 'FT', date: '3D ago', sentiment: 'negative' },
            { headline: 'Google Cloud signs landmark $1.2B deal with Airbus for data intelligence', source: 'Forbes', date: '4D ago', sentiment: 'positive' },
            { headline: 'YouTube Shorts surpasses 70B daily views, closing gap with TikTok', source: 'Variety', date: '6D ago', sentiment: 'positive' }
          ]
        }
      },
      {
        id: 'mkt-4', type: 'gauge', size: '2x1', accent: 'brand',
        data: {
          title: 'Smartphone OS Share', value: 71, max: 100, unit: '%', label: 'Android Global',
          description: 'Android continues to dominate global smartphone market share, driving core Search and YouTube retention metrics.'
        }
      },
      {
        id: 'mkt-5', type: 'gauge', size: '1x1', accent: 'purple',
        data: { title: 'U.S. Search Share', value: 88, max: 100, unit: '%' }
      },
      {
        id: 'mkt-8', type: 'metric.kpi', size: '1x1', accent: 'blue',
        data: { title: 'YOUTUBE PREMIUM', value: '100M', delta: 'Subs', direction: 'up', sparkline: [50, 70, 80, 100] }
      },
      {
        id: 'mkt-9', type: 'deco.stats', size: '5x1', accent: 'brand',
        data: {
          title: 'Hardware & Devices', subtitle: 'Pixel hardware scaling matrix',
          metrics: [
            { label: 'Pixel Phones (2023)', value: '10M units' },
            { label: 'Chromebooks Edu', value: '55% share' },
            { label: 'Nest thermostats', value: '12M active' },
            { label: 'Fitbit hardware', value: 'Integrated' }
          ]
        }
      }
    ]
  },
  biz_model: {
    id: 'biz_model',
    label: 'Business Model',
    subject: 'Alphabet (Google)',
    page_title: 'Google',
    chat_intro: "Google is the ultimate aggregator, providing free, essential services to billions to curate massive intent data, which it sells to advertisers through an automated auction system.",
    modules: [
      {
        id: 'bm-1', type: 'metric.kpi', size: '1x1', accent: 'primary',
        data: { title: 'CORE MODEL', value: 'Ads', delta: 'Auction', direction: 'up', sparkline: [80, 90, 100, 100] }
      },
      {
        id: 'bm-2', type: 'metric.kpi', size: '1x1', accent: 'secondary',
        data: { title: 'YOUTUBE SUBS', value: '$15B', delta: 'Run-rate', direction: 'up', sparkline: [8, 10, 12, 15] }
      },
      {
        id: 'bm-3', type: 'metric.kpi', size: '1x1', accent: 'quaternary',
        data: { title: 'WORKSPACE', value: '$10B+', delta: 'B2B SaaS', direction: 'up', sparkline: [7, 8, 9, 10] }
      },
      {
        id: 'bm-5', type: 'metric.dual', size: '2x1', accent: 'tertiary',
        data: {
          title: 'Google One Pricing',
          kpis: [
            { title: 'AI PREMIUM', value: '$19.99', delta: '/month', direction: 'up', sparkline: [0, 0, 15, 20] },
            { title: 'BASIC 100GB', value: '$1.99', delta: '/month', direction: 'neutral', sparkline: [2, 2, 2, 2] }
          ]
        }
      },
      {
        id: 'bm-6', type: 'canvas.bmc', size: '5x4', accent: 'primary',
        data: {
          title: 'Alphabet (Google) Business Model Canvas',
          cells: [
            {
              section: 'Key Partners',
              points: [
                'Mozilla, Apple (Safari Default Search)', 'Android OEMs (Samsung, OnePlus)', 'Alphabet subsidiaries (Waymo, Verily)',
                'Content Creators (YouTube Partners)', 'Ad Agencies & DSPs'
              ]
            },
            {
              section: 'Key Activities',
              points: [
                'Crawling & indexing the global web', 'AI & Machine Learning R&D (DeepMind)',
                'Operating global data centers & networks', 'Hardware supply chain (Pixel/TPU)', 'Ad auction clearing algorithm scaling'
              ]
            },
            {
              section: 'Key Resources',
              points: [
                'Exabytes of indexed global data', 'Proprietary TPU server infrastructure',
                'Android OS install base (3B+ devices)', 'Google Maps global geospatial graph',
                'World-class AI engineers & researchers'
              ]
            },
            {
              section: 'Value Proposition',
              points: [
                'Users: Organizing the world\'s information for free', 'Users: High-quality utilities (Docs, Maps, Gmail)',
                'Advertisers: Highly-targeted, intent-driven ad inventory', 'Enterprises: Scalable cloud computing & AI APIs',
                'Creators: Unmatched video monetization (YouTube)'
              ]
            },
            {
              section: 'Customer Relationships',
              points: [
                'Self-serve, automated ad buying platforms', 'Free automated consumer software',
                'High-touch enterprise B2B sales (Cloud)', 'Creator revenue sharing (55/45 split)',
                'Google One consumer subscriptions'
              ]
            },
            {
              section: 'Channels',
              points: [
                'Google.com & native Android apps', 'Chrome Browser defaults',
                'Apple iOS default integrations (paid)', 'B2B Enterprise Cloud salesforce',
                'Global ISP network peering'
              ]
            },
            {
              section: 'Customer Segments',
              points: [
                'Consumers globally (Search, YouTube)', 'SMEs (Google Ads, Workspace)',
                'Global Enterprises (GCP, BigQuery, AI)', 'Developers & Startups (Firebase, APIs)',
                'Hardware enthusiasts (Pixel)'
              ]
            },
            {
              section: 'Cost Structure',
              points: [
                'Traffic Acquisition Costs (TAC) - $30B+', 'Massive Capex for Data Centers & TPUs',
                'DeepR&D and engineering headcount', 'Bandwidth & infrastructure maintenance', 'Legal, regulatory fines & compliance'
              ]
            },
            {
              section: 'Revenue Streams',
              points: [
                'Google Properties Ads (Search, YouTube)', 'Google Network Ads (AdSense, AdMob)',
                'Google Cloud (IaaS, PaaS, SaaS)', 'Google Play app store cut (15-30%)',
                'Hardware (Pixel) & YouTube Premium Subs'
              ]
            }
          ]
        }
      }
    ]
  },
  competitors: {
    id: 'competitors',
    label: 'Competitors',
    subject: 'Alphabet (Google)',
    page_title: 'Google',
    chat_intro: "Google faces unprecedented existential threats. Microsoft/OpenAI challenge Search via AI, AWS dominates Cloud, and Amazon/TikTok siphon ad budgets.",
    modules: [
      {
        id: 'cmp-1', type: 'table', size: '4x2', accent: 'brand',
        data: {
          title: 'Big Tech Ecosystem Matrix', subtitle: 'Google vs Megacap Peers',
          columns: [
            { key: 'Platform', label: 'Platform' },
            { key: 'Core Engine', label: 'Core Engine' },
            { key: 'Cloud', label: 'Cloud' },
            { key: 'Consumer Hardware', label: 'Consumer Hardware' }
          ],
          rows: [
            { 'Platform': 'Google', 'Core Engine': 'Search / Ads', 'Cloud': 'GCP (#3)', 'Consumer Hardware': 'Pixel / Nest' },
            { 'Platform': 'Microsoft', 'Core Engine': 'Enterprise SaaS / OS', 'Cloud': 'Azure (#2)', 'Consumer Hardware': 'Xbox / Surface' },
            { 'Platform': 'Amazon', 'Core Engine': 'E-Commerce / Prime', 'Cloud': 'AWS (#1)', 'Consumer Hardware': 'Echo / Kindle' },
            { 'Platform': 'Apple', 'Core Engine': 'Hardware / Services ecosystem', 'Cloud': 'Internal (iCloud on GCP/AWS)', 'Consumer Hardware': 'iPhone / Mac' }
          ]
        }
      },
      {
        id: 'cmp-2', type: 'metric.kpi', size: '1x1', accent: 'purple',
        data: { title: 'AI THREAT', value: 'High', delta: 'OpenAI/ChatGPT', direction: 'down', sparkline: [2, 5, 8, 10] }
      },
      {
        id: 'cmp-5', type: 'metric.kpi', size: '1x1', accent: 'brand',
        data: { title: 'REGULATION', value: 'Severe', delta: 'DOJ Trials active', direction: 'down', sparkline: [10, 10, 10] }
      },
      {
        id: 'cmp-3', type: 'chart.grouped', size: '3x3', accent: 'primary',
        data: {
          title: 'Digital Advertising Share',
          subtitle: 'Core US Ad Market dominance',
          labels: ['Google', 'Meta', 'Amazon', 'TikTok'],
          series_list: [
            { name: '2022', values: [28, 20, 12, 2] },
            { name: '2023', values: [27, 21, 13, 3] },
            { name: '2024 (Est)', values: [25, 20, 14, 4] }
          ]
        }
      },
      {
        id: 'cmp-4', type: 'chart.pie', size: '2x2', accent: 'blue',
        data: {
          title: 'Global OS Share', subtitle: 'Mobile Duopoly',
          segments: [
            { label: 'Android (Google)', value: 71, color_key: 'brand' },
            { label: 'iOS (Apple)', value: 28, color_key: 'purple' },
            { label: 'Other', value: 1, color_key: 'teal' }
          ]
        }
      },
      {
        id: 'cmp-6', type: 'metric.dual', size: '2x1', accent: 'green',
        data: {
          title: 'B2B SaaS Growth',
          kpis: [
            { title: 'WORKSPACE', value: '9M+', delta: 'Paying Orgs', direction: 'up', sparkline: [7, 8, 9] },
            { title: 'O365 (MSFT)', value: '38M+', delta: 'Paying Orgs', direction: 'neutral', sparkline: [34, 36, 38] }
          ]
        }
      }
    ]
  }
}

export const DUMMY_PAYLOAD: DashboardPayload = {
  meta: {
    subject: 'Alphabet (Google)',
    mode: 'company',
    brand_color: '#4285F4', // Google Blue
    colors: {
      primary: '#4285F4',  // Google Blue
      secondary: '#EA4335',  // Google Red
      tertiary: '#FBBC04',  // Google Yellow
      quaternary: '#34A853',  // Google Green
    },
    logo_initials: 'G',
    page_title: 'Google',
    page_subtitle: 'Search & Ecosystem'
  },
  tabs: [
    { id: 'overview', label: 'Overview' },
    { id: 'financials', label: 'Financials' },
    { id: 'market', label: 'Market' },
    { id: 'biz_model', label: 'Business Model' },
    { id: 'competitors', label: 'Competitors' }
  ],
  chat_intro: dummyData.overview.chat_intro,
  modules: [
    ...dummyData.overview.modules.map(m => ({ ...m, tab: 'overview' })),
    ...dummyData.financials.modules.map(m => ({ ...m, tab: 'financials' })),
    ...dummyData.market.modules.map(m => ({ ...m, tab: 'market' })),
    ...dummyData.biz_model.modules.map(m => ({ ...m, tab: 'biz_model' })),
    ...dummyData.competitors.modules.map(m => ({ ...m, tab: 'competitors' }))
  ]
}
