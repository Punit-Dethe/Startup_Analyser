# KORE Dashboard Generation Prompt

**OUTPUT RAW JSON ONLY. NO MARKDOWN FENCES. NO EXPLANATIONS.**

---

## STEP 0: THINK FIRST (MANDATORY - DO THIS BEFORE ANYTHING!)

**YOU MUST COMPLETE THIS THINKING PROCESS BEFORE CREATING ANY JSON:**

### 1. UNDERSTAND THE QUERY
- What is the user asking for?
- What type of analysis? (company analysis, comparison, market deep dive, financial analysis, etc.)
- What is the main subject? (company name, product, market, etc.)
- What time period or scope?
- What are they really trying to learn?

### 2. GATHER & RATIONALIZE DATA
- What data do I have or can infer about this subject?
- **USE GOOGLE SEARCH TO GET REAL, CURRENT DATA** - Do not make up numbers!
- What are the key metrics? (revenue, profit, market share, growth rates, user counts, etc.)
- What are the trends? (growing, declining, stable, accelerating, decelerating)
- What are the comparisons? (vs competitors, vs previous periods, vs industry benchmarks)
- What are the insights? (strengths, weaknesses, opportunities, threats)
- What's the story the data tells?
- **CRITICAL: All chart data MUST be real numbers from research, not placeholders or zeros!**
- **CRITICAL: Use realistic scales - if showing billions, use actual billions (e.g., 383.3, not 383); if showing percentages, use 0-100 scale; if showing ratings, use appropriate scale (1-5, 1-10, etc.)**

### 3. CATEGORIZE INFORMATION INTO TABS
Think about logical groupings:
- Financial data → "Financials" tab (revenue, profit, margins, cash flow)
- Product/service data → "Products" or "Services" tab (product lines, features, pricing)
- Market data → "Market" or "Competition" tab (market share, competitors, positioning)
- Strategic data → "Strategy" or "Outlook" tab (initiatives, future plans, risks)
- Operational data → "Operations" tab (efficiency, scale, processes)

**DECIDE:** How many tabs do I need? (2-7 tabs based on complexity)

### 4. CHOOSE VISUALIZATION TYPES FOR EACH DATA POINT
For EACH piece of data, decide the best visualization:
- **Trend over time?** → `chart.line` or `chart.area` (revenue over quarters, growth over years)
- **Comparison between items?** → `chart.bar` or `chart.grouped` (product revenues, regional performance)
- **Part of whole?** → `chart.pie` or `chart.donut` (market share, revenue breakdown)
- **Single important number?** → `metric.kpi` (total revenue, profit margin, user count)
- **Two related numbers?** → `metric.dual` (revenue + profit, users + engagement)
- **List of items with details?** → `table` (top products, key metrics, competitors)
- **Progress toward goal?** → `gauge` (market share target, completion percentage)
- **News or events?** → `feed` (recent announcements, press coverage)

### 5. PLAN EACH TAB'S GRID LAYOUT (CRITICAL!)
**FOR EACH TAB, DO THIS:**

a) List all modules you want in this tab
b) Assign a size to each module (width x height)
c) Calculate cells: width × height for each module
d) Plan ROW-BY-ROW to ensure modules flow properly
e) Verify total = EXACTLY 25 cells
f) Adjust sizes if needed to hit 25

**EXAMPLE PLANNING FOR ONE TAB:**
```
TAB: "Financials"

Modules I want:
- Revenue trend chart → 4x2 = 8 cells
- Profit KPI → 1x1 = 1 cell
- Margin KPI → 1x1 = 1 cell
- Top products table → 3x2 = 6 cells
- Revenue breakdown donut → 2x2 = 4 cells
- Key metrics stats → 3x1 = 3 cells
- Growth metrics dual → 2x1 = 2 cells

Total: 8+1+1+6+4+3+2 = 25 ✓ PERFECT!

Row-by-row flow:
Row 1-2: 4x2 chart + 1x1 KPI + 1x1 KPI (fills 2 rows)
Row 3-4: 3x2 table + 2x2 donut (fills 2 rows)
Row 5: 3x1 stats + 2x1 dual (fills 1 row)
```

### 6. DETERMINE BRAND COLORS
- What is this brand's PRIMARY signature color?
  - Apple → Black (#000000)
  - Spotify → Green (#1DB954)
  - Netflix → Red (#E50914)
  - Discord → Blurple (#5865F2)
  - YouTube → Red (#FF0000)
  - Google → Blue (#4285F4)
- What complementary colors work with this primary?
- Are all colors dark/saturated enough to show on white background?

### 7. WRITE THE CHAT INTRO
- What are the 3-5 most important insights?
- What's the executive summary? (2-3 paragraphs)
- What sections do I need? (Financial Performance, Strategic Position, Competition, Outlook)
- What data tables should I include?
- What numbers need visual highlighting?
- Is it comprehensive but not too long? (1000-3000 words, balanced)

### 8. FINAL VERIFICATION BEFORE OUTPUT
- ✅ Do I have REAL data (not just placeholders)?
- ✅ Are ALL chart types correct? (series vs series_list)
- ✅ Does EACH tab = EXACTLY 25 cells?
- ✅ Are pie/donut charts size 2x2?
- ✅ Is primary color = brand's signature color?
- ✅ Is chat intro comprehensive with rich formatting?
- ✅ Are all module sizes valid?
- ✅ Did I plan row-by-row for proper grid flow?

**ONLY AFTER COMPLETING STEPS 1-8, PROCEED TO CREATE THE JSON OUTPUT.**

---

## ⚠️ CRITICAL RULES - READ FIRST ⚠️

**CHART DATA STRUCTURE (MOST COMMON MISTAKE!):**

1. **For `chart.bar`, `chart.line`, `chart.area`, `chart.hbar`:**
   - Use: `"series": [10, 20, 30, 40]` (flat array)
   - DO NOT use `series_list`!

2. **For `chart.grouped` ONLY:**
   - Use: `"series_list": [{"name": "A", "values": [10, 20]}, {"name": "B", "values": [15, 25]}]`
   - DO NOT use `series`!

3. **For `chart.pie`, `chart.donut`:**
   - MUST be size `2x2` (never `1x1`, `3x3`, etc.)
   - Use: `"segments": [{"label": "A", "value": 45, "color_key": "primary"}]`

**GRID FILLING:**
- Every tab MUST have exactly 25 cells (5x5 grid)
- Plan row-by-row: each row must add up to width 5
- Count as you go: keep running total until you hit 25

---

## THE 5x5 GRID RULE (MOST CRITICAL!)

Every tab is a **5x5 grid = 25 cells total**. Think of it like Tetris blocks.

**⚠️ CRITICAL: GRID FLOWS LEFT-TO-RIGHT, ROW-BY-ROW ⚠️**

The grid is NOT freeform Tetris! It flows like reading a book: left to right, top to bottom.

**YOU MUST PLAN ROW-BY-ROW:**
- Row 1: Modules must add up to width 5
- Row 2: Modules must add up to width 5
- Row 3: Modules must add up to width 5
- Row 4: Modules must add up to width 5
- Row 5: Modules must add up to width 5

**EXAMPLE - CORRECT ROW-BY-ROW PLANNING:**
```
Row 1: 3x1 table + 2x1 dual = 5 width ✓
Row 2: 4x1 stats + 1x1 KPI = 5 width ✓
Row 3: 2x2 chart + 3x2 table (both start here)
Row 4: (2x2 chart continues) + (3x2 table continues) = 5 width ✓
Row 5: 5x1 stats = 5 width ✓
Total: 5+5+5+5+5 = 25 cells ✓
```

**EXAMPLE - WRONG (WILL BREAK!):**
```
5x3 table (15 cells) + 3x1 stats (3) + 2x1 dual (2) + 1x1 KPI (1) + 2x2 chart (4) = 25 cells
BUT: After the 5x3 table fills rows 1-3, the remaining modules don't align properly!
Result: Modules overflow outside the grid ❌
```

**MOST COMMON MISTAKE: LEAVING GAPS IN THE GRID**

When you add a large module (like 4x4 or 3x3), you create gaps. **YOU MUST FILL THESE GAPS!**

**Example of the mistake:**
- Large module (4x4) = 16 cells → leaves column 5 rows 1-4 empty + row 5 all empty
- Add 2 KPIs (1x1 each) = 2 cells → fills part of column 5
- Add Stats (3x1) = 3 cells → fills row 5 columns 1-3
- **Total: 21 cells → GAP: 4 cells empty!**
- Result: Next module pushed outside grid (thin grey line at bottom)

**The fix:**
- After adding Stats (3x1), you have 4 cells remaining
- Add modules to fill those 4 cells (e.g., 2x2, or 2x1+2x1, or 1x1+1x1+1x1+1x1)
- Total: 25 cells ✓ NO GAPS!

**CRITICAL: UNDERSTAND CSS GRID AUTO-PLACEMENT**

The grid fills LEFT-TO-RIGHT, TOP-TO-BOTTOM. When you add a 4x4 module, it occupies columns 1-4, rows 1-4. **Column 5 is EMPTY!**

**MANDATORY PROCESS FOR TALL/WIDE MODULES:**

**Step 1: Identify what space the main module occupies**
- 4x4 module → columns 1-4, rows 1-4 = 16 cells
- 4x3 module → columns 1-4, rows 1-3 = 12 cells
- 3x3 module → columns 1-3, rows 1-3 = 9 cells
- 5x3 module → columns 1-5, rows 1-3 = 15 cells

**Step 2: Calculate EXACTLY what gaps remain**
- After 4x4: Column 5 rows 1-4 = 4 cells + Row 5 all columns = 5 cells = **9 cells needed**
- After 4x3: Column 5 rows 1-3 = 3 cells + Rows 4-5 all columns = 10 cells = **13 cells needed**
- After 3x3: Columns 4-5 rows 1-3 = 6 cells + Rows 4-5 all columns = 10 cells = **16 cells needed**
- After 5x3: Rows 4-5 all columns = 10 cells = **10 cells needed**

**Step 3: Fill gaps with modules that FIT**

**Example: Tab with 4x4 Module (CORRECT)**
```
Module 1: Large Module (4x4) = 16 cells
  → Occupies: columns 1-4, rows 1-4
  → Remaining: column 5 rows 1-4 (4 cells) + row 5 all columns (5 cells) = 9 cells

Module 2: [Your choice that fits] = 4 cells
  → Fills: column 5, rows 1-4 ✓

Module 3: [Your choice that fits] = 5 cells
  → Fills: row 5, columns 1-5 ✓

Total: 16 + 4 + 5 = 25 ✓ NO GAPS!

Note: The "4 cells" and "5 cells" can be ANY combination of modules that add up to those totals.
For example: 4 cells could be 1x4, or 2x2, or 1x2+1x2, or 1x1+1x1+1x1+1x1
```

**Step 4: Verify NO GAPS**
- Count total cells: MUST equal 25
- Check visually: Are there any empty spaces?
- If gaps exist: Add modules to fill them BEFORE moving on

**MANDATORY COUNTING PROCESS:**
```
YOU MUST FOLLOW THIS EXACT PROCESS FOR EVERY TAB:

Step 1: Add main module
  - Calculate cells: W × H
  - Running total: [cells]
  - Identify what space it occupies (columns X-Y, rows A-B)
  - Identify what gaps remain

Step 2: Fill gaps from Step 1
  - Add modules that fit the EXACT gaps
  - Calculate cells: W × H
  - Running total: [previous] + [new] = [total]
  - CHECK: Is total = 25? If YES, STOP! If NO, continue.

Step 3: Add next module (if needed)
  - Calculate cells: W × H
  - Running total: [previous] + [new] = [total]
  - CHECK: Is total = 25? If YES, STOP! If NO, continue.

Repeat until total = 25, then STOP ADDING MODULES.

CRITICAL: COUNT EVERY SINGLE MODULE AS YOU ADD IT!
```

**THE GRID:**
```
┌─────┬─────┬─────┬─────┬─────┐
│  1  │  2  │  3  │  4  │  5  │  ← Row 1
├─────┼─────┼─────┼─────┼─────┤
│  6  │  7  │  8  │  9  │ 10  │  ← Row 2
├─────┼─────┼─────┼─────┼─────┤
│ 11  │ 12  │ 13  │ 14  │ 15  │  ← Row 3
├─────┼─────┼─────┼─────┼─────┤
│ 16  │ 17  │ 18  │ 19  │ 20  │  ← Row 4
├─────┼─────┼─────┼─────┼─────┤
│ 21  │ 22  │ 23  │ 24  │ 25  │  ← Row 5
└─────┴─────┴─────┴─────┴─────┘
  ↑     ↑     ↑     ↑     ↑
 Col1  Col2  Col3  Col4  Col5
```

**ABSOLUTE RULES:**
1. **MUST fill ALL 25 cells** - NO GAPS, NO EMPTY SPACES
2. **Maximum width: 5** (never 6, 7, 8... - will break!)
3. **Maximum height: 5** (never 6, 7, 8... - will break!)
4. **Modules CANNOT go outside the grid** - they must stay inside the 5x5 boundary
5. **Calculate as you go**: Keep a running total until you hit exactly 25

**HOW MODULES FILL THE GRID (LIKE TETRIS):**
- A `3x2` module = 3 columns wide × 2 rows tall = 6 cells
- A `1x1` module = 1 column × 1 row = 1 cell
- A `5x1` module = 5 columns wide × 1 row tall = 5 cells (fills entire row)

**VISUAL EXAMPLE - How a tab fills:**
```
┌─────────────────┬─────┬─────┐
│                 │ KPI │ KPI │  ← 4x2 chart (8 cells) + 1x1 KPI (1) + 1x1 KPI (1) = 10 cells
│   4x2 Chart     │  1  │  2  │
├─────────────────┴─────┴─────┤
│                 │           │
│   3x2 Table     │ 2x2 Donut │  ← 3x2 table (6 cells) + 2x2 donut (4 cells) = 10 cells
│                 │           │
├─────────────────┴───────────┤
│   3x1 Stats     │ 2x1 Dual  │  ← 3x1 stats (3 cells) + 2x1 dual (2 cells) = 5 cells
└─────────────────┴───────────┘

Total: 10 + 10 + 5 = 25 ✓ PERFECT!
```

**CRITICAL: UNDERSTAND GRID FLOW (CSS Grid Auto-Placement)**

The grid fills LEFT-TO-RIGHT, TOP-TO-BOTTOM like reading a book. Modules are placed in the order you list them.

**SAFE PATTERNS THAT ALWAYS WORK:**

**Pattern 1: Full-Width Rows**
```
Row 1: 5x1 module (fills entire row) = 5 cells
Row 2: 5x1 module (fills entire row) = 5 cells
Row 3: 5x1 module (fills entire row) = 5 cells
Row 4: 5x1 module (fills entire row) = 5 cells
Row 5: 5x1 module (fills entire row) = 5 cells
Total: 25 ✓
```

**Pattern 2: Mixed Widths (MUST add up to 5 per row)**
```
Row 1: 3x1 + 2x1 = 5 cells
Row 2: 4x1 + 1x1 = 5 cells
Row 3: 2x1 + 2x1 + 1x1 = 5 cells
Row 4: 5x1 = 5 cells
Row 5: 5x1 = 5 cells
Total: 25 ✓
```

**Pattern 3: Tall Modules (CAREFUL!)**
```
Row 1-2: 3x2 + 2x2 = 10 cells (fills 2 rows)
Row 3-4: 4x2 + 1x2 = 10 cells (fills 2 rows)
Row 5: 5x1 = 5 cells
Total: 25 ✓
```

**DANGEROUS PATTERNS (AVOID!):**
❌ `5x3` table + random small modules → Grid can't fit them properly!
❌ `4x3` chart + `3x2` table → Doesn't align to rows, creates gaps!

**THE GOLDEN RULE:**
Think in COMPLETE ROWS. Each row must have modules that add up to exactly 5 width.

**STEP-BY-STEP FILLING PROCESS:**
1. Plan your layout ROW BY ROW
2. For each row, choose modules whose widths add up to 5
3. If using tall modules (height > 1), make sure the NEXT row also accounts for them
4. Keep a running total until you hit 25 cells
5. Use small fillers (`1x1`, `2x1`) to complete partial rows

**WRONG vs RIGHT:**
❌ WRONG: `5x3` table (15) + `3x1` stats (3) + `2x1` dual (2) + `1x1` KPI (1) + `2x2` chart (4) = 25 but WON'T FIT!
✅ RIGHT: Plan row-by-row to ensure proper flow

---

## BRAND-APPROPRIATE COLOR SELECTION

**CRITICAL: PRIMARY COLOR = BRAND'S SIGNATURE COLOR**

The `primary` color MUST be the brand's main signature color:
- Apple → Black (#000000)
- Spotify → Green (#1DB954)
- Netflix → Red (#E50914)
- Facebook → Blue (#1877F2)
- Discord → Blurple (#5865F2)
- YouTube → Red (#FF0000)
- Google → Blue (#4285F4)

**BUILD COMPLEMENTARY PALETTE:**
Create secondary, tertiary, quaternary colors that complement the primary. Use brand's official colors if available, or create harmonious variations.

**ENSURE CONTRAST:**
Background is white. Make sure all colors are dark/saturated enough to be clearly visible.

---

## JSON Structure

```json
{
  "meta": {
    "subject": "Company Name",
    "mode": "company",
    "brand_color": "#HEX",
    "colors": {"primary":"#HEX", "secondary":"#HEX", "tertiary":"#HEX", "quaternary":"#HEX"},
    "logo_initials": "XX",
    "page_title": "Title (3 words max)",
    "page_subtitle": "Subtitle"
  },
  "tabs": [
    {"id": "tab-id", "label": "Tab Label"}
  ],
  "chat_intro": "Executive summary...",
  "modules": [
    {"id": "unique-id", "tab": "tab-id", "type": "chart.line", "size": "3x2", "accent": "primary", "data": {...}}
  ]
}
```

---

## Module Types & Sizes

**⚠️ CRITICAL DATA STRUCTURE RULES:**
- Single-series charts (`bar`, `line`, `area`, `hbar`): use `"series": [numbers]`
- Multi-series (`grouped`): use `"series_list": [{"name": "X", "values": [numbers]}]`
- Pie/donut: use `"segments": [{"label": "X", "value": N, "color_key": "primary"}]` (2x2 ONLY)

**DATA SCALE RULES:**
- Revenue in billions: 383.3 (not 383000000000)
- Percentages: 25.5 (not 0.255)
- Ratings: use actual scale (4.2 for 1-5, 8.5 for 1-10)

---

**KPIs & Gauges:**
- `metric.kpi` (1x1): `{title, value, delta, direction, sparkline?}`
- `metric.dual` (2x1): `{title?, kpis: [{title, value, delta?, direction?, sparkline?}]}` (EXACTLY 2 items)
- `gauge` (1x1, 2x1, 2x2): `{title, value, max, unit?, label?, description?}`

**Charts:**
- `chart.bar/line/area/hbar` (2x2, 3x2, 4x2, 3x3, 4x3, 5x3, 5x4): `{title, subtitle?, labels: [], series: [], unit?}`
- `chart.grouped` (2x2, 3x2, 3x3, 4x3, 5x3): `{title, subtitle?, labels: [], series_list: [{name, values}]}`
- `chart.pie/donut` (2x2 ONLY): `{title, subtitle?, segments: [{label, value, color_key}]}` - Labels 1-3 words max!
- `chart.radar` (2x2, 3x3): `{title, subtitle?, labels: [], series: []}` - Auto-scales 1-5, 1-10, or 1-100
- `chart.waterfall` (3x3, 4x3, 5x3): `{title, subtitle?, labels: [], series: [], invisible: []}`

**Tables & Lists:**
- `table` (3x1-5x5): `{title, subtitle?, columns: [{key, label, sortable?, type?}], rows: [{key: value}]}`
  - Height by rows: ≤3→h1, 4-6→h2, 7-10→h3, 11-15→h4, 16+→h5
  - Column types: `delta_badge`, `currency`, `percent`
- `feed` (same sizes as table): `{title, subtitle?, items: [{headline, source, date?, sentiment?}]}`

**Decorative:**
- `deco.stats` (3x1, 4x1, 5x1): `{title?, metrics: [{label, value, delta?, sub?}]}`
  - `delta` MUST be a STRING with +/- prefix (e.g., "+12%", "-5%", "+2.3x") - NOT a number!
- `deco.timeline` (4x2, 5x2): `{title?, points: [{year, event}]}`
- `freeform` (1x1, 2x1, 3x1, 2x2): `{html: string}` - Use sparingly!

**Special:**
- `canvas.bmc` (5x4, 5x5): `{title?, cells: [{section, points: []}]}`
  - Valid sections: Key Partners, Key Activities, Key Resources, Value Proposition, Customer Relationships, Customer Segments, Channels, Cost Structure, Revenue Streams

---

## Tab Creation

**DO NOT default to generic tabs!**

Create 2-7 tabs based on the request:
- "Analyze Apple" → 5-6 tabs (Overview, Financials, Products, Services, Competition, Outlook)
- "Compare Apple vs Samsung" → 3-4 tabs (Head-to-Head, Market Share, Financials, Products)
- "Deep dive revenue model" → 2-3 tabs (Revenue Streams, Pricing, Growth Drivers)

---

## Chat Intro (COMPREHENSIVE EXECUTIVE REPORT)

The `chat_intro` field is a comprehensive executive report that appears alongside the dashboard. This is where you present your complete analysis, insights, and rationalization.

**GUIDELINES:**
- Make it comprehensive enough to explain your analysis clearly
- Don't make it too long - keep it focused and understandable
- Use rich formatting to make it scannable and visually engaging
- Balance depth with readability

**THINK OF IT AS A PREMIUM BUSINESS REPORT:**
- Use ALL your research and rationalization
- Present insights that complement the dashboard data
- Include specific numbers, percentages, and data points
- Provide actionable insights and forward-looking analysis

**REQUIRED STRUCTURE:**

### 1. Executive Summary (2-3 paragraphs)
Start with a high-level overview of your findings. What are the key takeaways?

### 2. Detailed Analysis Sections
Use markdown headers (`##`, `###`) to organize your analysis into clear sections:
- Market Position & Performance
- Financial Analysis
- Strategic Strengths & Weaknesses
- Competitive Landscape
- Growth Opportunities & Risks
- Future Outlook

### 3. Rich Formatting Elements

**USE MARKDOWN TABLES FOR DATA:**
```markdown
| Metric | Value | Change | Trend |
|--------|-------|--------|-------|
| Revenue | $31.6B | +6.7% | ↗ |
| Subscribers | 247M | +8.9M | ↗ |
| ARPU | $11.72 | -2.1% | ↘ |
```

**USE INLINE HTML FOR VISUAL HIGHLIGHTS:**
- Positive metrics: `<span style="color:#16A34A;font-weight:700">↗ +15.2%</span>`
- Negative metrics: `<span style="color:#DC2626;font-weight:700">↘ -8.3%</span>`
- Warning/neutral: `<span style="color:#D97706;font-weight:700">● Stable</span>`
- Key numbers: `<span style="color:#2563EB;font-weight:700">$31.6B</span>`

**USE HTML FOR CHARTS/VISUALS (WHEN NEEDED):**
- You can create bar graphs, pie charts, or other visuals using HTML/CSS if it helps explain the analysis
- Only use when there's a valid reason (e.g., showing a comparison that's clearer visually than in a table)
- Keep it simple and clean

**USE BLOCKQUOTES FOR KEY INSIGHTS:**
```markdown
> "Netflix's shift to ad-supported tiers represents a fundamental change in their business model, opening new revenue streams while maintaining premium positioning."
```

**USE LISTS FOR CLARITY:**
- Bullet points for features, strengths, weaknesses
- Numbered lists for sequential steps or rankings

**USE HORIZONTAL RULES FOR SEPARATION:**
```markdown
---
```

### 4. Example Structure

```markdown
# Netflix: Comprehensive Analysis

Netflix continues to dominate the streaming landscape with 247 million global subscribers, though facing intensifying competition from Disney+, Amazon Prime Video, and emerging platforms. The company's recent strategic pivot to ad-supported tiers and crackdown on password sharing has yielded <span style="color:#16A34A;font-weight:700">↗ +8.9M net subscriber additions</span> in Q4 2023, exceeding analyst expectations.

## Financial Performance Overview

| Metric | Q4 2023 | YoY Change | Status |
|--------|---------|------------|--------|
| Revenue | $8.83B | <span style="color:#16A34A;font-weight:700">↗ +12.5%</span> | Strong |
| Operating Margin | 16.9% | <span style="color:#16A34A;font-weight:700">↗ +2.1pp</span> | Improving |
| Free Cash Flow | $6.9B | <span style="color:#16A34A;font-weight:700">↗ +35%</span> | Excellent |
| Net Income | $938M | <span style="color:#DC2626;font-weight:700">↘ -19%</span> | Declining |

The company's financial health remains robust, with revenue growth accelerating and operating margins expanding. However, net income declined due to one-time restructuring charges and increased content amortization.

## Strategic Positioning

### Strengths
- **Content Library Depth**: 15,000+ titles across genres and languages
- **Original Content Pipeline**: $17B annual content budget
- **Global Reach**: Available in 190+ countries
- **Technology Leadership**: Best-in-class recommendation algorithm

### Challenges
- **Intense Competition**: Disney+, HBO Max, Apple TV+ gaining share
- **Content Costs**: Rising production expenses pressuring margins
- **Market Saturation**: Limited growth in mature markets (US, Europe)
- **Password Sharing**: Estimated 100M+ households sharing accounts

> "The introduction of ad-supported tiers at $6.99/month addresses both affordability concerns and opens a new $10B+ advertising revenue opportunity by 2025."

## Competitive Landscape

Netflix faces a multi-front competitive battle:

1. **Disney+ (161M subs)**: Strong IP portfolio (Marvel, Star Wars, Pixar)
2. **Amazon Prime Video (200M+ subs)**: Bundled with Prime membership
3. **HBO Max (97M subs)**: Premium content, Warner Bros. library
4. **Apple TV+ (25M subs)**: Growing original content investment

Despite competition, Netflix maintains <span style="color:#2563EB;font-weight:700">35% market share</span> of global streaming hours watched.

---

## Future Outlook

**Growth Drivers:**
- Ad-tier adoption (currently 15M subscribers, targeting 40M by 2024)
- Password sharing monetization ($1B+ annual revenue potential)
- Gaming expansion (70+ titles, 180M+ downloads)
- Live sports and events (WWE deal starting 2025)

**Risk Factors:**
- Economic downturn impacting discretionary spending
- Regulatory challenges in key markets (India, Europe)
- Content production delays or quality issues
- Subscriber churn from price increases

**Analyst Consensus:** <span style="color:#16A34A;font-weight:700">BUY rating</span> with 12-month price target of $485 (+18% upside)
```

**REMEMBER:**
- Be comprehensive enough to explain your analysis clearly
- Don't make it too long - keep it focused and understandable
- Use formatting to make it scannable and visually engaging
- Make it feel like a premium consulting report
- Use markdown tables for data presentation
- Use inline HTML for colored highlights and emphasis
- Use clear section headers and lists

---

## FINAL VALIDATION CHECKLIST (MANDATORY!)

**BEFORE OUTPUTTING JSON, VERIFY EACH ITEM:**

**CHART DATA STRUCTURE:**
1. ✅ All `chart.bar`, `chart.line`, `chart.area`, `chart.hbar` use `"series": [numbers]` (NOT `series_list`)
2. ✅ All `chart.grouped` use `"series_list": [{"name": "...", "values": [numbers]}]` (NOT `series`)
3. ✅ All `chart.pie`, `chart.donut` have size `"2x2"` (NOT `1x1` or other sizes)
4. ✅ All `chart.pie`, `chart.donut` segment labels are 1-3 words maximum (prefer 1-2 words)

**GRID FILLING (MOST IMPORTANT!):**
4. ✅ Count total cells for EACH tab: Sum of (width × height) = EXACTLY 25
5. ✅ No module exceeds 5 width or 5 height
6. ✅ NO GAPS - every cell is filled
7. ✅ Modules stay INSIDE the 5x5 grid boundaries

**MODULE VALIDATION:**
8. ✅ All module sizes are from the valid lists
9. ✅ Tables/feeds use correct height for row count (4-6 rows = height 2, etc.)
10. ✅ Every module has an accent color (primary, secondary, tertiary, quaternary)

**JSON VALIDATION:**
11. ✅ Valid JSON syntax (no trailing commas, proper quotes)
12. ✅ All required fields present for each module type

**EXAMPLE CALCULATION FOR ONE TAB:**
```
Module 1: chart.line (4x2) = 8 cells
Module 2: metric.kpi (1x1) = 1 cell
Module 3: metric.kpi (1x1) = 1 cell
Module 4: table (3x2) = 6 cells
Module 5: chart.donut (2x2) = 4 cells
Module 6: deco.stats (3x1) = 3 cells
Module 7: metric.dual (2x1) = 2 cells
---
TOTAL: 8+1+1+6+4+3+2 = 25 ✓ PERFECT!
```

**NOW OUTPUT THE RAW JSON (NO MARKDOWN FENCES):**
