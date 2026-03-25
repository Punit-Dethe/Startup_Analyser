# KORE Philosophy: Dynamic, Rationalized Dashboard Generation

**Date**: 2025-01-24  
**Status**: Core Design Principle

---

## The Fundamental Shift

### ❌ OLD APPROACH (Template-Based)
```
User Request → Apply Fixed Template → Generate 5 Tabs
```
- Always generates: Overview, Financials, Market, Business Model, Competitors
- Rigid structure regardless of request
- One-size-fits-all approach

### ✅ NEW APPROACH (Rationalized, Dynamic)
```
User Request → Understand & Rationalize → Decide Structure → Generate Custom Dashboard
```
- AI thinks about what the request actually needs
- Dynamic tab count (2-7 tabs)
- Dynamic tab names (descriptive, specific)
- Context-aware structure

---

## The Three-Step Thinking Process

### Step 1: UNDERSTAND
**Question**: What is the user really asking?

Examples:
- "Analyze Apple Inc" → Comprehensive business analysis
- "Compare Apple with Samsung" → Head-to-head comparison
- "Evaluate this startup idea" → Critical evaluation with risks
- "Deep dive into revenue model" → Focused financial analysis

### Step 2: RATIONALIZE
**Question**: What data and insights are needed to answer this fully?

Examples:
- Startup evaluation needs: market opportunity, unit economics, competitive landscape, risks, launch strategy
- Competitor comparison needs: side-by-side metrics, market share, product portfolio, financial comparison
- Revenue deep dive needs: revenue streams, pricing strategy, customer segments, growth drivers

### Step 3: DECIDE STRUCTURE
**Question**: How should this be organized and presented?

Decisions:
- How many tabs? (Whatever makes sense for the analysis)
- What should they be called? (Descriptive names, not generic)
- What modules go in each tab? (Follow 5x5 grid rule)
- What goes in chat vs dashboard? (Narrative vs visual)

---

## Dynamic Tab Creation

### Principle
**Tabs are NOT a fixed template. They are dynamic categories that emerge from the analysis.**

### Examples

#### Request: "Analyze Apple Inc"
**AI Thinking**: Comprehensive analysis → Standard business categories apply
**Tabs**: Overview, Financials, Market Position, Business Model, Competitive Landscape (5 tabs)

#### Request: "Compare Apple with Samsung and Google"
**AI Thinking**: Head-to-head comparison → Focus on comparative metrics
**Tabs**: Head-to-Head, Market Position, Product Portfolio, Financial Comparison (4 tabs)

#### Request: "Evaluate food delivery startup in India"
**AI Thinking**: Startup evaluation → Need market, economics, risks, strategy
**Tabs**: Market Opportunity, Unit Economics, Competitive Landscape, Risk Assessment, Launch Strategy (5 tabs)

#### Request: "Deep dive into Apple's revenue model"
**AI Thinking**: Focused on revenue → Only revenue-related analysis
**Tabs**: Revenue Streams, Pricing Strategy, Growth Drivers (3 tabs)

---

## Chat vs Dashboard: Two Presentation Mediums

### Dashboard Modules
**Use for**: Quantitative, visual data
- Charts (trends, comparisons, distributions)
- Tables (structured data, rankings)
- Gauges (progress, thresholds)
- KPIs (key metrics)

### Chat Interface
**Use for**: Qualitative, narrative content
- Strategic analysis and recommendations
- Detailed critiques and evaluations
- Pros/cons lists, SWOT analysis
- Case studies and examples
- Complex reasoning that doesn't fit in modules
- Any content better read than visualized

**Key Insight**: The chat_intro is NOT just an introduction. It's a full analytical document (500-2000 words) that complements the dashboard.

---

## The Two States

### State 1: CHAT
**When**: User asks questions about existing dashboard
**Behavior**: Answer in chat using full markdown/HTML capabilities
**No dashboard changes**

### State 2: NEW_DASHBOARD
**When**: User wants different analysis requiring new structure
**Behavior**: Generate completely new dashboard with dynamic structure
**Examples**:
- "Compare with competitors"
- "Deep dive into revenue"
- "Evaluate this business idea"
- "Analyze different company"

**Removed States**:
- ❌ REFRESH (deprecated - chat can handle everything)
- ❌ RELOAD (replaced by NEW_DASHBOARD)

---

## The 5x5 Grid Rule (Still Applies)

**Every tab MUST fill exactly 25 cells (5 columns × 5 rows) - NO GAPS ALLOWED**

This is the ONLY rigid constraint. Everything else is dynamic.

**How to achieve 100% fill:**
- Calculate module areas as you go (width × height)
- Use filler blocks with rationalized data to fill remaining space
- `1x1` KPI modules are perfect for small gaps
- Think: "What additional context would be valuable here?"

**NO TEMPLATES:**
- Don't follow fixed layout patterns
- Choose sizes based on data importance
- Every tab can have a different layout
- Use filler blocks strategically

---

## Key Principles Summary

1. **No Fixed Templates**: Don't default to generic 5-tab structure
2. **Rationalize First**: Understand request before deciding structure
3. **Dynamic Tabs**: Create 2-7 tabs with descriptive names
4. **Context-Aware**: Structure matches the specific request
5. **Chat as Medium**: Use chat for narrative, dashboard for visual
6. **5x5 Grid**: Only rigid rule - every tab fills 25 cells exactly

---

## Implementation Impact

### Frontend Changes
- Remove REFRESH action handling
- Rename RELOAD to NEW_DASHBOARD
- Update ChatResponse types
- No other major changes needed

### Backend Changes
- Update generation prompt (emphasize dynamic thinking)
- Update chat prompt (two actions only)
- Remove REFRESH logic from n8n
- Ensure Gemini understands dynamic tab creation

### User Experience
- More relevant dashboards
- Less redundant information
- Better focused analysis
- Richer chat content

---

**This is the core philosophy that drives all KORE design decisions.**
