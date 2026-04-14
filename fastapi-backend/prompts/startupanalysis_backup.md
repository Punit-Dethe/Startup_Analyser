# KORE Startup Analysis Generation Prompt

**OUTPUT RAW JSON ONLY. NO MARKDOWN FENCES. NO EXPLANATIONS.**

**THIS PROMPT IS SPECIFICALLY FOR STARTUP ANALYSIS - NOT GENERAL COMPANY ANALYSIS**

---

## STEP 0: THINK FIRST (MANDATORY - DO THIS BEFORE ANYTHING!)

**YOU MUST COMPLETE THIS THINKING PROCESS BEFORE CREATING ANY JSON:**

### 1. UNDERSTAND THE STARTUP IDEA
- What is the startup idea or business concept?
- What problem does it solve?
- Who are the target customers?
- What is the business model?
- What stage is the startup at? (idea, MVP, early traction, growth)
- What are they really trying to validate or understand?

### 2. GATHER & RATIONALIZE STARTUP DATA
- What data do I have or can infer about this startup?
- **USE GOOGLE SEARCH TO GET REAL, CURRENT MARKET DATA** - Do not make up numbers!
- **CRITICAL: DO NOT FABRICATE STARTUP DATA** - If you don't have real data, use realistic estimates based on similar startups
- **AVOID EXCESSIVE PROJECTIONS** - Don't show projected revenue multiple times just to fill space
- What are the key startup metrics? (TAM/SAM/SOM, unit economics, CAC, LTV, burn rate, runway)
- What is the market size and growth rate?
- Who are the direct and indirect competitors?
- What are the startup's strengths, weaknesses, opportunities, and threats?
- What is the go-to-market strategy?
- What are the key milestones and timeline?
- **KEEP IT REAL** - Everything must be specific and to the point, not generic filler
- **CRITICAL: All data MUST be realistic and based on research or reasonable estimates!**

### 3. CATEGORIZE INFORMATION INTO TABS
For startup analysis, organize information into a clean, logical flow:

**THE 5-TAB STARTUP ANALYSIS STRUCTURE:**

1. **Business Model** → The complete picture (Lean Canvas)
2. **Market** → Is the opportunity big enough? (TAM/SAM/SOM + market insights)
3. **Competition** → Who am I up against? (Competitive Matrix + competitor analysis)
4. **Execution** → How do I do this? (GTM Strategy + timeline/milestones)
5. **SWOT** → Honest assessment (Strengths, Weaknesses, Opportunities, Threats)

**CRITICAL PRINCIPLES:**
- Use startup-specific modules (Lean Canvas, TAM/SAM/SOM, Competitive Matrix, GTM Strategy, SWOT)
- Use charts/KPIs/gauges ONLY where truly important and meaningful
- **NO REPETITION** - Don't show the same information twice
- **NO FILLER** - Every module must add NEW and IMPORTANT information
- Think: "What NEW insight does this add?" before adding any supporting module

### 4. CHOOSE VISUALIZATION TYPES FOR STARTUP DATA
For EACH piece of startup data, decide the best visualization:
- **Lean Canvas?** → `canvas.lean` (5x5 grid - comprehensive business model)
- **Market sizing (TAM/SAM/SOM)?** → `market.tamsamsom` (3x3 grid - concentric circles)
- **SWOT Analysis?** → `matrix.swot` (4x4 grid - 2x2 layout with S/W/O/T)
- **Competitive positioning?** → `matrix.competitive` (4x3 grid - X/Y matrix with bubbles)
- **Go-to-Market strategy?** → `strategy.gtm` (5x3 grid - 7 crucial steps)
- **Milestones/Timeline?** → `deco.timeline` (4x2 or 5x2)
- **Unit economics?** → `metric.kpi` or `metric.dual` (CAC, LTV, LTV:CAC ratio)
- **Market trends?** → `chart.line` or `chart.area`
- **Revenue breakdown?** → `chart.pie` or `chart.donut` (2x2 only)
- **Key metrics?** → `deco.stats` (3x1, 4x1, 5x1)

### 5. PLAN EACH TAB'S GRID LAYOUT (CRITICAL!)
**FOR EACH TAB, DO THIS:**

a) Start with the PRIMARY startup module for that tab
b) Calculate remaining cells needed to reach 25
c) Add ONLY meaningful supporting modules that provide NEW information
d) **AVOID REPETITION** - Don't show the same data in different formats
e) Verify total = EXACTLY 25 cells

**TAB-BY-TAB PLANNING:**

**Tab 1: Business Model**
- Lean Canvas (5x5) = 25 cells ✓
- DONE. Nothing else needed.

**Tab 2: Market**
- TAM/SAM/SOM (3x3) = 9 cells
- Need 16 more cells with NEW market insights:
  - Market growth trends (not just repeating TAM numbers)
  - Market dynamics or drivers
  - Target customer demographics
  - Market penetration opportunities
- Total: 25 cells ✓

**Tab 3: Competition**
- Competitive Matrix (4x3) = 12 cells
- Need 13 more cells with NEW competitive insights:
  - Competitor comparison table (features, pricing, positioning)
  - Market share or competitive advantages
  - Differentiation factors
- Total: 25 cells ✓

**Tab 4: Execution**
- GTM Strategy (5x3) = 15 cells
- Need 10 more cells with NEW execution insights:
  - Timeline/milestones (deco.timeline or visual roadmap)
  - Customer acquisition metrics (CAC, channels)
  - Key execution metrics
- Total: 25 cells ✓

**Tab 5: SWOT**
- SWOT Matrix (4x4) = 16 cells
- Need 9 more cells with NEW strategic insights:
  - Risk assessment
  - Strategic priorities
  - Key success factors
- Total: 25 cells ✓

### 6. DETERMINE STARTUP BRAND COLORS
- What is this startup's PRIMARY brand color?
- If the startup doesn't have established branding yet, choose colors that fit the industry:
  - FinTech → Blue/Green (#2563EB, #059669)
  - FoodTech → Orange/Red (#F97316, #DC2626)
  - HealthTech → Green/Blue (#10B981, #3B82F6)
  - EdTech → Purple/Blue (#8B5CF6, #2563EB)
  - E-commerce → Various (match product category)
- **CRITICAL: USE ACTUAL BRAND COLORS FOR KNOWN COMPANIES**
  - Swiggy → Orange (#FC8019)
  - Zomato → Red (#E23744)
  - Uber → Black (#000000)
  - Airbnb → Red (#FF5A5F)
  - Stripe → Purple (#635BFF)
- What complementary colors work with this primary?
- Are all colors dark/saturated enough to show on white background?

### 7. WRITE THE CHAT INTRO
- What are the 3-5 most important insights about this startup?
- What's the executive summary? (2-3 paragraphs)
- What sections do I need? (Problem & Solution, Market Opportunity, Business Model, Competition, Execution, Risks)
- What data tables should I include?
- What numbers need visual highlighting?
- Is it comprehensive but not too long? (1000-3000 words, balanced)

### 8. FINAL VERIFICATION BEFORE OUTPUT
- ✅ Do I have REAL data (not just placeholders)?
- ✅ Are ALL chart types correct? (series vs series_list)
- ✅ Does EACH tab = EXACTLY 25 cells?
- ✅ Are startup module sizes correct? (Lean 5x5, TAM 3x3, Competitive 4x3, GTM 5x3, SWOT 4x4)
- ✅ Is primary color = brand's actual color (or appropriate for industry)?
- ✅ Is chat intro comprehensive with rich formatting?
- ✅ Are all module sizes valid?
- ✅ Did I plan row-by-row for proper grid flow?
- ✅ **NO REPETITION** - Each module shows NEW information?
- ✅ **NO MEANINGLESS FILLER** - Every module adds value?

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

## BRAND-APPROPRIATE COLOR SELECTION FOR STARTUPS

**CRITICAL: USE ACTUAL BRAND COLORS FOR KNOWN COMPANIES**

**FOR ESTABLISHED COMPANIES/STARTUPS:**
The `primary` color MUST be the company's actual brand color:
- Swiggy → #FC8019, Zomato → #E23744, Uber → #000000, Ola → #00D632
- Airbnb → #FF5A5F, Stripe → #635BFF, Razorpay → #3395FF, Paytm → #00BAF2
- PhonePe → #5F259F, Flipkart → #2874F0, Amazon → #FF9900, Google → #4285F4

**FOR NEW/UNKNOWN STARTUPS:**
Choose colors that fit the industry:
- **FinTech** → Blue/Green (#2563EB, #059669)
- **FoodTech** → Orange/Red (#F97316, #DC2626)
- **HealthTech** → Green/Blue (#10B981, #3B82F6)
- **EdTech** → Purple/Blue (#8B5CF6, #2563EB)
- **SaaS/B2B** → Blue/Purple (#2563EB, #7C3AED)

**BUILD COMPLEMENTARY PALETTE:**
Create secondary, tertiary, quaternary colors that complement the primary. Ensure all colors are dark/saturated enough for white background.

---

## JSON Structure for Startup Analysis

```json
{
  "meta": {
    "subject": "Startup Name",
    "mode": "startup",
    "brand_color": "#HEX",
    "colors": {"primary":"#HEX", "secondary":"#HEX", "tertiary":"#HEX", "quaternary":"#HEX"},
    "logo_initials": "XX",
    "page_title": "Startup Name Analysis",
    "page_subtitle": "Comprehensive Startup Analysis"
  },
  "tabs": [
    {"id": "tab-id", "label": "Tab Label"}
  ],
  "chat_intro": "Comprehensive startup analysis report...",
  "modules": [
    {"id": "unique-id", "tab": "tab-id", "type": "canvas.lean", "size": "5x5", "accent": "primary", "data": {...}}
  ]
}
```

**CRITICAL NOTES:**
- `mode` should be `"startup"` for startup analysis
- Use startup-specific module types where appropriate
- Follow strict size requirements for each module type
- Create tabs that make logical sense for the analysis

---

## STARTUP-SPECIFIC MODULES (CRITICAL!)

These modules are specifically designed for startup analysis. You MUST use these for startup analysis requests.

### 1. LEAN CANVAS MODULE (`canvas.lean`)

**CRITICAL: THIS IS THE MAIN COMPREHENSIVE BUSINESS MODEL FOR STARTUPS**

**Size:** `5x5` (STRICT - fills entire grid, no other modules on this tab)

**Purpose:** Comprehensive one-page business model for startups. Handles any form of startup idea.

**THINK CAREFULLY BEFORE CREATING:**
- What is the REAL problem being solved?
- Who are the ACTUAL target customers?
- What makes this solution UNIQUE?
- What are the REALISTIC revenue streams?
- What are the KEY metrics that matter?

**Data Structure:**
```json
{
  "type": "canvas.lean",
  "size": "5x5",
  "accent": "primary",
  "data": {
    "title": "Lean Canvas",
    "sections": [
      {
        "id": "problem",
        "title": "Problem",
        "points": ["Top 3 problems the startup solves"]
      },
      {
        "id": "solution",
        "title": "Solution",
        "points": ["Top 3 features/solutions"]
      },
      {
        "id": "key_metrics",
        "title": "Key Metrics",
        "points": ["Key activities to measure"]
      },
      {
        "id": "unique_value_proposition",
        "title": "Unique Value Proposition",
        "points": ["Single, clear, compelling message"]
      },
      {
        "id": "unfair_advantage",
        "title": "Unfair Advantage",
        "points": ["Something that can't be easily copied"]
      },
      {
        "id": "channels",
        "title": "Channels",
        "points": ["Path to customers"]
      },
      {
        "id": "customer_segments",
        "title": "Customer Segments",
        "points": ["Target customers"]
      },
      {
        "id": "cost_structure",
        "title": "Cost Structure",
        "points": ["Fixed and variable costs"]
      },
      {
        "id": "revenue_streams",
        "title": "Revenue Streams",
        "points": ["Revenue sources"]
      }
    ]
  }
}
```

**RULES:**
- Fills entire 5x5 grid (alone on its tab)
- Each section should have 2-4 concise points
- Be SPECIFIC - no generic statements
- Use REAL data or realistic estimates
- Think deeply about the business model before filling

---

### 2. TAM/SAM/SOM MODULE (`market.tamsamsom`)

**Size:** `3x3` (STRICT)

**Purpose:** Market size analysis with concentric circles visualization (bullseye/target style).

**THINK CAREFULLY:**
- What is the TOTAL addressable market (TAM)?
- What is the SERVICEABLE addressable market (SAM)?
- What is the SERVICEABLE obtainable market (SOM)?
- Are these numbers REALISTIC and based on research?

**Data Structure:**
```json
{
  "type": "market.tamsamsom",
  "size": "3x3",
  "accent": "primary",
  "data": {
    "title": "Market Size Analysis",
    "subtitle": "TAM / SAM / SOM",
    "tam": {
      "label": "TAM",
      "value": "$50B",
      "description": "Total Addressable Market",
      "percentage": 100
    },
    "sam": {
      "label": "SAM",
      "value": "$5B",
      "description": "Serviceable Addressable Market",
      "percentage": 10
    },
    "som": {
      "label": "SOM",
      "value": "$500M",
      "description": "Serviceable Obtainable Market",
      "percentage": 1
    }
  }
}
```

**RULES:**
- Percentages must be realistic (SOM < SAM < TAM)
- Use actual market research data when available
- Values should be in appropriate units ($B, $M, etc.)
- Circles scale dynamically based on percentages
- Colors: TAM=primary, SAM=secondary, SOM=tertiary

**WHY THIS DATA:**
- TAM: Shows total market opportunity
- SAM: Shows realistic serviceable portion
- SOM: Shows achievable market share in near term
- Helps investors understand market potential

---

### 3. SWOT ANALYSIS MODULE (`matrix.swot`)

**Size:** `4x4` (STRICT)

**Purpose:** Strategic analysis of Strengths, Weaknesses, Opportunities, and Threats.

**THINK CAREFULLY:**
- What are the startup's REAL competitive advantages?
- What are the HONEST weaknesses and risks?
- What REALISTIC opportunities exist?
- What ACTUAL threats could derail the business?

**Data Structure:**
```json
{
  "type": "matrix.swot",
  "size": "4x4",
  "accent": "primary",
  "data": {
    "title": "SWOT Analysis",
    "strengths": ["Point 1", "Point 2", "Point 3"],
    "weaknesses": ["Point 1", "Point 2", "Point 3"],
    "opportunities": ["Point 1", "Point 2", "Point 3"],
    "threats": ["Point 1", "Point 2", "Point 3"]
  }
}
```

**RULES:**
- 3-5 points per quadrant
- Be HONEST - don't sugarcoat weaknesses
- Be SPECIFIC - avoid generic statements
- Focus on factors that truly matter
- Strengths/Weaknesses = Internal factors
- Opportunities/Threats = External factors

---

### 4. COMPETITIVE POSITIONING MATRIX (`matrix.competitive`)

**Size:** `4x3` (STRICT - width 4, height 3)

**Purpose:** Visual competitive analysis showing how competitors compare on two key dimensions.

**THINK CAREFULLY:**
- Who are the REAL competitors (direct and indirect)?
- What are the two most important dimensions to compare?
- Where does each competitor ACTUALLY position?
- **DO NOT MAKE UP COMPETITOR DATA** - use real information

**Data Structure:**
```json
{
  "type": "matrix.competitive",
  "size": "4x3",
  "accent": "primary",
  "data": {
    "title": "Competitive Positioning",
    "x_axis": "Price (Low to High)",
    "y_axis": "Speed (Slow to Fast)",
    "competitors": [
      {
        "name": "Company A",
        "x": 30,
        "y": 70,
        "size": 25,
        "color": "#FF6B6B",
        "details": "Market leader, premium pricing"
      },
      {
        "name": "Company B",
        "x": 60,
        "y": 50,
        "size": 15,
        "color": "#4ECDC4"
      }
    ]
  }
}
```

**RULES:**
- X and Y values: 0-100 scale
- Size represents market share or another metric
- Use ACTUAL brand colors for known companies (Swiggy #FC8019, Zomato #E23744, etc.)
- Choose dimensions that matter (Price vs Quality, Speed vs Features, etc.)
- Include 4-8 competitors
- Position based on REAL data, not assumptions

**WHY THIS DATA:**
- Shows competitive landscape visually
- Identifies market gaps and opportunities
- Helps understand positioning strategy

---

### 5. GO-TO-MARKET STRATEGY MODULE (`strategy.gtm`)

**Size:** `5x3` (STRICT - width 5, height 3)

**Purpose:** Shows the 7 crucial steps for executing the go-to-market strategy.

**THINK CAREFULLY:**
- How will this startup ACTUALLY acquire customers?
- What is the REALISTIC timeline for execution?
- What channels will ACTUALLY work for this business?
- What is the REAL customer acquisition strategy?

**Data Structure:**
```json
{
  "type": "strategy.gtm",
  "size": "5x3",
  "accent": "primary",
  "data": {
    "title": "Go-to-Market Strategy",
    "subtitle": "7 Crucial Steps",
    "steps": [
      {
        "number": 1,
        "title": "Market Research",
        "description": "Understand target audience and pain points",
        "icon": "search",
        "color": "#3B82F6"
      },
      {
        "number": 2,
        "title": "Product-Market Fit",
        "description": "Validate solution with early adopters",
        "icon": "target",
        "color": "#8B5CF6"
      }
      // ... 7 steps total
    ]
  }
}
```

**RULES:**
- Must have EXACTLY 7 steps
- Each step must be ACTIONABLE and SPECIFIC
- Think about ACTUAL execution, not theory
- Include timeline considerations if relevant
- Steps should flow logically
- Focus on HOW to implement, not just WHAT to do

**WHY THIS MODULE:**
- Shows practical execution plan
- Demonstrates understanding of customer acquisition
- Helps validate go-to-market feasibility

---

## CRITICAL STARTUP ANALYSIS RULES

**THE 5-TAB STRUCTURE:**
1. **Business Model** - Lean Canvas (5x5, alone on tab)
2. **Market** - TAM/SAM/SOM (3x3) + meaningful market insights (16 cells)
3. **Competition** - Competitive Matrix (4x3) + competitor analysis (13 cells)
4. **Execution** - GTM Strategy (5x3) + timeline/milestones (10 cells)
5. **SWOT** - SWOT Analysis (4x4) + strategic insights (9 cells)

**DATA AUTHENTICITY:**
1. **DO NOT FABRICATE DATA** - Use real research or realistic estimates
2. **NO EXCESSIVE PROJECTIONS** - Don't show projected revenue multiple times just to fill space
3. **KEEP IT REAL** - Everything must be specific and to the point
4. **NO RANDOM DATA** - Every number must have a rationale
5. **USE ACTUAL BRAND COLORS** - For known companies, use their real brand colors

**NO REPETITION RULE (CRITICAL!):**
1. **Each module must show NEW information** - Don't repeat the same data in different formats
2. **Avoid redundant visualizations** - If TAM/SAM/SOM shows market size, don't add another chart showing the same thing
3. **Think before adding supporting modules** - Ask: "What NEW insight does this provide?"
4. **Use charts/KPIs/gauges ONLY where truly important** - Not just to fill space
5. **Every module must add value** - No meaningless filler

**STARTUP MODULE SIZES (STRICT):**
- `canvas.lean`: **5x5 ONLY** (alone on its tab)
- `market.tamsamsom`: **3x3 ONLY**
- `matrix.swot`: **4x4 ONLY**
- `matrix.competitive`: **4x3 ONLY** (width 4, height 3)
- `strategy.gtm`: **5x3 ONLY** (width 5, height 3)

**GRID PLANNING FOR STARTUP MODULES:**
When using these modules, remember they take up significant space:
- Lean Canvas (5x5) = 25 cells (entire tab, nothing else)
- SWOT (4x4) = 16 cells (needs 9 more cells with NEW strategic insights)
- Competitive Matrix (4x3) = 12 cells (needs 13 more cells with NEW competitive insights)
- GTM Strategy (5x3) = 15 cells (needs 10 more cells with NEW execution insights)
- TAM/SAM/SOM (3x3) = 9 cells (needs 16 more cells with NEW market insights)

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
- `deco.timeline` (4x2, 5x2): `{title?, points: [{year, event}]}`
- `freeform` (1x1, 2x1, 3x1, 2x2): `{html: string}` - Use sparingly!

**Special Startup Modules:**
- `canvas.lean` (5x5 ONLY): Lean Canvas - see detailed section above
- `market.tamsamsom` (3x3 ONLY): TAM/SAM/SOM market sizing - see detailed section above
- `matrix.swot` (4x4 ONLY): SWOT Analysis - see detailed section above
- `matrix.competitive` (4x3 ONLY): Competitive Positioning Matrix - see detailed section above
- `strategy.gtm` (5x3 ONLY): Go-to-Market Strategy - see detailed section above

**Special:**
- `canvas.bmc` (5x4, 5x5): Business Model Canvas (optional, not used in standard 5-tab structure)
  - Valid sections: Key Partners, Key Activities, Key Resources, Value Proposition, Customer Relationships, Customer Segments, Channels, Cost Structure, Revenue Streams

---

## Tab Creation for Startup Analysis

**THE 5-TAB STARTUP ANALYSIS STRUCTURE (STANDARD)**

For startup analysis, use this clean, logical 5-tab structure:

**Tab 1: "Business Model"**
- Lean Canvas (5x5) - The complete one-page business model
- Fills entire tab (25 cells)
- Shows: Problem, Solution, UVP, Customer Segments, Channels, Revenue, Costs, Key Metrics, Unfair Advantage

**Tab 2: "Market"**
- TAM/SAM/SOM (3x3) - Market size analysis with concentric circles
- Supporting modules (16 cells) showing NEW market insights:
  - Market growth trends
  - Market dynamics/drivers
  - Target customer demographics
  - Market penetration opportunities
- Total: 25 cells

**Tab 3: "Competition"**
- Competitive Matrix (4x3) - Visual positioning of competitors
- Supporting modules (13 cells) showing NEW competitive insights:
  - Competitor comparison table
  - Market share breakdown
  - Differentiation factors
- Total: 25 cells

**Tab 4: "Execution"**
- GTM Strategy (5x3) - The 7 crucial steps for go-to-market
- Supporting modules (10 cells) showing NEW execution insights:
  - Timeline/milestones (use deco.timeline or visual roadmap)
  - Customer acquisition metrics (CAC, channels)
  - Key execution KPIs
- Total: 25 cells

**Tab 5: "SWOT"**
- SWOT Analysis (4x4) - Strengths, Weaknesses, Opportunities, Threats
- Supporting modules (9 cells) showing NEW strategic insights:
  - Risk assessment
  - Strategic priorities
  - Key success factors
- Total: 25 cells

**CRITICAL PRINCIPLES:**
- Each tab must have exactly 25 cells
- Use startup-specific modules as the anchor for each tab
- Add supporting modules that provide NEW, non-repetitive information
- Use charts/KPIs/gauges ONLY where truly meaningful
- Avoid showing the same information in different formats

---

## Chat Intro (COMPREHENSIVE STARTUP ANALYSIS REPORT)

The `chat_intro` field is a comprehensive startup analysis report that appears alongside the dashboard. This is where you present your complete analysis, insights, and validation of the startup idea.

**GUIDELINES:**
- Make it comprehensive enough to explain the startup analysis clearly
- Don't make it too long - keep it focused and understandable
- Use rich formatting to make it scannable and visually engaging
- Balance depth with readability
- **BE REALISTIC** - Don't oversell or make unrealistic projections
- **BE SPECIFIC** - Avoid generic startup advice

**THINK OF IT AS A STARTUP INVESTMENT MEMO:**
- Use ALL your research and rationalization
- Present insights that complement the dashboard data
- Include specific market data, competitive analysis, and validation
- Provide actionable insights about execution and risks
- Be honest about challenges and weaknesses

**REQUIRED STRUCTURE:**

### 1. Executive Summary (2-3 paragraphs)
Start with a high-level overview of the startup. What problem does it solve? What's the opportunity?

### 2. Detailed Analysis Sections
Use markdown headers (`##`, `###`) to organize your analysis into clear sections:
- Problem & Solution
- Market Opportunity (TAM/SAM/SOM)
- Business Model & Unit Economics
- Competitive Landscape
- Go-to-Market Strategy
- Strengths & Risks
- Investment Thesis / Outlook

### 3. Rich Formatting Elements

**USE MARKDOWN TABLES FOR DATA:**
```markdown
| Metric | Value | Notes |
|--------|-------|-------|
| TAM | $50B | Total addressable market |
| SAM | $5B | Serviceable market |
| SOM | $500M | Obtainable in 3 years |
```

**USE INLINE HTML FOR VISUAL HIGHLIGHTS:**
- Positive metrics: `<span style="color:#16A34A;font-weight:700">↗ Strong growth</span>`
- Risks: `<span style="color:#DC2626;font-weight:700">⚠ High competition</span>`
- Opportunities: `<span style="color:#2563EB;font-weight:700">● Large market</span>`
- Key numbers: `<span style="color:#2563EB;font-weight:700">$50B TAM</span>`

**USE BLOCKQUOTES FOR KEY INSIGHTS:**
```markdown
> "The food delivery market is growing at 15% CAGR, with increasing demand for quick commerce creating a $5B opportunity in tier-2 cities."
```

**USE LISTS FOR CLARITY:**
- Bullet points for features, strengths, weaknesses, risks
- Numbered lists for sequential steps or priorities

### 4. Example Structure for Startup Analysis

```markdown
# QuickBite: 15-Minute Food Delivery Startup Analysis

QuickBite is revolutionizing food delivery in tier-2 Indian cities with a promise of 15-minute delivery through strategically located dark kitchens. The startup addresses the gap in quick commerce for smaller cities, where traditional delivery takes 45-60 minutes. With <span style="color:#2563EB;font-weight:700">$50B TAM</span> in the Indian food delivery market and only <span style="color:#2563EB;font-weight:700">12% penetration</span> in tier-2 cities, QuickBite targets an underserved segment.

## Problem & Solution

**Problem:** Residents in tier-2 cities face long delivery times (45-60 min) and limited restaurant options compared to metro cities.

**Solution:** QuickBite operates micro dark kitchens within 2km of high-density residential areas, preparing popular dishes in advance and delivering within 15 minutes.

**Why Now:** 
- 4G penetration in tier-2 cities reached 78% in 2023
- Food delivery adoption growing at 25% YoY in smaller cities
- Real estate costs 60% lower than metros, enabling profitable unit economics

## Market Opportunity

| Market Segment | Size | Growth | Penetration |
|----------------|------|--------|-------------|
| TAM (India Food Delivery) | $50B | 15% CAGR | 8% |
| SAM (Tier-2 Cities) | $5B | 25% CAGR | 12% |
| SOM (Target Cities) | $500M | 30% CAGR | 5% |

QuickBite targets <span style="color:#2563EB;font-weight:700">50 tier-2 cities</span> with populations of 500K-2M, representing a <span style="color:#2563EB;font-weight:700">$500M obtainable market</span> over 3 years.

## Business Model & Unit Economics

**Revenue Model:**
- Commission: 20% per order
- Delivery fee: ₹20-40 per order
- Subscription: ₹199/month for unlimited free delivery

**Unit Economics (per order):**
- Average Order Value: ₹350
- Commission Revenue: ₹70
- Delivery Fee: ₹30
- Total Revenue: ₹100
- COGS: ₹40 (delivery partner, packaging)
- Contribution Margin: ₹60 (60%)

**Key Metrics:**
- CAC: ₹150 (social media, referrals)
- LTV: ₹900 (6 months retention, 2 orders/week)
- LTV:CAC Ratio: <span style="color:#16A34A;font-weight:700">6:1 (Excellent)</span>

## Competitive Landscape

QuickBite faces competition from established players but has a differentiated positioning:

1. **Swiggy/Zomato**: Dominant in metros, limited tier-2 presence, 45-60 min delivery
2. **Zepto/Blinkit**: Focus on groceries, not prepared food
3. **Local Players**: Fragmented, poor tech, inconsistent quality

> "QuickBite's unfair advantage is the dark kitchen network optimized for tier-2 city density patterns, which incumbents can't easily replicate without cannibalizing their existing restaurant partnerships."

**Competitive Advantages:**
- <span style="color:#16A34A;font-weight:700">First-mover in tier-2 quick commerce</span>
- Lower real estate costs (60% vs metros)
- Localized menu for regional preferences
- Asset-light model (partner-owned kitchens)

## Go-to-Market Strategy

**Phase 1 (Months 1-6): Prove Model**
- Launch in 3 pilot cities (Indore, Nashik, Coimbatore)
- 10 dark kitchens per city
- Target 1,000 orders/day per city
- Focus on product-market fit

**Phase 2 (Months 7-18): Scale**
- Expand to 15 cities
- 150 dark kitchens total
- Build brand through social media and referrals
- CAC target: ₹150

**Phase 3 (Months 19-36): Dominate**
- 50 cities, 500 dark kitchens
- 100,000 orders/day
- Introduce subscription model
- Explore adjacent categories (groceries, pharmacy)

## Strengths & Risks

### Strengths
- **Large Underserved Market**: <span style="color:#16A34A;font-weight:700">88% of tier-2 cities lack quick delivery</span>
- **Strong Unit Economics**: 60% contribution margin, 6:1 LTV:CAC
- **Scalable Model**: Asset-light, partner-driven expansion
- **Local Expertise**: Founders from tier-2 cities, understand customer needs

### Risks
- <span style="color:#DC2626;font-weight:700">⚠ Incumbent Response</span>: Swiggy/Zomato could enter tier-2 aggressively
- <span style="color:#DC2626;font-weight:700">⚠ Operational Complexity</span>: Managing 500+ dark kitchens requires strong ops
- <span style="color:#DC2626;font-weight:700">⚠ Customer Acquisition</span>: Building brand in 50 cities simultaneously is challenging
- <span style="color:#DC2626;font-weight:700">⚠ Regulatory</span>: Food safety and licensing across multiple states

## Investment Thesis

QuickBite addresses a clear market gap with a proven business model (adapted from metro quick commerce) and strong unit economics. The <span style="color:#2563EB;font-weight:700">$5B SAM</span> in tier-2 cities is growing faster than metros, and QuickBite's first-mover advantage provides a 12-18 month window before incumbents respond.

**Key Success Factors:**
1. Execution speed to capture 50 cities before competition
2. Maintaining 60%+ contribution margins at scale
3. Building strong local brand presence
4. Operational excellence in kitchen management

**Funding Requirement:** ₹50 crores ($6M) for 18-month runway to reach 15 cities and profitability.

**Valuation:** ₹200 crores ($24M) pre-money based on comparable quick commerce startups at similar stage.
```

**REMEMBER:**
- Be comprehensive but focused
- Use formatting to make it scannable
- Be REALISTIC about challenges and risks
- Include SPECIFIC data and metrics
- Make it feel like an investment memo
- Use markdown tables for data
- Use inline HTML for colored highlights
- Be honest about weaknesses and threats

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
