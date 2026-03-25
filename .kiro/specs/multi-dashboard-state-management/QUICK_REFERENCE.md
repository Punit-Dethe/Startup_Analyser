# KORE Two-State Model - Quick Reference

**Last Updated**: 2025-01-24

---

## The Two States

### 1. CHAT
**When**: User asks questions about existing dashboard  
**Behavior**: Answer in chat, no dashboard changes  
**Frontend**: No API calls to `/api/generate`  
**Example**: "Why did revenue drop in Q3?"

### 2. NEW_DASHBOARD
**When**: User wants different analysis requiring new structure  
**Behavior**: Generate completely new dashboard  
**Frontend**: Calls `/api/generate` with enriched prompt  
**Example**: "Compare Apple with Samsung"

---

## Frontend → n8n Data Flow

### Generation Flow
```
User submits query
  ↓
Frontend: POST /api/generate
  Body: { query: "Analyze Apple Inc" }
  ↓
n8n: /webhook/generate
  Gemini receives: $json.body.query
  ↓
Gemini: Thinks → Rationalizes → Decides → Generates
  Returns: Raw JSON (no markdown fences)
  ↓
JavaScript node: Parses JSON, wraps in response
  Returns: { dashboard, dashboard_state, generated_at }
  ↓
Frontend: Renders dashboard
```

### Chat Flow
```
User sends chat message
  ↓
Frontend: POST /api/chat
  Body: { message, history, context }
  ↓
n8n: /webhook/chat
  Gemini receives: $json.body.message + context
  ↓
Gemini: Decides CHAT or NEW_DASHBOARD
  Returns: { action, message, new_prompt }
  ↓
Frontend: 
  - If CHAT: Display message
  - If NEW_DASHBOARD: Call /api/generate with new_prompt
```

---

## Key Files

| File | Purpose | Status |
|------|---------|--------|
| `N8N_GEMINI_SYSTEM_PROMPT.md` | Generation AI instructions | ✅ Updated |
| `N8N_CHAT_SYSTEM_PROMPT.md` | Chat AI instructions | ✅ Updated |
| `src/lib/types.ts` | TypeScript types | ✅ Updated |
| `src/hooks/useDashboard.ts` | State management | ✅ Updated |
| `src/lib/api.ts` | API calls | ✅ No changes needed |

---

## n8n Configuration Checklist

### Generation Workflow (`/webhook/generate`)
- [ ] Gemini node uses `{{ $json.body.query }}` (NOT `prompt`)
- [ ] System prompt is full `N8N_GEMINI_SYSTEM_PROMPT.md`
- [ ] JavaScript node removes markdown fences
- [ ] JavaScript node doesn't use optional chaining (`?.`)
- [ ] Response format: `{ dashboard, dashboard_state, generated_at }`

### Chat Workflow (`/webhook/chat`)
- [ ] Gemini node uses `{{ $json.body.message }}`
- [ ] System prompt includes context variables
- [ ] JavaScript node validates action (CHAT or NEW_DASHBOARD only)
- [ ] JavaScript node removes markdown fences
- [ ] Response format: `{ action, message, new_prompt }`

---

## Testing Commands

### Test Generation (Direct n8n)
```bash
curl -X POST http://localhost:5678/webhook/generate \
  -H "Content-Type: application/json" \
  -d '{"query": "Analyze Apple Inc"}'
```

### Test Chat (Direct n8n)
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

### Test Frontend (Browser Console)
```javascript
// Test generation
fetch('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'Analyze Apple Inc' })
}).then(r => r.json()).then(console.log)

// Test chat
fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Why did revenue drop?',
    history: [],
    context: { subject: 'Apple Inc', active_tab: 'overview', visible_modules: [] }
  })
}).then(r => r.json()).then(console.log)
```

---

## Common Errors & Solutions

### Error: "Bad request" in generation
**Cause**: Gemini node looking for wrong field  
**Fix**: Change to `{{ $json.body.query }}`

### Error: 500 in generation
**Cause**: JavaScript node syntax error (optional chaining)  
**Fix**: Remove `?.` operators, use regular `.`

### Error: Frontend doesn't recognize action
**Cause**: Chat returns old action names (REFRESH, RELOAD)  
**Fix**: Update chat system prompt, ensure only CHAT or NEW_DASHBOARD

### Error: Always generates 5 tabs
**Cause**: AI defaulting to template  
**Fix**: Strengthen generation prompt, add more dynamic examples

---

## Success Criteria

✅ Generation returns valid JSON  
✅ Chat returns correct action types  
✅ Dynamic tab creation (2-7 tabs based on request)  
✅ Descriptive tab names (not generic)  
✅ Flexible module selection (no templates)  
✅ Context handoff works (NEW_DASHBOARD gets full context)  
✅ 5x5 grid rule enforced (every tab fills 25 cells)

---

## What Changed (Summary)

### Removed
- ❌ REFRESH action (deprecated)
- ❌ RELOAD action (renamed to NEW_DASHBOARD)
- ❌ Module patching logic in useDashboard

### Added
- ✅ NEW_DASHBOARD action (replaces RELOAD)
- ✅ Dynamic tab creation philosophy
- ✅ Module selection philosophy
- ✅ Rich context handoff

### Updated
- ✅ ChatResponse type (only CHAT and NEW_DASHBOARD)
- ✅ useDashboard hook (removed REFRESH handler)
- ✅ Generation prompt (emphasizes dynamic thinking)
- ✅ Chat prompt (two actions only)

---

**Next**: Configure n8n workflows and test!
