# N8N Integration Guide - Two-State Model

**Date**: 2025-01-24  
**Status**: Ready for n8n Configuration

---

## Overview

The KORE frontend now implements a clean two-state model:
1. **CHAT**: Simple responses, no dashboard changes
2. **NEW_DASHBOARD**: Complete dashboard regeneration with dynamic structure

This guide explains exactly how to configure your n8n workflows.

---

## Workflow 1: Generation Pipeline (`/webhook/generate`)

### Input from Frontend

```json
{
  "query": "User's request text here"
}
```

**Example**:
```json
{
  "query": "Analyze Apple Inc"
}
```

### n8n Workflow Structure

1. **Webhook Node** (Trigger)
   - Method: POST
   - Path: `/webhook/generate`
   - Response Mode: "When Last Node Finishes"

2. **Gemini Node** (Message a model)
   - System Prompt: Use `N8N_GEMINI_SYSTEM_PROMPT.md` (full content)
   - User Message: `{{ $json.body.query }}`
   - **CRITICAL**: Use `$json.body.query`, NOT `$json.body.prompt`

3. **JavaScript Code Node** (Parse JSON)
   ```javascript
   // Parse the Gemini response (which should be raw JSON)
   const response = $input.item.json.message;
   
   // Remove markdown code fences if present (AI sometimes adds them)
   let cleaned = response.trim();
   if (cleaned.startsWith('```json')) {
     cleaned = cleaned.replace(/^```json\n/, '').replace(/\n```$/, '');
   } else if (cleaned.startsWith('```')) {
     cleaned = cleaned.replace(/^```\n/, '').replace(/\n```$/, '');
   }
   
   // Parse the JSON
   const dashboard = JSON.parse(cleaned);
   
   // Return the expected structure
   return {
     dashboard: dashboard,
     dashboard_state: null,  // Frontend will compute this
     generated_at: new Date().toISOString()
   };
   ```

4. **Respond to Webhook Node**
   - Response Body: `{{ $json }}`

### Expected Output to Frontend

```json
{
  "dashboard": {
    "meta": { ... },
    "tabs": [ ... ],
    "chat_intro": "...",
    "modules": [ ... ]
  },
  "dashboard_state": null,
  "generated_at": "2025-01-24T10:30:00.000Z"
}
```

**Note**: `dashboard_state` can be `null` - the frontend will compute it using `summarizeDashboard()`.

---

## Workflow 2: Chat Pipeline (`/webhook/chat`)

### Input from Frontend

```json
{
  "message": "User's chat message",
  "history": [
    { "role": "user", "content": "Previous message" },
    { "role": "assistant", "content": "Previous response" }
  ],
  "context": {
    "subject": "Apple Inc",
    "active_tab": "overview",
    "visible_modules": [
      {
        "id": "mod-1",
        "type": "chart.bar",
        "size": "3x2",
        "title": "Revenue Trend",
        "accent": "primary",
        "value": null
      }
    ]
  }
}
```

### n8n Workflow Structure

1. **Webhook Node** (Trigger)
   - Method: POST
   - Path: `/webhook/chat`
   - Response Mode: "When Last Node Finishes"

2. **Gemini Node** (Message a model)
   - System Prompt: Use `N8N_CHAT_SYSTEM_PROMPT.md` (full content with context variables)
   - User Message: `{{ $json.body.message }}`
   - **Context Variables**: The system prompt uses these:
     - `{{ $json.body.context.subject }}`
     - `{{ $json.body.context.active_tab }}`
     - `{{ JSON.stringify($json.body.context.visible_modules, null, 2) }}`

3. **JavaScript Code Node** (Parse JSON Response)
   ```javascript
   // Parse the Gemini response (should be raw JSON)
   const response = $input.item.json.message;
   
   // Remove markdown code fences if present
   let cleaned = response.trim();
   if (cleaned.startsWith('```json')) {
     cleaned = cleaned.replace(/^```json\n/, '').replace(/\n```$/, '');
   } else if (cleaned.startsWith('```')) {
     cleaned = cleaned.replace(/^```\n/, '').replace(/\n```$/, '');
   }
   
   // Parse the JSON
   const result = JSON.parse(cleaned);
   
   // Validate action
   if (result.action !== 'CHAT' && result.action !== 'NEW_DASHBOARD') {
     throw new Error('Invalid action: ' + result.action);
   }
   
   return result;
   ```

4. **Respond to Webhook Node**
   - Response Body: `{{ $json }}`

### Expected Output to Frontend

**For CHAT action**:
```json
{
  "action": "CHAT",
  "message": "Detailed analytical response with markdown/HTML...",
  "new_prompt": null
}
```

**For NEW_DASHBOARD action**:
```json
{
  "action": "NEW_DASHBOARD",
  "message": "Generating a focused dashboard for competitor comparison...",
  "new_prompt": "Current context: User is viewing Apple Inc main analysis dashboard.\nRequest: Compare Apple with Samsung and Google across financial performance and market position.\nAnalysis type: Head-to-head competitor comparison.\nFocus: Financial metrics (revenue, margins, growth) and market share data.\nGenerate a comparison-focused dashboard with 3-4 tabs optimized for side-by-side analysis."
}
```

---

## Common Issues & Fixes

### Issue 1: "Bad request" or 500 errors in generation

**Symptom**: `/api/generate` returns 500, frontend falls back to dummy data

**Causes**:
1. Gemini node is looking for wrong field name
   - ❌ `{{ $('manuals').item.json.body.prompt }}`
   - ✅ `{{ $json.body.query }}`

2. JavaScript node uses optional chaining (not supported in n8n)
   - ❌ `response?.trim()`
   - ✅ `response.trim()`

3. Gemini returns markdown-wrapped JSON instead of raw JSON
   - Fix: Add markdown fence removal in JavaScript node (see code above)

### Issue 2: Chat returns wrong action format

**Symptom**: Frontend doesn't recognize the action

**Causes**:
1. Gemini returns old action names (REFRESH, RELOAD)
   - Fix: Update system prompt to only use CHAT and NEW_DASHBOARD

2. Response is not valid JSON
   - Fix: Ensure Gemini prompt emphasizes "raw JSON only, no markdown fences"

### Issue 3: Generation creates same 5 tabs every time

**Symptom**: Always generates "Overview, Financials, Market, Business Model, Competitors"

**Causes**:
1. System prompt not emphasizing dynamic tab creation
   - Fix: Ensure `N8N_GEMINI_SYSTEM_PROMPT.md` includes the "Dynamic Tab Creation Examples" section

2. AI defaulting to template behavior
   - Fix: Add more examples showing 2-3 tab and 6-7 tab scenarios

---

## Testing Checklist

### Test Generation Pipeline

1. **Test Basic Generation**
   ```bash
   curl -X POST http://localhost:5678/webhook/generate \
     -H "Content-Type: application/json" \
     -d '{"query": "Analyze Apple Inc"}'
   ```
   - Should return valid JSON with dashboard structure
   - Should have 5-6 tabs (comprehensive analysis)

2. **Test Focused Generation**
   ```bash
   curl -X POST http://localhost:5678/webhook/generate \
     -H "Content-Type: application/json" \
     -d '{"query": "Deep dive into Apple revenue model"}'
   ```
   - Should return 2-3 tabs focused on revenue
   - Tab names should be revenue-specific

3. **Test Comparison Generation**
   ```bash
   curl -X POST http://localhost:5678/webhook/generate \
     -H "Content-Type: application/json" \
     -d '{"query": "Compare Apple with Samsung and Google"}'
   ```
   - Should return 3-4 tabs focused on comparison
   - Should NOT be the generic 5-tab structure

### Test Chat Pipeline

1. **Test CHAT Action**
   ```bash
   curl -X POST http://localhost:5678/webhook/chat \
     -H "Content-Type: application/json" \
     -d '{
       "message": "Why did revenue drop in Q3?",
       "history": [],
       "context": {
         "subject": "Apple Inc",
         "active_tab": "financials",
         "visible_modules": []
       }
     }'
   ```
   - Should return `{"action": "CHAT", "message": "...", "new_prompt": null}`

2. **Test NEW_DASHBOARD Action**
   ```bash
   curl -X POST http://localhost:5678/webhook/chat \
     -H "Content-Type: application/json" \
     -d '{
       "message": "Compare Apple with Samsung",
       "history": [],
       "context": {
         "subject": "Apple Inc",
         "active_tab": "overview",
         "visible_modules": []
       }
     }'
   ```
   - Should return `{"action": "NEW_DASHBOARD", "message": "...", "new_prompt": "..."}`
   - `new_prompt` should include context about current dashboard

---

## System Prompt Files

### Generation Prompt
**File**: `kore-frontend/N8N_GEMINI_SYSTEM_PROMPT.md`
**Use in**: Gemini node in `/webhook/generate` workflow
**Key sections**:
- Thinking process (understand → rationalize → decide → generate)
- Dynamic tab creation examples
- Module selection philosophy (no templates!)
- 5x5 grid: 100% fill requirement with filler blocks (NO layout templates)
- Table/feed sizing rules (≤6 rows = height 2, ≥7 rows = height 3-4)

### Chat Prompt
**File**: `kore-frontend/N8N_CHAT_SYSTEM_PROMPT.md`
**Use in**: Gemini node in `/webhook/chat` workflow
**Key sections**:
- Two actions (CHAT, NEW_DASHBOARD)
- Decision guide
- Context variables
- Rich context handoff for NEW_DASHBOARD

---

## Next Steps

1. ✅ Update n8n generation workflow:
   - Fix Gemini node to use `{{ $json.body.query }}`
   - Update JavaScript node to remove optional chaining
   - Add markdown fence removal

2. ✅ Update n8n chat workflow:
   - Ensure system prompt uses context variables correctly
   - Validate response format (only CHAT or NEW_DASHBOARD)

3. ✅ Test both workflows:
   - Run curl tests above
   - Verify dynamic tab creation
   - Verify context handoff

4. ✅ Test from frontend:
   - Generate new dashboard
   - Chat with existing dashboard
   - Trigger NEW_DASHBOARD from chat

---

**Status**: Ready for n8n configuration and testing
