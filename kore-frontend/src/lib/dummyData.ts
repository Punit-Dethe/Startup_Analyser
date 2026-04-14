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
  startup: {
    id: 'startup',
    label: 'Lean Canvas',
    subject: 'Food Delivery Startup',
    page_title: 'QuickBite - Food Delivery Startup',
    chat_intro: "QuickBite is a hyperlocal food delivery platform targeting tier-2 Indian cities, focusing on home-cooked meals and local restaurants with 15-minute delivery promise.",
    modules: [
      {
        id: 'startup-1', type: 'canvas.lean', size: '5x5', accent: 'primary',
        data: {
          title: 'QuickBite Lean Canvas',
          cells: [
            {
              section: 'Problem',
              points: [
                'Limited food delivery options in tier-2 cities',
                'Long delivery times (45-60 mins)',
                'Lack of home-cooked meal options'
              ]
            },
            {
              section: 'Solution',
              points: [
                'Hyperlocal delivery network',
                '15-minute delivery guarantee',
                'Home chef marketplace',
                'AI-powered route optimization'
              ]
            },
            {
              section: 'Key Metrics',
              points: [
                'Orders per day',
                'Average delivery time',
                'Customer retention rate',
                'Home chef satisfaction'
              ]
            },
            {
              section: 'Unique Value Proposition',
              points: [
                'Fastest delivery in tier-2 cities',
                'Authentic home-cooked meals',
                'Support local economy'
              ]
            },
            {
              section: 'Unfair Advantage',
              points: [
                'Proprietary delivery algorithm',
                'Exclusive home chef network',
                'Deep local partnerships'
              ]
            },
            {
              section: 'Channels',
              points: [
                'Mobile app (iOS & Android)',
                'WhatsApp ordering',
                'Local influencer partnerships',
                'College campus activations'
              ]
            },
            {
              section: 'Customer Segments',
              points: [
                'Working professionals (25-40)',
                'College students',
                'Families seeking variety',
                'Health-conscious consumers'
              ]
            },
            {
              section: 'Cost Structure',
              points: [
                'Delivery fleet operations: 35%',
                'Technology & platform: 20%',
                'Marketing & acquisition: 25%',
                'Operations & support: 15%',
                'Admin & overhead: 5%'
              ]
            },
            {
              section: 'Revenue Streams',
              points: [
                'Delivery fees: ₹20-40 per order',
                'Restaurant commission: 18-22%',
                'Home chef commission: 15%',
                'Subscription plans: ₹299/month',
                'Advertising revenue'
              ]
            }
          ]
        }
      }
    ]
  },
  market: {
    id: 'market',
    label: 'Market Size',
    subject: 'Food Delivery Startup',
    page_title: 'QuickBite - Market Analysis',
    chat_intro: "Market sizing analysis for QuickBite's tier-2 city food delivery opportunity, showing TAM/SAM/SOM breakdown and growth projections.",
    modules: [
      {
        id: 'market-1', type: 'market.tamsamsom', size: '3x3', accent: 'primary',
        data: {
          title: 'Market Opportunity Analysis',
          subtitle: 'TAM → SAM → SOM Breakdown',
          segments: [
            { 
              label: 'TAM', 
              value: 12000, 
              percentage: 100,
              description: 'Total addressable market for food delivery across all of India. Represents the entire revenue opportunity if 100% market share was achieved.',
              color: '#1F2937' 
            },
            { 
              label: 'SAM', 
              value: 3600, 
              percentage: 30,
              description: 'Serviceable available market in tier-2 cities only. This is 30% of TAM, representing our realistic geographic and demographic focus.',
              color: '#F59E0B' 
            },
            { 
              label: 'SOM', 
              value: 180, 
              percentage: 5,
              description: 'Serviceable obtainable market by Year 3. Conservative 5% capture of SAM based on competitive landscape and growth projections.',
              color: '#22C55E' 
            }
          ],
          unit: '₹Cr'
        }
      },
      {
        id: 'market-2', type: 'metric.kpi', size: '1x1', accent: 'primary',
        data: { 
          title: 'TAM', 
          value: '₹12K Cr', 
          delta: 'Total Market', 
          direction: 'up', 
          sparkline: [8000, 9500, 10800, 12000] 
        }
      },
      {
        id: 'market-3', type: 'metric.kpi', size: '1x1', accent: 'secondary',
        data: { 
          title: 'SAM', 
          value: '₹3.6K Cr', 
          delta: '30% of TAM', 
          direction: 'up', 
          sparkline: [2400, 2900, 3200, 3600] 
        }
      },
      {
        id: 'market-4', type: 'metric.kpi', size: '1x1', accent: 'quaternary',
        data: { 
          title: 'SOM (Y3)', 
          value: '₹180 Cr', 
          delta: '5% of SAM', 
          direction: 'up', 
          sparkline: [20, 60, 120, 180] 
        }
      },
      {
        id: 'market-5', type: 'chart.area', size: '3x2', accent: 'tertiary',
        data: {
          title: 'Revenue Projection',
          subtitle: '5-Year Growth Trajectory (₹Cr)',
          labels: ['Y1', 'Y2', 'Y3', 'Y4', 'Y5'],
          series: [20, 60, 180, 420, 850]
        }
      },
      {
        id: 'market-6', type: 'gauge', size: '2x2', accent: 'primary',
        data: {
          title: 'Market Penetration',
          value: 5,
          max: 100,
          unit: '%',
          label: 'Year 3 Target',
          description: 'Capturing 5% of SAM represents ₹180 Cr in annual revenue by Year 3'
        }
      },
      {
        id: 'market-7', type: 'deco.stats', size: '5x1', accent: 'secondary',
        data: {
          title: 'Market Assumptions',
          subtitle: 'Key drivers and constraints',
          metrics: [
            { label: 'Tier-2 Cities', value: '97 cities' },
            { label: 'Target Population', value: '180M people' },
            { label: 'Online Food Users', value: '24M (13%)' },
            { label: 'Avg Order Value', value: '₹350' }
          ]
        }
      },
      {
        id: 'market-8', type: 'chart.hbar', size: '2x2', accent: 'quaternary',
        data: {
          title: 'Competitive Market Share',
          subtitle: 'Tier-2 Cities (Current)',
          labels: ['Swiggy', 'Zomato', 'Local Players', 'Unorganized'],
          series: [35, 30, 15, 20],
          unit: '%'
        }
      }
    ]
  },
  swot: {
    id: 'swot',
    label: 'SWOT',
    subject: 'Food Delivery Startup',
    page_title: 'QuickBite - SWOT Analysis',
    chat_intro: "Strategic SWOT analysis identifying QuickBite's internal strengths and weaknesses, along with external opportunities and threats in the tier-2 food delivery market.",
    modules: [
      {
        id: 'swot-1', type: 'matrix.swot', size: '4x4', accent: 'primary',
        data: {
          title: 'SWOT Analysis Matrix',
          strengths: [
            'Proprietary 15-min delivery algorithm',
            'Exclusive home chef network',
            'Deep local partnerships in tier-2 cities',
            'Lower operational costs vs metro competitors',
            'Strong founding team with local expertise'
          ],
          weaknesses: [
            'Limited brand recognition',
            'Smaller delivery fleet',
            'Less capital than established players',
            'Technology platform still maturing',
            'Limited geographic coverage initially'
          ],
          opportunities: [
            'Untapped tier-2 market with 180M population',
            'Growing smartphone penetration (65% → 85%)',
            'Rising disposable income in tier-2 cities',
            'Competitor focus on metro markets',
            'Government digital India initiatives'
          ],
          threats: [
            'Swiggy/Zomato expansion to tier-2 cities',
            'Price wars from well-funded competitors',
            'Regulatory changes in gig economy',
            'Rising fuel and operational costs',
            'Customer loyalty to established brands'
          ]
        }
      },
      {
        id: 'swot-2', type: 'metric.kpi', size: '1x1', accent: 'quaternary',
        data: {
          title: 'STRENGTHS',
          value: '5',
          delta: 'Key advantages',
          direction: 'up',
          sparkline: [3, 4, 5, 5]
        }
      },
      {
        id: 'swot-3', type: 'metric.kpi', size: '1x1', accent: 'secondary',
        data: {
          title: 'WEAKNESSES',
          value: '5',
          delta: 'Areas to improve',
          direction: 'neutral',
          sparkline: [6, 5, 5, 5]
        }
      },
      {
        id: 'swot-4', type: 'metric.kpi', size: '1x1', accent: 'tertiary',
        data: {
          title: 'OPPORTUNITIES',
          value: '5',
          delta: 'Market potential',
          direction: 'up',
          sparkline: [3, 4, 5, 5]
        }
      },
      {
        id: 'swot-5', type: 'metric.kpi', size: '1x1', accent: 'primary',
        data: {
          title: 'THREATS',
          value: '5',
          delta: 'Risk factors',
          direction: 'down',
          sparkline: [4, 5, 5, 5]
        }
      },
      {
        id: 'swot-6', type: 'chart.radar', size: '2x2', accent: 'primary',
        data: {
          title: 'Competitive Positioning',
          subtitle: 'QuickBite vs Market Leaders',
          labels: ['Speed', 'Coverage', 'Price', 'Quality', 'Tech'],
          series: [95, 40, 85, 90, 70]
        }
      },
      {
        id: 'swot-7', type: 'chart.hbar', size: '3x2', accent: 'quaternary',
        data: {
          title: 'Strategic Priority Score',
          subtitle: 'Focus areas for next 12 months',
          labels: ['Fleet Expansion', 'Brand Building', 'Tech Platform', 'Chef Network', 'Fundraising'],
          series: [95, 85, 75, 90, 80],
          unit: ''
        }
      }
    ]
  },
  competitive: {
    id: 'competitive',
    label: 'Competition',
    subject: 'Food Delivery Startup',
    page_title: 'QuickBite - Competitive Analysis',
    chat_intro: "Competitive landscape analysis showing QuickBite's positioning against major players in the tier-2 food delivery market across key dimensions like price, speed, and market presence.",
    modules: [
      {
        id: 'comp-1', type: 'matrix.competitive', size: '4x3', accent: 'primary',
        data: {
          title: 'Competitive Positioning Matrix',
          subtitle: 'Price vs Speed Analysis',
          xAxisLabel: 'Price (Lower → Higher)',
          yAxisLabel: 'Delivery Speed (Slower → Faster)',
          sizeLabel: 'Market Share (%)',
          competitors: [
            {
              name: 'QuickBite',
              x: 35,
              y: 95,
              size: 5,
              color: '#FF6B35',
              description: 'Our position: Fast delivery, competitive pricing'
            },
            {
              name: 'Swiggy',
              x: 60,
              y: 65,
              size: 35,
              color: '#FC8019',
              description: 'Market leader with premium pricing'
            },
            {
              name: 'Zomato',
              x: 55,
              y: 60,
              size: 30,
              color: '#E23744',
              description: 'Strong brand, moderate speed'
            },
            {
              name: 'Local Players',
              x: 25,
              y: 40,
              size: 15,
              color: '#9CA3AF',
              description: 'Low cost but slower delivery'
            },
            {
              name: 'Dunzo',
              x: 70,
              y: 75,
              size: 8,
              color: '#0066FF',
              description: 'Fast but expensive'
            }
          ]
        }
      },
      {
        id: 'comp-2', type: 'metric.kpi', size: '1x1', accent: 'primary',
        data: {
          title: 'OUR POSITION',
          value: '#4',
          delta: 'Market rank',
          direction: 'up',
          sparkline: [6, 5, 4, 4]
        }
      },
      {
        id: 'comp-3', type: 'metric.kpi', size: '1x1', accent: 'secondary',
        data: {
          title: 'MARKET SHARE',
          value: '5%',
          delta: 'Tier-2 cities',
          direction: 'up',
          sparkline: [1, 2, 3, 5]
        }
      },
      {
        id: 'comp-4', type: 'metric.kpi', size: '1x1', accent: 'tertiary',
        data: {
          title: 'DELIVERY TIME',
          value: '15min',
          delta: 'Fastest',
          direction: 'up',
          sparkline: [25, 20, 17, 15]
        }
      },
      {
        id: 'comp-5', type: 'chart.hbar', size: '3x2', accent: 'primary',
        data: {
          title: 'Feature Comparison Score',
          subtitle: 'QuickBite vs Competitors (0-100)',
          labels: ['Delivery Speed', 'Pricing', 'App UX', 'Restaurant Variety', 'Customer Service'],
          series: [95, 85, 70, 60, 75],
          unit: ''
        }
      },
      {
        id: 'comp-6', type: 'table', size: '2x2', accent: 'secondary',
        data: {
          title: 'Head-to-Head Comparison',
          subtitle: 'Key metrics vs top competitors',
          columns: [
            { key: 'Metric', label: 'Metric' },
            { key: 'QuickBite', label: 'QuickBite' },
            { key: 'Swiggy', label: 'Swiggy' },
            { key: 'Zomato', label: 'Zomato' }
          ],
          rows: [
            { 'Metric': 'Avg Delivery', 'QuickBite': '15 min', 'Swiggy': '35 min', 'Zomato': '40 min' },
            { 'Metric': 'Delivery Fee', 'QuickBite': '₹20-40', 'Swiggy': '₹30-60', 'Zomato': '₹25-50' },
            { 'Metric': 'Commission', 'QuickBite': '15-18%', 'Swiggy': '20-25%', 'Zomato': '18-23%' },
            { 'Metric': 'Min Order', 'QuickBite': '₹99', 'Swiggy': '₹149', 'Zomato': '₹129' }
          ]
        }
      },
      {
        id: 'comp-7', type: 'deco.stats', size: '5x1', accent: 'quaternary',
        data: {
          title: 'Competitive Advantages',
          subtitle: 'What sets QuickBite apart',
          metrics: [
            { label: 'Delivery Speed', value: '2.3x faster' },
            { label: 'Home Chef Network', value: 'Exclusive' },
            { label: 'Tier-2 Focus', value: 'First mover' },
            { label: 'Local Partnerships', value: '500+ vendors' }
          ]
        }
      }
    ]
  },
  gtm: {
    id: 'gtm',
    label: 'Go-to-Market',
    subject: 'Food Delivery Startup',
    page_title: 'QuickBite - Go-to-Market Strategy',
    chat_intro: "QuickBite's comprehensive go-to-market strategy outlining the 7 crucial steps from target market identification to optimization and scaling in tier-2 Indian cities.",
    modules: [
      {
        id: 'gtm-1', type: 'strategy.gtm', size: '5x3', accent: 'primary',
        data: {
          title: 'Go-to-Market Strategy',
          steps: [
            {
              title: 'Identify Target Market',
              description: '',
              icon: 'https://api.iconify.design/lucide:target.svg?color=white&width=48&height=48',
              color: '#06B6D4',
              points: [
                'Tier-2 cities with 500K+ population',
                'Working professionals & students',
                'Smartphone penetration >65%',
                'Existing food delivery gaps'
              ]
            },
            {
              title: 'Define Value Proposition',
              description: '',
              icon: 'https://api.iconify.design/lucide:sparkles.svg?color=white&width=48&height=48',
              color: '#8B5CF6',
              points: [
                '15-minute delivery guarantee',
                'Home-cooked meal options',
                'Lower prices than metro competitors',
                'Support local economy'
              ]
            },
            {
              title: 'Set Clear Objectives',
              description: '',
              icon: 'https://api.iconify.design/lucide:clipboard-check.svg?color=white&width=48&height=48',
              color: '#F59E0B',
              points: [
                '10K users in first 6 months',
                '500+ restaurant partners',
                '₹5Cr GMV by Year 1',
                '15-min avg delivery time'
              ]
            },
            {
              title: 'Develop Marketing Plan',
              description: '',
              icon: 'https://api.iconify.design/lucide:megaphone.svg?color=white&width=48&height=48',
              color: '#EF4444',
              points: [
                'Local influencer partnerships',
                'College campus activations',
                'WhatsApp community marketing',
                'Referral rewards program'
              ]
            },
            {
              title: 'Build Sales Pipeline',
              description: '',
              icon: 'https://api.iconify.design/lucide:trending-up.svg?color=white&width=48&height=48',
              color: '#3B82F6',
              points: [
                'App download campaigns',
                'First-order discounts (50% off)',
                'Onboarding tutorial',
                'Push notification engagement'
              ]
            },
            {
              title: 'Develop Pricing Strategy',
              description: '',
              icon: 'https://api.iconify.design/lucide:dollar-sign.svg?color=white&width=48&height=48',
              color: '#10B981',
              points: [
                'Delivery fee: ₹20-40',
                'Zero commission for first month',
                'Subscription: ₹299/month',
                'Dynamic surge pricing'
              ]
            },
            {
              title: 'Measure & Optimize',
              description: '',
              icon: 'https://api.iconify.design/lucide:bar-chart-3.svg?color=white&width=48&height=48',
              color: '#EC4899',
              points: [
                'Track CAC, LTV, retention',
                'A/B test marketing channels',
                'Optimize delivery routes',
                'Improve app conversion rate'
              ]
            }
          ]
        }
      },
      {
        id: 'gtm-2', type: 'metric.kpi', size: '1x1', accent: 'primary',
        data: {
          title: 'TARGET CITIES',
          value: '15',
          delta: 'By Q2 2025',
          direction: 'up',
          sparkline: [3, 6, 10, 15]
        }
      },
      {
        id: 'gtm-3', type: 'metric.kpi', size: '1x1', accent: 'secondary',
        data: {
          title: 'CAC TARGET',
          value: '₹150',
          delta: 'Customer acquisition',
          direction: 'down',
          sparkline: [250, 200, 175, 150]
        }
      },
      {
        id: 'gtm-4', type: 'metric.kpi', size: '1x1', accent: 'tertiary',
        data: {
          title: 'CONVERSION',
          value: '12%',
          delta: 'App to order',
          direction: 'up',
          sparkline: [5, 8, 10, 12]
        }
      },
      {
        id: 'gtm-5', type: 'chart.area', size: '3x2', accent: 'quaternary',
        data: {
          title: 'Customer Acquisition Funnel',
          subtitle: 'Monthly progression',
          labels: ['Awareness', 'Interest', 'Download', 'First Order', 'Repeat'],
          series: [100000, 25000, 10000, 3000, 1500]
        }
      },
      {
        id: 'gtm-6', type: 'chart.hbar', size: '2x2', accent: 'primary',
        data: {
          title: 'Marketing Channel ROI',
          subtitle: 'Cost per acquisition by channel',
          labels: ['Referrals', 'Social Media', 'Influencers', 'Campus Events', 'Paid Ads'],
          series: [50, 120, 180, 200, 350],
          unit: '₹'
        }
      },
      {
        id: 'gtm-7', type: 'deco.stats', size: '5x1', accent: 'secondary',
        data: {
          title: 'Launch Metrics (First 90 Days)',
          subtitle: 'Target vs Actual',
          metrics: [
            { label: 'App Downloads', value: '15K / 10K' },
            { label: 'First Orders', value: '3.5K / 3K' },
            { label: 'Repeat Rate', value: '45% / 40%' },
            { label: 'Avg Order Value', value: '₹385 / ₹350' }
          ]
        }
      }
    ]
  },
  milestones: {
    id: 'milestones',
    label: 'Milestones',
    subject: 'Food Delivery Startup',
    page_title: 'QuickBite - Milestones & Roadmap',
    chat_intro: "QuickBite's journey from inception to scale, showing key milestones achieved and upcoming targets for growth in tier-2 Indian cities.",
    modules: [
      {
        id: 'mile-1', type: 'deco.timeline', size: '5x2', accent: 'primary',
        data: {
          title: 'QuickBite Growth Timeline',
          subtitle: 'Key milestones and future targets',
          points: [
            { year: 'Q1 2024', event: 'Company Founded', status: 'done' },
            { year: 'Q2 2024', event: 'Seed Funding ₹5Cr', status: 'done' },
            { year: 'Q3 2024', event: 'MVP Launch (3 cities)', status: 'done' },
            { year: 'Q4 2024', event: 'First 10K Users', status: 'done' },
            { year: 'Q1 2025', event: 'Expand to 15 Cities', status: 'active' },
            { year: 'Q3 2025', event: 'Series A ₹50Cr', status: 'pending' },
            { year: 'Q4 2025', event: '100K Daily Orders', status: 'pending' }
          ]
        }
      },
      {
        id: 'mile-2', type: 'metric.kpi', size: '1x1', accent: 'quaternary',
        data: {
          title: 'MILESTONES',
          value: '4/7',
          delta: 'Completed',
          direction: 'up',
          sparkline: [1, 2, 3, 4]
        }
      },
      {
        id: 'mile-3', type: 'metric.kpi', size: '1x1', accent: 'primary',
        data: {
          title: 'CURRENT PHASE',
          value: 'Growth',
          delta: 'Q1 2025',
          direction: 'up',
          sparkline: [10, 20, 35, 50]
        }
      },
      {
        id: 'mile-4', type: 'metric.kpi', size: '1x1', accent: 'secondary',
        data: {
          title: 'NEXT TARGET',
          value: 'Series A',
          delta: 'Q3 2025',
          direction: 'neutral',
          sparkline: [0, 0, 0, 0]
        }
      },
      {
        id: 'mile-5', type: 'chart.area', size: '3x2', accent: 'tertiary',
        data: {
          title: 'User Growth Trajectory',
          subtitle: 'Monthly Active Users',
          labels: ['Q1 24', 'Q2 24', 'Q3 24', 'Q4 24', 'Q1 25', 'Q2 25'],
          series: [0, 500, 3000, 10000, 25000, 50000]
        }
      },
      {
        id: 'mile-6', type: 'chart.hbar', size: '2x2', accent: 'quaternary',
        data: {
          title: 'Milestone Progress',
          subtitle: 'Completion status by category',
          labels: ['Product', 'Funding', 'Market', 'Team', 'Operations'],
          series: [80, 60, 70, 90, 75],
          unit: '%'
        }
      },
      {
        id: 'mile-7', type: 'deco.stats', size: '5x1', accent: 'primary',
        data: {
          title: 'Key Achievements',
          subtitle: 'Major milestones reached',
          metrics: [
            { label: 'Cities Live', value: '3' },
            { label: 'Restaurant Partners', value: '500+' },
            { label: 'Home Chefs', value: '150+' },
            { label: 'Delivery Partners', value: '200+' }
          ]
        }
      }
    ]
  },
  business_model: {
    id: 'business_model',
    label: 'Business Model',
    subject: 'Food Delivery Startup',
    page_title: 'QuickBite - Business Model Canvas',
    chat_intro: "QuickBite's business model canvas detailing value proposition, customer segments, revenue streams, and key partnerships for the tier-2 food delivery market.",
    modules: [
      {
        id: 'bmc-1', type: 'canvas.bmc', size: '5x4', accent: 'primary',
        data: {
          title: 'QuickBite Business Model Canvas',
          cells: [
            {
              section: 'Key Partners',
              points: [
                'Local restaurants & cloud kitchens',
                'Home chef network',
                'Delivery fleet partners (gig workers)',
                'Payment gateway providers',
                'Local influencers & community leaders'
              ]
            },
            {
              section: 'Key Activities',
              points: [
                'Platform development & maintenance',
                'Order fulfillment & delivery operations',
                'Restaurant & chef onboarding',
                'Marketing & customer acquisition',
                'Quality control & customer support'
              ]
            },
            {
              section: 'Key Resources',
              points: [
                'Technology platform (app & backend)',
                'Delivery fleet & logistics network',
                'Restaurant & chef partnerships',
                'Brand & local market presence',
                'Customer data & insights'
              ]
            },
            {
              section: 'Value Proposition',
              points: [
                '15-minute delivery guarantee',
                'Authentic home-cooked meals',
                'Wide variety from local restaurants',
                'Affordable pricing for tier-2 cities',
                'Support local economy & home chefs'
              ]
            },
            {
              section: 'Customer Relationships',
              points: [
                'Self-service mobile app',
                'WhatsApp ordering support',
                '24/7 customer service',
                'Loyalty rewards program',
                'Personalized recommendations'
              ]
            },
            {
              section: 'Channels',
              points: [
                'Mobile app (iOS & Android)',
                'WhatsApp Business',
                'Social media marketing',
                'Local influencer partnerships',
                'College campus activations'
              ]
            },
            {
              section: 'Customer Segments',
              points: [
                'Working professionals (25-40 years)',
                'College students',
                'Families seeking meal variety',
                'Health-conscious consumers',
                'Time-constrained individuals'
              ]
            },
            {
              section: 'Cost Structure',
              points: [
                'Delivery operations: 35%',
                'Technology & platform: 20%',
                'Marketing & customer acquisition: 25%',
                'Operations & support: 15%',
                'Admin & overhead: 5%'
              ]
            },
            {
              section: 'Revenue Streams',
              points: [
                'Delivery fees: ₹20-40 per order',
                'Restaurant commission: 18-22%',
                'Home chef commission: 15%',
                'Subscription plans: ₹299/month',
                'Advertising revenue from partners'
              ]
            }
          ]
        }
      },
      {
        id: 'bmc-2', type: 'metric.kpi', size: '1x1', accent: 'primary',
        data: {
          title: 'UNIT ECONOMICS',
          value: '₹45',
          delta: 'Profit/order',
          direction: 'up',
          sparkline: [20, 30, 38, 45]
        }
      },
      {
        id: 'bmc-3', type: 'metric.kpi', size: '1x1', accent: 'secondary',
        data: {
          title: 'CAC',
          value: '₹180',
          delta: 'Customer acquisition',
          direction: 'down',
          sparkline: [250, 220, 200, 180]
        }
      },
      {
        id: 'bmc-4', type: 'metric.kpi', size: '1x1', accent: 'tertiary',
        data: {
          title: 'LTV',
          value: '₹2,400',
          delta: 'Lifetime value',
          direction: 'up',
          sparkline: [1800, 2000, 2200, 2400]
        }
      },
      {
        id: 'bmc-5', type: 'metric.kpi', size: '1x1', accent: 'quaternary',
        data: {
          title: 'LTV:CAC',
          value: '13.3x',
          delta: 'Healthy ratio',
          direction: 'up',
          sparkline: [8, 10, 12, 13.3]
        }
      },
      {
        id: 'bmc-6', type: 'chart.pie', size: '2x2', accent: 'primary',
        data: {
          title: 'Revenue Mix',
          subtitle: 'By source',
          segments: [
            { label: 'Restaurant Commission', value: 55, color_key: 'primary' },
            { label: 'Delivery Fees', value: 30, color_key: 'secondary' },
            { label: 'Subscriptions', value: 10, color_key: 'tertiary' },
            { label: 'Advertising', value: 5, color_key: 'quaternary' }
          ]
        }
      },
      {
        id: 'bmc-7', type: 'chart.pie', size: '2x2', accent: 'secondary',
        data: {
          title: 'Cost Breakdown',
          subtitle: 'Operating expenses',
          segments: [
            { label: 'Delivery Operations', value: 35, color_key: 'primary' },
            { label: 'Marketing', value: 25, color_key: 'secondary' },
            { label: 'Technology', value: 20, color_key: 'tertiary' },
            { label: 'Operations', value: 15, color_key: 'quaternary' },
            { label: 'Admin', value: 5, color_key: 'primary' }
          ]
        }
      }
    ]
  },
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
  google_ : {
    id: 'google_market',
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
    subject: 'QuickBite - Food Delivery Startup',
    mode: 'startup',
    brand_color: '#FF6B35',
    colors: {
      primary: '#FF6B35',
      secondary: '#F7B801',
      tertiary: '#0496FF',
      quaternary: '#22C55E'
    },
    logo_initials: 'QB',
    page_title: 'QuickBite Analysis',
    page_subtitle: 'Hyperlocal food delivery for tier-2 Indian cities'
  },
  tabs: [
    { id: 'startup', label: 'Lean Canvas' },
    { id: 'market', label: 'Market Size' },
    { id: 'swot', label: 'SWOT' },
    { id: 'competitive', label: 'Competition' },
    { id: 'gtm', label: 'Go-to-Market' },
    { id: 'milestones', label: 'Milestones' },
    { id: 'business_model', label: 'Business Model' }
  ],
  chat_intro: dummyData.startup.chat_intro,
  modules: [
    ...dummyData.startup.modules.map(m => ({ ...m, tab: 'startup' })),
    ...dummyData.market.modules.map(m => ({ ...m, tab: 'market' })),
    ...dummyData.swot.modules.map(m => ({ ...m, tab: 'swot' })),
    ...dummyData.competitive.modules.map(m => ({ ...m, tab: 'competitive' })),
    ...dummyData.gtm.modules.map(m => ({ ...m, tab: 'gtm' })),
    ...dummyData.milestones.modules.map(m => ({ ...m, tab: 'milestones' })),
    ...dummyData.business_model.modules.map(m => ({ ...m, tab: 'business_model' }))
  ]
};
