# KORE Troubleshooting Guide

**Date**: 2025-01-24

---

## Error 1: "POST /api/generate 500 in 56s"

### Symptoms
```
POST /api/generate 500 in 56s (next.js: 38ms, application-code: 56s)
[browser] [KORE] /api/generate failed, using dummy data: Error: /api/generate returned 500
```

### Root Causes

#### Cause 1: Wrong Field Name in n8n Gemini Node
**Problem**: Gemini node is looking for `prompt` but frontend sends `query`

**Old (Wrong)**:
```
{{ $('manuals').item.json.body.prompt }}
```

**New (Correct)**:
```
{{ $json.body.query }}
```

**How to Fix**:
1. Open n8n workflow `/webhook/generate`
2. Click on "Message a model" node (Gemini)
3. Find the "Prompt" or "User Message" field
4. Change to: `{{ $json.body.query }}`
5. Save and test

#### Cause 2: Optional Chaining in JavaScript Node
**Problem**: n8n doesn't support optional chaining (`?.`) syntax

**Old (Wrong)**:
```javascript
const response = $input.item.json.message?.trim();
```

**New (Correct)**:
```javascript
const response = $input.item.json.message.trim();
```

**How to Fix**:
1. Open n8n workflow `/webhook/generate`
2. Click on "Code in JavaScript" node
3. Find all instances of `?.`
4. Replace with regular `.` (ensure the property exists)
5. Save and test

#### Cause 3: Gemini Returns Invalid JSON
**Problem**: Gemini wraps JSON in markdown code fences

**Example Bad Response**:
```
```json
{
  "meta": { ... }
}
```
```

**Solution**: Add markdown fence removal in JavaScript node

```javascript
// Parse the Gemini response
const response = $input.item.json.message;

// Remove markdown code fences if present
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
  dashboard_state: null,
  generated_at: new Date().toISOString()
};
```

---

## Error 2: Two Generate Calls Triggered

### Symptoms
```
POST /api/generate 500 in 56s
POST /api/generate 200 in 68s
```
Two calls to `/api/generate` happen in quick succession.

### Root Cause
This happens when:
1. User submits initial query → First call
2. Chat AI returns NEW_DASHBOARD action → Second call

This is **EXPECTED BEHAVIOR** when:
- User is chatting with existing dashboard
- Chat AI decides a NEW_DASHBOARD is needed
- Frontend triggers generation with enriched prompt

### When It's a Problem
If you see two calls on initial page load, check:
1. Is there a duplicate event listener?
2. Is the form submitting twice?
3. Is React strict mode causing double renders?

### How to Debug
Add logging in `useDashboard.ts`:

```typescript
const generate = useCallback(async (query: string) => {
  console.log('[KORE] generate() called with:', query);
  setState(s => ({ ...s, isLoading: true, error: null }))
  // ... rest of function
}, [])
```

---

## Error 3: Chat Tries to Generate But Fails

### Symptoms
User asks "Please generate new tab" in chat, but generation fails.

### Root Cause
Chat AI returns `NEW_DASHBOARD` action, but:
1. The `new_prompt` is missing or malformed
2. The generation workflow has errors (see Error 1)

### How to Fix

#### Step 1: Check Chat Response
Add logging in `useDashboard.ts`:

```typescript
const sendChat = useCallback(async (userMessage: string) => {
  // ... existing code ...
  
  try {
    const result = await sendChatMessage(payload)
    console.log('[KORE] Chat result:', result);  // ADD THIS
    
    setState(s => {
      // ... rest of function
    })
  } catch (err) {
    // ... error handling
  }
}, [generate])
```

#### Step 2: Verify Chat Response Format
Expected format for NEW_DASHBOARD:
```json
{
  "action": "NEW_DASHBOARD",
  "message": "Generating new dashboard...",
  "new_prompt": "Current context: User is viewing Apple Inc...\nRequest: Compare with Samsung...\nGenerate comparison-focused dashboard."
}
```

#### Step 3: Check n8n Chat Workflow
1. Open `/webhook/chat` workflow
2. Verify Gemini node has correct system prompt
3. Verify JavaScript node validates action types
4. Test with curl (see QUICK_REFERENCE.md)

---

## Error 4: Partial Refresh Removed Modules

### Symptoms
After chat interaction, only 2 modules visible instead of full dashboard.

### Root Cause
This was the old REFRESH action behavior, which has been **REMOVED**.

### Current Behavior
- ❌ REFRESH action no longer exists
- ✅ Only CHAT and NEW_DASHBOARD actions

### If You Still See This
1. Check n8n chat workflow - ensure it only returns CHAT or NEW_DASHBOARD
2. Check `useDashboard.ts` - REFRESH handler should be removed
3. Clear browser localStorage: `localStorage.clear()`
4. Reload page

---

## Error 5: Always Generates Same 5 Tabs

### Symptoms
Every generation creates: "Overview, Financials, Market, Business Model, Competitors"

### Root Cause
AI is defaulting to template behavior instead of thinking dynamically.

### How to Fix

#### Step 1: Verify System Prompt
Ensure n8n Gemini node uses the FULL `N8N_GEMINI_SYSTEM_PROMPT.md` content, including:
- "YOUR THINKING PROCESS" section
- "DYNAMIC TAB CREATION EXAMPLES" section
- "Module Selection Philosophy" section

#### Step 2: Test with Focused Queries
Try these test cases:

**Test 1: Deep Dive (Should be 2-3 tabs)**
```
Deep dive into Apple's revenue model
```
Expected: Revenue Streams, Pricing Strategy, Growth Drivers

**Test 2: Comparison (Should be 3-4 tabs)**
```
Compare Apple with Samsung and Google
```
Expected: Head-to-Head, Market Position, Product Portfolio, Financial Comparison

**Test 3: Startup Evaluation (Should be 5 tabs, but different names)**
```
Evaluate a food delivery startup in India with ₹50L budget
```
Expected: Market Opportunity, Unit Economics, Competitive Landscape, Risk Assessment, Launch Strategy

#### Step 3: Strengthen the Prompt
If AI still defaults to template, add this to the top of `N8N_GEMINI_SYSTEM_PROMPT.md`:

```markdown
**CRITICAL INSTRUCTION**: You MUST NOT default to the generic 5-tab structure (Overview, Financials, Market, Business Model, Competitors). This is ONE POSSIBLE OUTPUT, not a template. Think about what THIS SPECIFIC REQUEST needs, then create tabs accordingly.
```

---

## Error 6: Context Not Passed to NEW_DASHBOARD

### Symptoms
When chat triggers NEW_DASHBOARD, the generation doesn't know about current dashboard state.

### Root Cause
Chat AI's `new_prompt` doesn't include enough context.

### How to Fix

#### Step 1: Check Chat System Prompt
Ensure `N8N_CHAT_SYSTEM_PROMPT.md` includes this example:

```markdown
**Example NEW_DASHBOARD prompt**:
```
Current context: User is viewing Apple Inc main analysis dashboard.
Request: Compare Apple with Samsung and Google across financial performance and market position.
Analysis type: Head-to-head competitor comparison.
Focus: Financial metrics (revenue, margins, growth) and market share data.
Generate a comparison-focused dashboard with 3-4 tabs optimized for side-by-side analysis.
```
```

#### Step 2: Verify Context Variables
In n8n chat workflow, ensure these are accessible:
- `{{ $json.body.context.subject }}`
- `{{ $json.body.context.active_tab }}`
- `{{ $json.body.context.visible_modules }}`

#### Step 3: Test Context Handoff
```bash
curl -X POST http://localhost:5678/webhook/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Compare with Samsung",
    "history": [],
    "context": {
      "subject": "Apple Inc",
      "active_tab": "overview",
      "visible_modules": [
        {"id": "mod-1", "type": "chart.bar", "title": "Revenue"}
      ]
    }
  }'
```

Check that the response includes a rich `new_prompt` with context.

---

## Debugging Tools

### Browser Console
```javascript
// Check current dashboard state
JSON.parse(localStorage.getItem('kore_dashboard'))

// Check compact state
JSON.parse(localStorage.getItem('kore_state'))

// Check chat history
JSON.parse(localStorage.getItem('kore_history'))

// Clear everything
localStorage.clear()
```

### n8n Workflow Testing
1. Open workflow in n8n
2. Click "Execute Workflow" button
3. Manually provide test data
4. Check each node's output
5. Look for errors in execution log

### Network Tab
1. Open browser DevTools → Network tab
2. Filter by "Fetch/XHR"
3. Look for `/api/generate` and `/api/chat` calls
4. Check request payload and response
5. Look for 500 errors

---

## Quick Fixes

### Reset Everything
```javascript
// In browser console
localStorage.clear()
location.reload()
```

### Test n8n Directly
```bash
# Test generation
curl -X POST http://localhost:5678/webhook/generate \
  -H "Content-Type: application/json" \
  -d '{"query": "Analyze Apple Inc"}'

# Test chat
curl -X POST http://localhost:5678/webhook/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Why?", "history": [], "context": {"subject": "Apple", "active_tab": "overview", "visible_modules": []}}'
```

### Check n8n Logs
1. Open n8n UI
2. Go to "Executions" tab
3. Find failed executions
4. Click to see detailed error
5. Check each node's input/output

---

## Still Having Issues?

### Checklist
- [ ] n8n is running (`http://localhost:5678`)
- [ ] Webhooks are configured correctly
- [ ] `.env.local` has correct webhook URLs
- [ ] System prompts are up to date
- [ ] JavaScript nodes don't use optional chaining
- [ ] Gemini nodes use correct field names
- [ ] Frontend code is updated (types.ts, useDashboard.ts)
- [ ] Browser localStorage is cleared
- [ ] No TypeScript errors (`npm run build`)

### Get More Help
1. Check n8n execution logs for detailed errors
2. Test workflows with curl commands
3. Add console.log statements in frontend code
4. Check browser Network tab for API responses
5. Verify Gemini API key is valid and has quota

---

**Last Updated**: 2025-01-24
