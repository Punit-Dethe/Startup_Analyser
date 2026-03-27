# Pie/Donut Chart Label Length Rules

## The Problem

Long segment labels in pie/donut charts cause text overflow and poor readability in the legend area on the right side of the chart.

**Example of the issue:**
```
❌ BAD:
- "Wearable, Home, and Accessories" (5 words, too long!)
- "iPhone and Related Products" (4 words, too long!)
- "Services and Subscriptions Revenue" (4 words, too long!)
```

## The Solution

**Label Length Rules:**
1. **Maximum:** 3 words
2. **Preferred:** 1-2 words
3. **Abbreviate** long category names

## Good Examples

### Apple Revenue Breakdown
```json
{
  "segments": [
    {"label": "iPhone", "value": 52},
    {"label": "Services", "value": 20},
    {"label": "Mac", "value": 10},
    {"label": "iPad", "value": 8},
    {"label": "Wearables", "value": 10}
  ]
}
```

### Market Share
```json
{
  "segments": [
    {"label": "Company A", "value": 35},
    {"label": "Company B", "value": 28},
    {"label": "Company C", "value": 22},
    {"label": "Others", "value": 15}
  ]
}
```

### Revenue by Region
```json
{
  "segments": [
    {"label": "Americas", "value": 45},
    {"label": "Europe", "value": 25},
    {"label": "Asia Pacific", "value": 20},
    {"label": "Other Regions", "value": 10}
  ]
}
```

## Bad Examples (Don't Do This!)

### ❌ Too Long
```json
{
  "segments": [
    {"label": "Wearable, Home, and Accessories", "value": 10},  // 5 words!
    {"label": "iPhone and Related Products", "value": 52},      // 4 words!
    {"label": "Services and Subscriptions", "value": 20}        // 3 words (acceptable but not ideal)
  ]
}
```

## Abbreviation Guidelines

When category names are too long, abbreviate them:

| Original (Too Long) | Abbreviated (Good) |
|---------------------|-------------------|
| Wearable, Home, and Accessories | Wearables |
| iPhone and Related Products | iPhone |
| Services and Subscriptions Revenue | Services |
| Other Products and Services | Other Products |
| International Markets and Sales | International |
| Research and Development Costs | R&D Costs |
| Sales, General, and Administrative | SG&A |
| Cost of Goods Sold | COGS |

## Word Count Examples

### 1 Word (Best)
- iPhone
- Services
- Mac
- iPad
- Wearables
- Americas
- Europe
- Asia
- Others

### 2 Words (Good)
- Other Products
- Cloud Services
- Hardware Sales
- Software Revenue
- Asia Pacific
- North America
- Operating Costs
- Gross Profit

### 3 Words (Maximum)
- Other Products & Services ✓ (acceptable)
- Asia Pacific Region ✓ (acceptable)
- Research & Development ✓ (acceptable)
- Sales & Marketing ✓ (acceptable)

### 4+ Words (Too Long)
- Wearable, Home, and Accessories ❌
- iPhone and Related Products ❌
- Services and Subscriptions Revenue ❌
- Other Products and Services ❌

## Implementation

This rule is enforced in:
1. `fastapi-backend/prompts/generate.md` - Main dashboard generation
2. `fastapi-backend/prompts/chat.md` - Temporary tab generation

**Validation Checklist Item:**
- ✅ All `chart.pie/donut` segment labels are 1-3 words maximum (prefer 1-2 words)

## Visual Impact

**Before (Long Labels):**
```
┌─────────────────────────────────┐
│  Pie Chart                      │
│                                 │
│      ●                          │
│    ●   ●    ■ Wearable, Home,  │
│   ●     ●      and Accessories  │ ← Overflows!
│    ●   ●    ■ iPhone and        │
│      ●         Related Products │ ← Overflows!
└─────────────────────────────────┘
```

**After (Short Labels):**
```
┌─────────────────────────────────┐
│  Pie Chart                      │
│                                 │
│      ●                          │
│    ●   ●    ■ Wearables    10% │
│   ●     ●   ■ iPhone       52% │ ← Clean!
│    ●   ●    ■ Services     20% │ ← Clean!
│      ●      ■ Mac          10% │
└─────────────────────────────────┘
```

## Summary

- **Keep it short:** 1-2 words is ideal
- **Maximum:** 3 words
- **Abbreviate:** Long names should be shortened
- **Be clear:** Labels should still be understandable
- **Test it:** If it looks crowded, make it shorter

This ensures pie/donut charts remain clean, readable, and professional.
