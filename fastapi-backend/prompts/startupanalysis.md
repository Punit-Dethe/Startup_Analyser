# KORE Startup Analysis Generation Prompt

**OUTPUT RAW JSON ONLY. NO MARKDOWN FENCES. NO EXPLANATIONS.**

---

## ⚠️ CRITICAL RULES ⚠️

**STOP OVERUSING KPIs AND STATS CARDS!**

You have a rich visualization catalog: charts (bar, line, area, grouped, radar), pies, tables, gauges, feeds, timelines. **Use them!**

**BAD:** Filling Market tab with 8 KPI cards showing market size, growth rate, CAGR, etc.
**GOOD:** Use 1-2 charts showing market growth trends, segment breakdown, regional distribution.

**BAD:** Filling Competition tab with 6 KPI cards for each competitor metric.
**GOOD:** Use a comparison table or grouped bar chart showing competitors side-by-side.

**KPIs/stats are for CRITICAL SINGLE METRICS only** - not for filling space!

---

**MOST COMMON MISTAKE: LEAVING GAPS IN THE GRID**

When you add a large module (like 4x4 SWOT), you create gaps. **YOU MUST FILL THESE GAPS!**

**Example of the mistake:**
- SWOT (4x4) = 16 cells → leaves column 5 rows 1-4 empty + row 5 all empty
- Add 2 KPIs (1x2 each) = 4 cells → fills column 5
- Add Stats (3x1) = 3 cells → fills row 5 columns 1-3
- **Total: 23 cells → GAP: row 5 columns 4-5 (2 cells empty!)**
- Result: Next module pushed outside grid (thin grey line at bottom)

**The fix:**
- After adding Stats (3x1), you have 2 cells remaining
- Add a 2x1 module OR two 1x1 modules to fill the gap
- Total: 25 cells ✓ NO GAPS!

**MODULE SIZE CONSTRAINTS:**
- `metric.kpi` → ONLY 1x1
- `metric.dual` → ONLY 2x1  
- `deco.stats` → ONLY 3x1, 4x1, 5x1 (horizontal only)
- For vertical space: use `feed.list` or `table`
x
**GRID RULES - UNIVERSAL CALCULATION:**
1. **Every tab = EXACTLY 25 cells** (5 columns × 5 rows)
2. **NO GAPS ALLOWED** - Every cell must be filled
3. **Calculate remaining cells**: 25 - [main module cells] = remaining
4. **Fill gaps with appropriate sizes** - If you have a 2-cell gap, add a 2x1 or 1x2 module
5. **STOP IMMEDIATELY when you reach 25** - DO NOT add more modules!

**CRITICAL: UNDERSTAND CSS GRID AUTO-PLACEMENT**

The grid fills LEFT-TO-RIGHT, TOP-TO-BOTTOM. When you add a 4x4 module, it occupies columns 1-4, rows 1-4. **Column 5 is EMPTY!**

**MANDATORY PROCESS FOR TALL/WIDE MODULES:**

**Step 1: Identify what space the main module occupies**
- SWOT Matrix (4x4) → columns 1-4, rows 1-4 = 16 cells
- Competitive Matrix (4x3) → columns 1-4, rows 1-3 = 12 cells
- TAM/SAM/SOM (3x3) → columns 1-3, rows 1-3 = 9 cells
- GTM Strategy (5x3) → columns 1-5, rows 1-3 = 15 cells

**Step 2: Calculate EXACTLY what gaps remain**
- SWOT (4x4): Column 5 rows 1-4 = 4 cells + Row 5 all columns = 5 cells = **9 cells needed**
- Competitive (4x3): Column 5 rows 1-3 = 3 cells + Rows 4-5 all columns = 10 cells = **13 cells needed**
- TAM (3x3): Columns 4-5 rows 1-3 = 6 cells + Row 4-5 all columns = 10 cells = **16 cells needed**
- GTM (5x3): Rows 4-5 all columns = 10 cells = **10 cells needed**

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

**Example: Tab with 4x4 Module (WRONG - CREATES GAPS!)**
```
Module 1: Large Module (4x4) = 16 cells
  → Remaining: 9 cells needed

Module 2: Small module (1x2) = 2 cells
Module 3: Small module (1x2) = 2 cells
Module 4: Medium module (3x1) = 3 cells

Total: 16 + 2 + 2 + 3 = 23 ✗ 
GAP: 2 EMPTY CELLS!
Result: Next module gets pushed outside grid!

FIX: Add one more module (2x1 or 1x2) to reach 25 cells.
```

**Step 4: Verify NO GAPS**
- Count total cells: MUST equal 25
- Check visually: Are there any empty spaces?
- If gaps exist: Add modules to fill them BEFORE moving on

**CRITICAL RULES:**
1. After a tall module, you MUST fill the remaining space in those rows FIRST
2. Don't add modules to new rows until previous rows are COMPLETELY filled
3. If you have a 2-cell gap, add a 2x1 or 1x2 module to fill it
4. NEVER leave gaps - they push modules outside the grid

**MANDATORY: VISUAL GRID VERIFICATION**

After planning each tab, draw out the grid mentally:
```
┌─────┬─────┬─────┬─────┬─────┐
│  ?  │  ?  │  ?  │  ?  │  ?  │  Row 1: Which modules fill this row?
├─────┼─────┼─────┼─────┼─────┤
│  ?  │  ?  │  ?  │  ?  │  ?  │  Row 2: Which modules fill this row?
├─────┼─────┼─────┼─────┼─────┤
│  ?  │  ?  │  ?  │  ?  │  ?  │  Row 3: Which modules fill this row?
├─────┼─────┼─────┼─────┼─────┤
│  ?  │  ?  │  ?  │  ?  │  ?  │  Row 4: Which modules fill this row?
├─────┼─────┼─────┼─────┼─────┤
│  ?  │  ?  │  ?  │  ?  │  ?  │  Row 5: Which modules fill this row?
└─────┴─────┴─────┴─────┴─────┘
```

**VERIFICATION CHECKLIST:**
- ✅ Is EVERY cell filled? (No question marks remaining?)
- ✅ Does each row have modules that span exactly 5 columns?
- ✅ Do all modules stay within the 5x5 boundary?
- ✅ Total cells = 25?
- ✅ No modules pushed to row 6 or beyond?

**If you find gaps:**
1. Identify WHERE the gap is (which row, which columns)
2. Add a module that FITS that exact gap
3. Re-verify the grid

**Common gap locations:**
- After 4x4 module: Column 5 rows 1-4 (4 cells) + Row 5 all (5 cells)
- After 4x3 module: Column 5 rows 1-3 (3 cells) + Rows 4-5 all (10 cells)
- After 3x3 module: Columns 4-5 rows 1-3 (6 cells) + Rows 4-5 all (10 cells)

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

**CRITICAL: FILLING GAPS AFTER LARGE MODULES**

When you add a 4x4 module (like SWOT), you have 9 empty cells remaining:
- Column 5, rows 1-4 = 4 cells
- Row 5, all columns = 5 cells
- **Total remaining: 9 cells**

**The ONLY rule: Fill all 9 cells to reach exactly 25 total.**

**🔒 MANDATORY SWOT TAB LAYOUT (FOLLOW EXACTLY):**

For the SWOT tab, use this EXACT layout:

```json
"modules": [
  {"type": "matrix.swot", "size": "4x4"},      // 16 cells - SWOT matrix (columns 1-4, rows 1-4)
  {"type": "table", "size": "1x2"},            // 2 cells - Table (column 5, rows 1-2)
  {"type": "metric.kpi", "size": "1x1"},       // 1 cell - KPI (column 5, row 3)
  {"type": "metric.gauge", "size": "1x1"},     // 1 cell - Gauge (column 5, row 4)
  {"type": "deco.stats", "size": "5x1"}        // 5 cells - Stats (row 5, all columns)
]
// Total: 16 + 2 + 1 + 1 + 5 = 25 ✓
```

**Visual Layout:**
```
┌─────────────────┬─────┐
│                 │Table│  Rows 1-2: SWOT (4x4) + Table (1x2)
│                 │ 1x2 │
│   SWOT (4x4)    ├─────┤
│                 │ KPI │  Row 3: SWOT continues + KPI (1x1)
│                 │ 1x1 │
├─────────────────┼─────┤
│                 │Gauge│  Row 4: SWOT continues + Gauge (1x1)
│                 │ 1x1 │
├─────────────────┴─────┤
│   Stats (5x1)         │  Row 5: Stats (5x1)
└───────────────────────┘
```

**Module Content Guidelines:**
- **Table (1x2)**: Risk assessment, strategic initiatives, or key priorities
- **KPI (1x1)**: Overall risk score, strategic readiness, or opportunity score
- **Gauge (1x1)**: Execution confidence, market timing, or competitive strength
- **Stats (5x1)**: 5 key strategic metrics or priorities

**DO NOT deviate from this layout for SWOT tab!**

---

**FOR OTHER TABS (Market, Competition, Execution):**

Choose modules based on what makes sense for the startup. You have the full catalog available:
- Charts (bar, line, pie, area, radar, waterfall)
- Tables, feeds (list, news), timelines
- Gauges, KPIs, dual metrics, stats

**Just count to 25. That's it.**

**EXAMPLE CALCULATION (works for ANY tab):**
```
Main module: 4x4 = 16 cells → Total: 16
Remaining: 25 - 16 = 9 cells needed

Module 2: [any size that fits] = X cells → Total: 16 + X
Module 3: [any size that fits] = Y cells → Total: 16 + X + Y

Keep adding until total = 25, then STOP!

Example: If X=4 and Y=5, then 16+4+5=25 ✓
Example: If X=2, Y=2, Z=5, then 16+2+2+5=25 ✓
Example: If X=3, Y=3, Z=3, then 16+3+3+3=25 ✓

Many combinations work - choose what makes sense for the startup!
```

**CRITICAL: AFTER REACHING 25, DO NOT ADD ANY MORE MODULES TO THAT TAB!**

**VERIFICATION:**
- Add up ALL module cells: W×H for each module
- Sum MUST equal exactly 25
- If sum > 25: You added too many modules - REMOVE the last ones
- If sum < 25: Add filler modules

**DATA RULES:**
- Use REAL market data (search if needed)
- NO fabricated numbers or excessive projections
- NO repetition across modules
- Each module must add NEW information

---

## STEP 0: THINK FIRST (MANDATORY)

**COMPLETE THIS THINKING PROCESS BEFORE CREATING JSON:**

### 1. UNDERSTAND THE STARTUP
- What is the startup idea or business concept?
- What problem does it solve? Who are the target customers?
- What is the business model and current stage?
- What are they trying to validate or understand?

### 2. GATHER REAL DATA
- **USE GOOGLE SEARCH FOR REAL MARKET DATA** - Do not fabricate numbers!
- Use realistic estimates based on similar startups if data unavailable
- **AVOID EXCESSIVE PROJECTIONS** - Don't repeat projected revenue just to fill space
- Key metrics: TAM/SAM/SOM, unit economics, CAC, LTV, burn rate, runway
- Market size, growth rate, competitors, SWOT factors
- **KEEP IT REAL** - Be specific, not generic filler

### 3. PLAN THE 5-TAB STRUCTURE

**Tab 1: Business Model** - Lean Canvas (5x5) = 25 cells ✓

**Tab 2: Market** - TAM/SAM/SOM (3x3) = 9 cells + 16 cells of NEW market insights:
- Market growth trends (not repeating TAM numbers)
- Market dynamics/drivers, customer demographics, penetration opportunities
- **CRITICAL: Use charts (line, bar, area, pie) NOT KPIs/stats for market data!**

**Tab 3: Competition** - Competitive Matrix (4x3) = 12 cells + 13 cells of NEW competitive insights:
- Competitor comparison table, market share, differentiation factors
- **CRITICAL: Use tables, charts, feeds NOT multiple KPIs for competitor data!**

**Tab 4: Execution** - GTM Strategy (5x3) = 15 cells + 10 cells of NEW execution insights:
- Timeline/milestones, customer acquisition metrics, key execution KPIs

**Tab 5: SWOT** - SWOT Matrix (4x4) = 16 cells + 9 cells in FIXED layout:
- **MANDATORY LAYOUT**: SWOT (4x4) + Table (1x2) + KPI (1x1) + Gauge (1x1) + Stats (5x1)
- Table: Risk assessment or strategic initiatives
- KPI: Overall risk/opportunity score
- Gauge: Execution confidence or competitive strength
- Stats: 5 key strategic priorities

**CRITICAL PRINCIPLES:**
- Use startup-specific modules as anchors
- **NO REPETITION** - Each module shows NEW information
- **NO MEANINGLESS FILLER** - Every module adds value
- **AVOID EXCESSIVE KPIs/STATS** - You have charts, graphs, pies, gauges, tables - use them!
- Use charts/KPIs/gauges ONLY where truly meaningful

### 4. CHOOSE VISUALIZATIONS
**YOU HAVE A RICH CATALOG - USE IT!**

Don't default to KPIs and stats cards. You have many visualization options:
- **Charts**: bar, line, area, grouped, radar, waterfall
- **Pies/Donuts**: for breakdowns and distributions (2x2 only)
- **Tables**: for detailed comparisons and data
- **Gauges**: for single metrics with targets
- **Feeds**: for news, updates, competitive intel
- **Timelines**: for milestones and roadmaps

**WHEN TO USE EACH:**
- Lean Canvas → `canvas.lean` (5x5)
- Market sizing → `market.tamsamsom` (3x3)
- SWOT → `matrix.swot` (4x4)
- Competitive positioning → `matrix.competitive` (4x3)
- Go-to-Market → `strategy.gtm` (5x3)
- **Market trends/growth** → `chart.line` or `chart.area` (preferred over KPIs)
- **Market segments** → `chart.pie` or `chart.bar` (preferred over stats)
- **Competitor comparison** → `table` (preferred over multiple KPIs)
- **Revenue breakdown** → `chart.pie` or `chart.donut` (2x2 only)
- **Timeline/milestones** → `deco.timeline` (4x2, 5x2)
- **Unit economics** → `metric.kpi` or `metric.dual`
- **Single important metric** → `gauge`

**💡 TIP: BALANCE YOUR VISUALIZATIONS**

**Gauges, KPIs, and stats work best for single key metrics.** For richer insights, consider:

**Especially in SWOT tab - you have many options beyond gauges:**
- `feed.list` (1x4) for risk factors or strategic priorities
- `table` (1x4 or 2x2) for risk assessment or strategic initiatives
- `chart.bar` or `chart.pie` (2x2) for risk/opportunity distribution
- `feed.news` (2x2) for industry threats or competitive intelligence
- `deco.timeline` (5x1) for strategic milestones

**Ask yourself:** "What would provide the most strategic insight here?"
- If it's a single metric → gauge or KPI works great
- If it's a comparison or breakdown → consider a chart or table
- If it's a list of items → consider a feed or table
- If it's a timeline → use deco.timeline

### 5. DETERMINE BRAND COLORS
**For known companies:** Use actual brand colors
- Swiggy #FC8019, Zomato #E23744, Uber #000000, Airbnb #FF5A5F, Stripe #635BFF

**For new startups:** Choose industry-appropriate colors
- FinTech → Blue/Green (#2563EB, #059669)
- FoodTech → Orange/Red (#F97316, #DC2626)
- HealthTech → Green/Blue (#10B981, #3B82F6)
- EdTech → Purple/Blue (#8B5CF6, #2563EB)

### 6. WRITE CHAT INTRO
- 1000-3000 words, comprehensive but realistic
- Executive summary (2-3 paragraphs)
- Sections: Problem & Solution, Market Opportunity, Business Model, Competition, Execution, Risks
- Include data tables and visual highlighting where needed

### 7. FINAL VERIFICATION

**BEFORE CREATING JSON, MANUALLY COUNT CELLS FOR EACH TAB:**

For each tab, list every module and calculate:
```
Tab: [name]
- Module 1: [type] [size] = [W×H] cells
- Module 2: [type] [size] = [W×H] cells
- Module 3: [type] [size] = [W×H] cells
...
TOTAL: [sum] cells

If TOTAL ≠ 25, ADD OR REMOVE MODULES!
```

**CHECKLIST:**
- ✅ Real data (not placeholders)
- ✅ Correct chart types (series vs series_list)
- ✅ **Each tab = EXACTLY 25 cells (COUNT THEM!)**
- ✅ Correct module sizes (Lean 5x5, TAM 3x3, Competitive 4x3, GTM 5x3, SWOT 4x4)
- ✅ Correct brand colors
- ✅ NO REPETITION across modules
- ✅ NO MEANINGLESS FILLER
- ✅ **NO GAPS - Every cell filled!**

**IF ANY TAB HAS 23, 24, 26, OR 27 CELLS - YOU FAILED! FIX IT BEFORE OUTPUTTING JSON!**

**ONLY AFTER COMPLETING STEPS 1-7 AND VERIFYING ALL TABS = 25 CELLS, CREATE THE JSON OUTPUT.**

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

## 🛑 FINAL CHECK BEFORE CREATING JSON 🛑

**STOP! Before you create the JSON, answer these questions:**

1. Did you count cells for EVERY tab?
2. Does EVERY tab have EXACTLY 25 cells?
3. Did you check for gaps in the SWOT tab specifically?
4. If you have a 4x4 module, did you fill column 5 AND row 5?
5. Did you avoid using too many KPIs/stats cards?

**If you answered NO to any question, GO BACK AND FIX IT!**

**Common mistakes to avoid:**
- ❌ SWOT tab with 23 cells (missing 2 cells in row 5)
- ❌ SWOT tab NOT following the mandatory layout (must be: SWOT + Table + KPI + Gauge + Stats)
- ❌ Market tab filled with 8 KPI cards (prefer charts for market data)
- ❌ Competition tab with 6 KPI cards (prefer tables/charts for comparisons)
- ❌ Any tab with 24, 26, or 27 cells

**If all checks pass, proceed to create JSON.**

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
    "cells": [
      {
        "section": "Problem",
        "points": ["Top 3 problems the startup solves", "Pain point 2", "Pain point 3"]
      },
      {
        "section": "Solution",
        "points": ["Top 3 features/solutions", "Feature 2", "Feature 3"]
      },
      {
        "section": "Key Metrics",
        "points": ["Key activities to measure", "Metric 2", "Metric 3"]
      },
      {
        "section": "Unique Value Proposition",
        "points": ["Single, clear, compelling message", "Why it matters"]
      },
      {
        "section": "Unfair Advantage",
        "points": ["Something that can't be easily copied", "Competitive moat"]
      },
      {
        "section": "Channels",
        "points": ["Path to customers", "Channel 2", "Channel 3"]
      },
      {
        "section": "Customer Segments",
        "points": ["Target customers", "Segment 2"]
      },
      {
        "section": "Cost Structure",
        "points": ["Fixed and variable costs", "Cost 2", "Cost 3"]
      },
      {
        "section": "Revenue Streams",
        "points": ["Revenue sources", "Stream 2"]
      }
    ]
  }
}
```

**CRITICAL FORMAT RULES:**
- Use `"cells"` array (NOT `"sections"`!)
- Each cell must have `"section"` (string) and `"points"` (array of strings)
- Section names MUST match exactly: "Problem", "Solution", "Key Metrics", "Unique Value Proposition", "Unfair Advantage", "Channels", "Customer Segments", "Cost Structure", "Revenue Streams"
- Each section should have 2-4 concise points
- Be SPECIFIC - no generic statements
- Use REAL data or realistic estimates

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
    "unit": "B",
    "segments": [
      {
        "label": "TAM",
        "value": 50,
        "percentage": 100,
        "description": "Total Addressable Market - Global food delivery market",
        "color": "#3B82F6"
      },
      {
        "label": "SAM",
        "value": 5,
        "percentage": 10,
        "description": "Serviceable Addressable Market - Indian food delivery",
        "color": "#8B5CF6"
      },
      {
        "label": "SOM",
        "value": 0.5,
        "percentage": 1,
        "description": "Serviceable Obtainable Market - Target cities in Year 1",
        "color": "#EC4899"
      }
    ]
  }
}
```

**CRITICAL FORMAT RULES:**
- Use `"segments"` array (NOT separate tam/sam/som objects!)
- Must have EXACTLY 3 segments in order: TAM, SAM, SOM
- Each segment needs: `label`, `value` (number), `percentage` (number), `description` (string), `color` (hex)
- `unit` is optional (e.g., "B" for billions, "M" for millions, "K" for thousands)
- Values should be numbers (not strings like "$50B" - use 50 with unit "B")
- Percentages must be realistic (SOM < SAM < TAM)
- Use actual market research data when available
- Colors: Use theme colors or specify hex codes

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
- **EXPLAIN WHAT THE AXES REPRESENT** - Don't just say "x-axis" and "y-axis"!

**Data Structure:**
```json
{
  "type": "matrix.competitive",
  "size": "4x3",
  "accent": "primary",
  "data": {
    "title": "Competitive Positioning",
    "subtitle": "Market positioning analysis",
    "xAxisLabel": "Price Point (Affordable → Premium)",
    "yAxisLabel": "Delivery Speed (Standard → Ultra-fast)",
    "sizeLabel": "Market Share (%)",
    "competitors": [
      {
        "name": "Swiggy",
        "x": 45,
        "y": 70,
        "size": 35,
        "color": "#FC8019",
        "description": "Market leader with premium pricing and fast delivery"
      },
      {
        "name": "Zomato",
        "x": 50,
        "y": 65,
        "size": 32,
        "color": "#E23744",
        "description": "Strong competitor with similar positioning"
      },
      {
        "name": "Dunzo",
        "x": 60,
        "y": 85,
        "size": 8,
        "color": "#FFD700",
        "description": "Premium hyperlocal delivery"
      },
      {
        "name": "Your Startup",
        "x": 30,
        "y": 80,
        "size": 2,
        "color": "#22C55E",
        "description": "Affordable ultra-fast delivery targeting tier-2 cities"
      }
    ]
  }
}
```

**CRITICAL FORMAT RULES:**
- Use `"xAxisLabel"`, `"yAxisLabel"`, `"sizeLabel"` (NOT `"x_axis"`, `"y_axis"`!)
- Axis labels MUST be descriptive and explain what they represent (e.g., "Price Point (Low → High)" not just "Price")
- Include what the axes mean in parentheses: (Low → High), (Slow → Fast), etc.
- X and Y values: 0-100 scale
- Size represents market share, revenue, or another meaningful metric
- Use ACTUAL brand colors for known companies (Swiggy #FC8019, Zomato #E23744, Uber #000000, etc.)
- Choose dimensions that matter (Price vs Quality, Speed vs Features, Innovation vs Reliability, etc.)
- Include 4-8 competitors including the startup itself
- Position based on REAL data, not assumptions
- Add meaningful descriptions for context

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
    "steps": [
      {
        "title": "Market Research",
        "description": "Understand target audience and pain points",
        "icon": "https://api.iconify.design/lucide:search.svg?color=white",
        "color": "#3B82F6",
        "points": [
          "Conduct customer interviews with 50+ potential users",
          "Analyze competitor offerings and pricing",
          "Identify key pain points and unmet needs"
        ]
      },
      {
        "title": "Product-Market Fit",
        "description": "Validate solution with early adopters",
        "icon": "https://api.iconify.design/lucide:target.svg?color=white",
        "color": "#8B5CF6",
        "points": [
          "Launch MVP to 100 beta users",
          "Iterate based on feedback",
          "Achieve 40%+ retention rate"
        ]
      },
      {
        "title": "Channel Strategy",
        "description": "Identify and test acquisition channels",
        "icon": "https://api.iconify.design/lucide:megaphone.svg?color=white",
        "color": "#EC4899",
        "points": [
          "Test social media ads (Instagram, Facebook)",
          "Partner with local influencers",
          "Launch referral program"
        ]
      },
      {
        "title": "Pricing Strategy",
        "description": "Define pricing model and tiers",
        "icon": "https://api.iconify.design/lucide:dollar-sign.svg?color=white",
        "color": "#F59E0B",
        "points": [
          "Freemium model with ₹299/month premium",
          "Annual plan at ₹2,999 (17% discount)",
          "Enterprise custom pricing"
        ]
      },
      {
        "title": "Sales Execution",
        "description": "Build sales process and team",
        "icon": "https://api.iconify.design/lucide:users.svg?color=white",
        "color": "#10B981",
        "points": [
          "Hire 3 sales reps for B2B outreach",
          "Create sales playbook and scripts",
          "Set up CRM and tracking"
        ]
      },
      {
        "title": "Marketing Launch",
        "description": "Execute marketing campaigns",
        "icon": "https://api.iconify.design/lucide:rocket.svg?color=white",
        "color": "#06B6D4",
        "points": [
          "Launch PR campaign in tech media",
          "Run paid ads with ₹5L budget",
          "Host launch event in 3 cities"
        ]
      },
      {
        "title": "Scale & Optimize",
        "description": "Measure, learn, and scale",
        "icon": "https://api.iconify.design/lucide:trending-up.svg?color=white",
        "color": "#EF4444",
        "points": [
          "Track CAC, LTV, and unit economics",
          "Double down on best-performing channels",
          "Expand to new markets based on data"
        ]
      }
    ]
  }
}
```

**CRITICAL FORMAT RULES:**
- Must have EXACTLY 7 steps
- Each step MUST have: `title`, `description`, `icon`, `color`, and `points` array
- `points` is an array of 2-4 specific, actionable items (THIS IS REQUIRED!)
- Icons should be from iconify.design CDN: `https://api.iconify.design/lucide:{icon-name}.svg?color=white`
- Each step must be ACTIONABLE and SPECIFIC (not generic theory)
- Think about ACTUAL execution with real timelines and metrics
- Colors should be distinct for each step (use different hex codes)
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
- **Delta values in deco.stats: MUST be strings with +/- prefix** (e.g., "+12%", "-5%", "+2.3x") - NOT numbers!

---

**KPIs & Gauges:**
- `metric.kpi` (1x1 ONLY): `{title, value, delta, direction, sparkline?}` - **HEIGHT MUST BE 1**
- `metric.dual` (2x1 ONLY): `{title?, kpis: [{title, value, delta?, direction?, sparkline?}]}` (EXACTLY 2 items) - **HEIGHT MUST BE 1**
- `gauge` (1x1, 2x1, 2x2): `{title, value, max, unit?, label?, description?}` - **1x1 and 2x1 have HEIGHT 1**

**Decorative:**
- `deco.stats` (3x1, 4x1, 5x1 ONLY): `{title?, metrics: [{label, value, delta?, sub?}]}` - **HEIGHT MUST ALWAYS BE 1, WIDTH 3-5**
  - `delta` MUST be a STRING with +/- prefix (e.g., "+12%", "-5%", "+2.3x") - NOT a number!
- `deco.timeline` (4x2, 5x2 ONLY): `{title?, points: [{year, event}]}` - **HEIGHT MUST BE 2**
- `freeform` (1x1, 2x1, 3x1, 2x2): `{html: string}` - Use sparingly!

**⚠️ CRITICAL SIZE CONSTRAINTS:**
- **KPI modules (metric.kpi)**: ONLY 1x1 - never 1x2, 1x3, etc.
- **Dual KPI (metric.dual)**: ONLY 2x1 - never 2x2, 2x3, etc.
- **Stats (deco.stats)**: ONLY horizontal (3x1, 4x1, 5x1) - NEVER vertical (1x3, 1x4, etc.)
- **Gauges**: Can be 1x1, 2x1, or 2x2 - but 1x1 and 2x1 are preferred for fillers

**WHY THESE CONSTRAINTS:**
- KPIs and stats are designed for HORIZONTAL layouts
- Using them vertically (1x3, 1x4) causes squishing and looks bad
- For vertical space, use feed.list or table instead

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
  - **EXAMPLE:**
    ```json
    {
      "type": "deco.stats",
      "size": "5x1",
      "data": {
        "title": "Key Metrics",
        "metrics": [
          {"label": "Revenue", "value": "$2.5M", "delta": "+23%"},
          {"label": "Users", "value": "50K", "delta": "+15%"},
          {"label": "Churn", "value": "2.1%", "delta": "-0.5%"},
          {"label": "NPS", "value": "72", "delta": "+8"},
          {"label": "MRR", "value": "$180K", "delta": "+12%"}
        ]
      }
    }
    ```
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
  - Market growth trends → Use `chart.line` or `chart.area`
  - Market segment breakdown → Use `chart.pie` or `chart.bar`
  - Regional distribution → Use `chart.bar` or `table`
  - Customer demographics → Use `table` or `chart.bar`
- **DO NOT fill with KPI cards! Use charts and tables to show trends and comparisons.**
- Total: 25 cells

**Tab 3: "Competition"**
- Competitive Matrix (4x3) - Visual positioning of competitors
- Supporting modules (13 cells) showing NEW competitive insights:
  - Competitor comparison → Use `table` (features, pricing, positioning)
  - Market share → Use `chart.pie` or `chart.bar`
  - Competitive news/intel → Use `feed.list`
  - Feature comparison → Use `table`
- **DO NOT fill with KPI cards! Use tables, charts, and feeds for competitive analysis.**
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

The `chat_intro` field is a comprehensive startup analysis report (1000-3000 words) that appears alongside the dashboard.

**GUIDELINES:**
- Comprehensive but focused - balance depth with readability
- **BE REALISTIC** - Don't oversell or make unrealistic projections
- **BE SPECIFIC** - Avoid generic startup advice
- Be honest about challenges and weaknesses
- Make it feel like an investment memo

**STRUCTURE:**
1. **Executive Summary** (2-3 paragraphs) - High-level overview, problem, opportunity
2. **Detailed Sections** - Use markdown headers (`##`, `###`) to organize:
   - Problem & Solution
   - Market Opportunity (TAM/SAM/SOM)
   - Business Model & Unit Economics
   - Competitive Landscape
   - Go-to-Market Strategy
   - Strengths & Risks
   - Investment Thesis / Outlook

**FORMATTING TOOLS:**
- **Markdown tables** for data presentation
- **Inline HTML** for colored highlights:
  - Positive: `<span style="color:#16A34A;font-weight:700">✓ Strong growth</span>`
  - Risks: `<span style="color:#DC2626;font-weight:700">⚠ High competition</span>`
  - Key numbers: `<span style="color:#2563EB;font-weight:700">$50B TAM</span>`
- **Blockquotes** for key insights (`> "quote"`)
- **Lists** for clarity (bullet points, numbered lists)

**💡 YOU CAN USE HTML/CSS FOR RICHER VISUALS:**

Create custom elements when it enhances understanding:
- **Styled tables** with colors and borders
- **Progress bars** for metrics (e.g., market penetration %)
- **Comparison bars** for competitor analysis
- **Metric cards** with colored backgrounds
- **Timelines** with visual milestones

Use inline styles with divs, spans, and standard HTML elements. Keep it simple and readable.

---
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
