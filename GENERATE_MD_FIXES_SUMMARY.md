# generate.md Deep Analysis & Fixes - Complete Summary

## What Was Done

I performed a comprehensive deep-dive analysis of ALL module types, comparing:
1. What data each frontend component actually needs
2. What's documented in generate.md
3. What's documented in chat.md

## Critical Issues Found & Fixed

### 1. ❌ feed.news → feed (FIXED)
**Problem:** Prompt said `feed.news` but component expects `feed`
**Impact:** AI generates wrong module type, causes "Module type not yet implemented" error
**Fix:** Changed all references from `feed.news` to `feed` in generate.md
**Locations Fixed:**
- Line ~48: Visualization type selection
- Line ~459: Module types section

### 2. ❌ Missing freeform Module (FIXED)
**Problem:** Freeform module not documented at all in generate.md
**Impact:** AI doesn't know this module exists, can't use it
**Fix:** Added complete freeform documentation with:
- Data structure: `{html: string}`
- Usage guidance (use sparingly)
- Size options (1x1, 2x1, 3x1, 2x2)

### 3. ⚠️ Incomplete deco.stats (FIXED)
**Problem:** Missing optional `delta` and `sub` fields
**Impact:** AI might not use these useful fields
**Fix:** Updated documentation to show: `{label, value, delta?, sub?}`

### 4. ⚠️ Missing Detailed Examples (FIXED)
**Problem:** Several module types lacked concrete examples
**Impact:** AI might generate incorrect data structures
**Fix:** Added comprehensive examples for:
- `chart.radar` - with scale guidance
- `chart.waterfall` - with invisible array explanation
- `table` - with column types (delta_badge, currency, percent)
- `feed` - with sentiment options
- `canvas.bmc` - with valid section names

## Pie/Donut Chart Label Length Rules

**Added to both generate.md and chat.md:**

Pie and donut chart segment labels must be concise to fit in the legend:
- **Maximum:** 3 words
- **Preferred:** 1-2 words
- **Examples of GOOD labels:**
  - "iPhone"
  - "Services"
  - "Mac"
  - "iPad"
  - "Wearables"
  - "Other Products"
- **Examples of BAD labels:**
  - "Wearable, Home, and Accessories" ❌ (too long!)
  - "iPhone and Related Products" ❌ (too long!)
  - "Services and Subscriptions Revenue" ❌ (too long!)

**Abbreviation Guidelines:**
- "Wearable, Home, and Accessories" → "Wearables"
- "Other Products and Services" → "Other Products"
- "International Markets" → "International"

This prevents text overflow in the pie/donut chart legend.

---

## All Module Types Verified

### ✅ Correctly Documented (No Changes Needed)
1. `metric.kpi` - Perfect
2. `metric.dual` - Perfect
3. `gauge` - Perfect
4. `chart.bar` - Perfect (with scale guidance)
5. `chart.line` - Perfect (with scale guidance)
6. `chart.area` - Perfect (with scale guidance)
7. `chart.hbar` - Perfect (with scale guidance)
8. `chart.grouped` - Perfect
9. `chart.pie` - Perfect
10. `chart.donut` - Perfect

### ✅ Fixed & Enhanced
11. `chart.radar` - Added example + scale guidance
12. `chart.waterfall` - Added example + invisible array explanation
13. `table` - Added example + column type documentation
14. `feed` - Fixed name (was feed.news) + added example
15. `deco.stats` - Added delta and sub fields
16. `deco.timeline` - Already correct
17. `canvas.bmc` - Added example + valid section names
18. `freeform` - Added complete documentation

## Data Structure Requirements - Complete Reference

### Chart Types (9 variants)
```
chart.bar       → {labels: [], series: []}
chart.line      → {labels: [], series: []}
chart.area      → {labels: [], series: []}
chart.hbar      → {labels: [], series: []}
chart.grouped   → {labels: [], series_list: [{name, values}]}
chart.pie       → {segments: [{label, value, color_key}]} (2x2 only)
chart.donut     → {segments: [{label, value, color_key}]} (2x2 only)
chart.radar     → {labels: [], series: []} (auto-scales 1-5, 1-10, 1-100)
chart.waterfall → {labels: [], series: [], invisible: []}
```

### KPI Types (3 variants)
```
metric.kpi  → {title, value, delta, direction, sparkline?} (1x1 only)
metric.dual → {title?, kpis: [{title, value, delta?, direction?, sparkline?}]} (2x1 only)
gauge       → {title, value, max, unit?, label?, description?}
```

### Data Types (2 variants)
```
table → {title, subtitle?, columns: [{key, label, sortable?, type?}], rows: [{key: value}]}
feed  → {title, subtitle?, items: [{headline, source, date?, sentiment?}]}
```

### Decorative Types (2 variants)
```
deco.stats    → {title?, subtitle?, metrics: [{label, value, delta?, sub?}]} (3x1, 4x1, 5x1)
deco.timeline → {title?, subtitle?, points: [{year, event, status?}]} (4x2, 5x2)
```

### Special Types (2 variants)
```
canvas.bmc → {title?, cells: [{section, points: []}]} (5x4, 5x5)
freeform   → {html: string} (1x1, 2x1, 3x1, 2x2)
```

## Scale Guidance Added

Added comprehensive data scale rules for all numeric data:
- Revenue in billions: use 383.3 (not 383000000000)
- Percentages: use 0-100 scale (25.5 for 25.5%)
- Ratings: use actual scale (4.2 for 1-5, 8.5 for 1-10)
- User counts: use millions (247 for 247M users)

## Examples Added

### Before (No Examples)
```
- chart.radar (2x2, 3x3): {title, subtitle, labels: [strings], series: [numbers]}
```

### After (With Example)
```
- chart.radar (2x2, 3x3): {title, subtitle, labels: [strings], series: [numbers]}
  
  RADAR CHART EXAMPLE:
  {
    "type": "chart.radar",
    "size": "2x2",
    "data": {
      "title": "Competitive Strength Profile",
      "subtitle": "Key dimensions (1-5 scale)",
      "labels": ["Innovation", "Brand", "Price", "Performance", "Design"],
      "series": [4.2, 4.8, 3.5, 4.5, 4.7]
    }
  }
  
  CRITICAL: Radar charts auto-detect scale (1-5, 1-10, or 1-100). Use appropriate scale!
```

## Validation Checklist Updated

The validation checklist now includes:
- ✅ All module types use correct names (feed not feed.news)
- ✅ All data structures match component requirements
- ✅ All examples use realistic data scales
- ✅ All optional fields are documented
- ✅ All size constraints are documented

## Impact

These fixes will:
1. ✅ Eliminate "Module type not yet implemented" errors for feed
2. ✅ Enable AI to use freeform modules when appropriate
3. ✅ Improve data quality with better examples
4. ✅ Reduce blank charts from wrong data structures
5. ✅ Ensure AI uses realistic data scales

## Files Modified

1. `fastapi-backend/prompts/generate.md` - Multiple fixes
2. `kore-frontend/src/components/modules/types/ChartModule.tsx` - Added debug logging
3. `fastapi-backend/prompts/chat.md` - Added radar/waterfall types

## Files Created

1. `BLANK_CHART_ANALYSIS.md` - Root cause analysis of blank charts
2. `MODULE_DATA_REQUIREMENTS_ANALYSIS.md` - Complete module data requirements
3. `GENERATE_MD_FIXES_SUMMARY.md` - This file

## Testing Recommendations

1. Generate a new dashboard and check console for warnings
2. Try generating each module type to verify data structures
3. Test with different data scales (small numbers, large numbers, percentages)
4. Verify feed modules work (not feed.news)
5. Test freeform modules for custom HTML

## Conclusion

All 18 module types are now:
- ✅ Correctly named
- ✅ Fully documented
- ✅ Have complete data structure specs
- ✅ Include realistic examples
- ✅ Have scale guidance where needed
- ✅ Match frontend component requirements exactly

The generate.md prompt is now comprehensive and accurate.
