# Complete Module Data Requirements Analysis

## Executive Summary

**CRITICAL ISSUES FOUND:**
1. ❌ `feed.news` in prompts but component expects `feed`
2. ❌ Missing detailed examples for several module types
3. ❌ Incomplete data structure documentation for some modules
4. ✅ Chart types are correctly documented
5. ✅ KPI/Gauge types are correctly documented

---

## Module-by-Module Analysis

### 1. metric.kpi (KPI Module)

**Component Location:** `KpiModule.tsx`

**Data Structure Required:**
```typescript
{
  title: string          // Required - metric label
  value: string          // Required - big number to display
  delta: string          // Required - change indicator (e.g., "+15%", "-3%")
  direction: "up" | "down" | "neutral"  // Required
  sparkline: number[]    // Optional - array of numbers for mini chart
}
```

**Example:**
```json
{
  "type": "metric.kpi",
  "size": "1x1",
  "accent": "primary",
  "data": {
    "title": "Revenue",
    "value": "$1.2B",
    "delta": "+15%",
    "direction": "up",
    "sparkline": [30, 45, 38, 60, 75, 82, 100]
  }
}
```

**Status in generate.md:** ✅ CORRECT
- Documented as: `{title, value, delta, direction: "up"|"down"|"neutral", sparkline: [numbers]}`

---

### 2. metric.dual (Dual KPI Module)

**Component Location:** `DualKpiModule.tsx`

**Data Structure Required:**
```typescript
{
  title?: string         // Optional - outer label
  kpis: [                // Required - EXACTLY 2 items
    {
      title: string      // Required
      value: string      // Required
      delta?: string     // Optional
      direction?: "up" | "down" | "neutral"  // Optional
      sparkline?: number[]  // Optional
      accent?: string    // Optional - color override
    },
    {
      title: string
      value: string
      delta?: string
      direction?: "up" | "down" | "neutral"
      sparkline?: number[]
      accent?: string
    }
  ]
}
```

**Example:**
```json
{
  "type": "metric.dual",
  "size": "2x1",
  "accent": "primary",
  "data": {
    "title": "Performance Metrics",
    "kpis": [
      {
        "title": "Revenue",
        "value": "$1.2B",
        "delta": "+15%",
        "direction": "up",
        "sparkline": [10, 12, 15, 18, 20]
      },
      {
        "title": "Profit",
        "value": "$200M",
        "delta": "-5%",
        "direction": "down",
        "sparkline": [20, 18, 16, 15, 14]
      }
    ]
  }
}
```

**Status in generate.md:** ✅ CORRECT
- Documented as: `{title, kpis: [{title, value, delta, direction, sparkline}]}`

---

### 3. gauge (Gauge Module)

**Component Location:** `GaugeModule.tsx`

**Data Structure Required:**
```typescript
{
  title: string          // Required
  subtitle?: string      // Optional
  value: number          // Required - current value
  max: number            // Required - maximum value
  unit?: string          // Optional - unit symbol (%, $, etc.)
  label?: string         // Optional - text label below gauge
  description?: string   // Optional - additional text
  footer_stats?: string[]  // Optional - footer text
}
```

**Example:**
```json
{
  "type": "gauge",
  "size": "2x2",
  "accent": "primary",
  "data": {
    "title": "Market Share",
    "subtitle": "Q4 2023",
    "value": 35,
    "max": 100,
    "unit": "%",
    "label": "Target: 40%",
    "description": "Growing steadily"
  }
}
```

**Status in generate.md:** ✅ CORRECT
- Documented as: `{title, value, max, unit, label, description}`

---

### 4. chart.* (Chart Module)

**Component Location:** `ChartModule.tsx`

**Supported Variants:**
- `chart.bar` - Vertical bar chart
- `chart.line` - Line chart
- `chart.area` - Area chart
- `chart.hbar` - Horizontal bar chart
- `chart.grouped` - Multi-series bar chart
- `chart.pie` - Pie chart (MUST be 2x2)
- `chart.donut` - Donut chart (MUST be 2x2)
- `chart.radar` - Radar/spider chart
- `chart.waterfall` - Waterfall chart

**Data Structures:**

**Single-Series (bar, line, area, hbar):**
```typescript
{
  title: string
  subtitle?: string
  labels: string[]       // Required - X-axis labels
  series: number[]       // Required - Y-axis values
  unit?: string          // Optional - unit for axis
  footer_stats?: string[]  // Optional
}
```

**Multi-Series (grouped):**
```typescript
{
  title: string
  subtitle?: string
  labels: string[]       // Required
  series_list: [         // Required - array of series objects
    {
      name: string       // Series name
      values: number[]   // Series values
    }
  ]
}
```

**Pie/Donut:**
```typescript
{
  title: string
  subtitle?: string
  segments: [            // Required
    {
      label: string
      value: number
      color_key: "primary" | "secondary" | "tertiary" | "quaternary"
    }
  ]
}
```

**Radar:**
```typescript
{
  title: string
  subtitle?: string
  labels: string[]       // Required - dimension names
  series: number[]       // Required - values (auto-scales to 1-5, 1-10, or 1-100)
}
```

**Waterfall:**
```typescript
{
  title: string
  subtitle?: string
  labels: string[]       // Required
  series: number[]       // Required - bar values
  invisible: number[]    // Required - starting positions
}
```

**Status in generate.md:** ✅ MOSTLY CORRECT
- All chart types documented
- Data structures correct
- Scale guidance added
- ⚠️ Could add more examples for radar and waterfall

---

### 5. table (Table Module)

**Component Location:** `TableModule.tsx`

**Data Structure Required:**
```typescript
{
  title: string
  subtitle?: string
  columns: [             // Required
    {
      key: string        // Column identifier
      label: string      // Column header
      sortable?: boolean // Optional - enable sorting
      type?: "delta_badge" | "currency" | "percent"  // Optional - formatting
    }
  ]
  rows: [                // Required - array of row objects
    {
      [key: string]: any  // Keys must match column keys
    }
  ]
}
```

**Example:**
```json
{
  "type": "table",
  "size": "5x2",
  "accent": "primary",
  "data": {
    "title": "Top Products",
    "subtitle": "By revenue",
    "columns": [
      {"key": "product", "label": "Product", "sortable": true},
      {"key": "revenue", "label": "Revenue", "type": "currency"},
      {"key": "growth", "label": "Growth", "type": "delta_badge"}
    ],
    "rows": [
      {"product": "Product A", "revenue": 500000000, "growth": 15},
      {"product": "Product B", "revenue": 300000000, "growth": -5}
    ]
  }
}
```

**Status in generate.md:** ✅ CORRECT
- Documented as: `{title, subtitle, columns: [{key, label}], rows: [{key: value}]}`

---

### 6. feed (Feed Module) ⚠️ ISSUE FOUND

**Component Location:** `FeedModule.tsx`

**Module Type Expected:** `feed` (NOT `feed.news`)

**Data Structure Required:**
```typescript
{
  title: string
  subtitle?: string
  items: [               // Required
    {
      headline: string   // Required
      source: string     // Required
      date?: string      // Optional
      sentiment?: "positive" | "negative" | "neutral"  // Optional
    }
  ]
}
```

**Example:**
```json
{
  "type": "feed",
  "size": "3x2",
  "accent": "primary",
  "data": {
    "title": "Recent News",
    "subtitle": "Last 7 days",
    "items": [
      {
        "headline": "Company announces new product line",
        "source": "TechCrunch",
        "date": "2 days ago",
        "sentiment": "positive"
      }
    ]
  }
}
```

**Status in generate.md:** ❌ INCORRECT
- Documented as: `feed.news` but component expects `feed`
- Data structure is correct: `{title, subtitle, items: [{headline, source, date, sentiment}]}`

**FIX REQUIRED:** Change `feed.news` to `feed` in generate.md

---

### 7. deco.stats (Deco Stats Module)

**Component Location:** `DecoModule.tsx` (variant: 'stats')

**Data Structure Required:**
```typescript
{
  title?: string         // Optional
  subtitle?: string      // Optional
  metrics: [             // Required
    {
      label: string      // Required
      value: string      // Required
      delta?: string     // Optional - change indicator
      sub?: string       // Optional - additional text
    }
  ]
}
```

**Example:**
```json
{
  "type": "deco.stats",
  "size": "5x1",
  "accent": "primary",
  "data": {
    "title": "Key Metrics",
    "metrics": [
      {"label": "Users", "value": "2.5M", "delta": "+12%"},
      {"label": "Revenue", "value": "$45M", "delta": "+8%"},
      {"label": "Profit", "value": "$12M", "delta": "-3%"}
    ]
  }
}
```

**Status in generate.md:** ✅ CORRECT
- Documented as: `{title, subtitle, metrics: [{label, value}]}`
- ⚠️ Missing delta and sub fields in documentation

---

### 8. deco.timeline (Deco Timeline Module)

**Component Location:** `DecoModule.tsx` (variant: 'timeline')

**Data Structure Required:**
```typescript
{
  title?: string         // Optional
  subtitle?: string      // Optional
  points: [              // Required
    {
      year: string       // Required - year or date
      event: string      // Required - event description
      status?: "done" | "active"  // Optional (not used in component)
    }
  ]
}
```

**Example:**
```json
{
  "type": "deco.timeline",
  "size": "5x2",
  "accent": "primary",
  "data": {
    "title": "Company Milestones",
    "points": [
      {"year": "2020", "event": "Founded"},
      {"year": "2021", "event": "Series A"},
      {"year": "2022", "event": "Product Launch"},
      {"year": "2023", "event": "Profitability"}
    ]
  }
}
```

**Status in generate.md:** ✅ CORRECT
- Documented as: `{title, subtitle, points: [{year, event, status: "done"|"active"}]}`
- ⚠️ Note: status field is documented but not used in component

---

### 9. canvas.bmc (Business Model Canvas Module)

**Component Location:** `BmcModule.tsx`

**Data Structure Required:**
```typescript
{
  title?: string         // Optional
  cells: [               // Required
    {
      section: string    // Required - BMC section name
      points: string[]   // Required - array of bullet points
    }
  ]
}
```

**Valid Section Names:**
- "Key Partners"
- "Key Activities"
- "Key Resources"
- "Value Proposition" (or "Value Propositions")
- "Customer Relationships"
- "Customer Segments"
- "Channels"
- "Cost Structure"
- "Revenue Streams"

**Example:**
```json
{
  "type": "canvas.bmc",
  "size": "5x5",
  "accent": "primary",
  "data": {
    "title": "Business Model Canvas",
    "cells": [
      {
        "section": "Value Proposition",
        "points": [
          "Premium quality products",
          "Exceptional customer service",
          "Innovative design"
        ]
      },
      {
        "section": "Customer Segments",
        "points": [
          "Tech-savvy professionals",
          "Early adopters",
          "Enterprise clients"
        ]
      }
    ]
  }
}
```

**Status in generate.md:** ✅ CORRECT
- Documented as: `{title, cells: [{section, points: [strings]}]}`

---

### 10. freeform (Freeform HTML Module)

**Component Location:** `FreeformModule.tsx`

**Data Structure Required:**
```typescript
{
  html: string           // Required - raw HTML content
}
```

**Example:**
```json
{
  "type": "freeform",
  "size": "2x1",
  "accent": "primary",
  "data": {
    "html": "<div style='padding:20px; text-align:center; background:#f5f5f5; border-radius:8px;'><h3 style='color:#333; margin:0;'>Custom Content</h3><p style='color:#666; margin-top:8px;'>Any HTML/CSS you want</p></div>"
  }
}
```

**Status in generate.md:** ❌ NOT DOCUMENTED
- Freeform module is not mentioned in generate.md at all!
- Should be added with clear guidance on when to use (sparingly)

---

## Summary of Issues

### Critical Issues (Must Fix)

1. **feed.news → feed**
   - Location: generate.md line ~459
   - Change: `feed.news` to `feed`
   - Impact: AI generates wrong module type, causes "not implemented" error

2. **Missing freeform documentation**
   - Location: generate.md module types section
   - Add: Freeform module with data structure and usage guidance
   - Impact: AI doesn't know this module exists

### Minor Issues (Should Fix)

3. **deco.stats missing delta field**
   - Location: generate.md line ~461
   - Add: delta and sub fields to documentation
   - Impact: AI might not use these optional fields

4. **Missing detailed examples**
   - Radar chart needs example
   - Waterfall chart needs example
   - BMC needs example
   - Impact: AI might generate incorrect data structures

### Recommendations

1. **Add comprehensive examples** for all module types
2. **Add "wrong examples"** showing common mistakes
3. **Add validation checklist** for each module type
4. **Document optional vs required fields** more clearly
5. **Add data scale guidance** for all numeric fields

---

## Module Type Summary Table

| Module Type | Component | Status | Issues |
|-------------|-----------|--------|--------|
| metric.kpi | KpiModule | ✅ Correct | None |
| metric.dual | DualKpiModule | ✅ Correct | None |
| gauge | GaugeModule | ✅ Correct | None |
| chart.bar | ChartModule | ✅ Correct | None |
| chart.line | ChartModule | ✅ Correct | None |
| chart.area | ChartModule | ✅ Correct | None |
| chart.hbar | ChartModule | ✅ Correct | None |
| chart.grouped | ChartModule | ✅ Correct | None |
| chart.pie | ChartModule | ✅ Correct | None |
| chart.donut | ChartModule | ✅ Correct | None |
| chart.radar | ChartModule | ✅ Correct | Needs example |
| chart.waterfall | ChartModule | ✅ Correct | Needs example |
| table | TableModule | ✅ Correct | None |
| feed | FeedModule | ❌ Wrong name | Documented as feed.news |
| deco.stats | DecoModule | ⚠️ Incomplete | Missing delta field |
| deco.timeline | DecoModule | ✅ Correct | status field unused |
| canvas.bmc | BmcModule | ✅ Correct | Needs example |
| freeform | FreeformModule | ❌ Missing | Not documented |

---

## Next Steps

1. Fix `feed.news` → `feed` in generate.md
2. Add freeform module documentation
3. Add detailed examples for radar, waterfall, BMC
4. Add delta field to deco.stats documentation
5. Consider adding validation section for each module type
