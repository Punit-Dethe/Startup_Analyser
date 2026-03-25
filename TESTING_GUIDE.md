# 🧪 End-to-End Testing Guide

## ✅ Servers Running

Both servers are now running and ready for testing:

- **Frontend**: http://localhost:3000 (Next.js)
- **Backend**: http://localhost:8000 (FastAPI)
- **Backend Type**: FastAPI (configured in `.env.local`)

## 🎯 Test Scenarios

### 1. Generate Dashboard (Main Feature)

**Steps:**
1. Open http://localhost:3000 in your browser
2. You'll see the KORE dashboard interface
3. In the input field, type a query like:
   - "Show me Apple Inc"
   - "Analyze Tesla stock performance"
   - "Compare Microsoft and Google"
   - "Show me startup funding trends"
4. Click "Generate" or press Enter
5. Wait 30-60 seconds (you'll see a loading indicator)
6. The dashboard should appear with multiple modules (charts, KPIs, tables, etc.)

**What to Check:**
- ✅ Dashboard loads without errors
- ✅ Multiple tabs appear (Overview, Financials, etc.)
- ✅ Modules render correctly (no "Module type not yet implemented" errors)
- ✅ Charts have data (not empty)
- ✅ Tables have proper structure with columns and rows
- ✅ KPIs show numbers
- ✅ No blank modules

### 2. Chat with Dashboard

**Steps:**
1. After generating a dashboard, look for the chat interface (usually on the right side or bottom)
2. Type a question related to the dashboard:
   - "Tell me more about the revenue"
   - "Compare with competitors"
   - "What are the key risks?"
   - "Show me market share data"
3. Press Enter or click Send
4. Wait 10-20 seconds for response

**What to Check:**
- ✅ Chat response appears
- ✅ Response is relevant to your question
- ✅ If it creates a temporary tab, it appears in the tab bar
- ✅ Temporary tabs have content (not blank)
- ✅ Chat provides detailed analysis (not just "Created temporary tab")

### 3. Temporary Tabs

**Steps:**
1. In chat, ask something that requires new data:
   - "Show me competitors"
   - "Create a comparison table"
   - "Show me historical trends"
2. The AI should create a temporary tab

**What to Check:**
- ✅ Temporary tab appears in tab bar
- ✅ Tab has a label (not just "temp_xxx")
- ✅ Tab contains 25 cells of modules
- ✅ Modules are properly sized (3x1, 2x2, etc.)
- ✅ No blank or empty modules
- ✅ Module types are correct (freeform, feed, table, metric.kpi, metric.dual, chart.*)

### 4. Module Types Test

Generate a dashboard and verify these module types work:

**Module Types to Check:**
- ✅ `freeform` - Text content with HTML/Markdown
- ✅ `feed` - List of items with titles and descriptions
- ✅ `table` - Data table with columns and rows
- ✅ `metric.kpi` - Single KPI with value and label
- ✅ `metric.dual` - Two KPIs side by side
- ✅ `chart.bar` - Bar chart
- ✅ `chart.line` - Line chart
- ✅ `chart.pie` - Pie chart
- ✅ `chart.doughnut` - Doughnut chart

**What to Check:**
- ✅ No "Module type not yet implemented" errors
- ✅ All modules render with data
- ✅ Charts are not empty
- ✅ Tables have proper structure

### 5. Performance Test

**Steps:**
1. Generate a complex dashboard (e.g., "Analyze top 10 tech companies")
2. Time how long it takes

**What to Check:**
- ✅ Simple queries: 15-30 seconds
- ✅ Medium queries: 30-60 seconds
- ✅ Complex queries: 60-120 seconds
- ✅ No timeout errors (even if it takes 2-3 minutes)
- ✅ Loading indicator shows progress

### 6. Error Handling Test

**Steps:**
1. Try an invalid query: "asdfghjkl"
2. Try a very vague query: "show me stuff"
3. Try a very long query (500+ characters)

**What to Check:**
- ✅ Graceful error messages (not crashes)
- ✅ Can try again after error
- ✅ Frontend doesn't break

### 7. Multiple Dashboards Test

**Steps:**
1. Generate a dashboard for "Apple"
2. Generate another dashboard for "Microsoft"
3. Switch between tabs

**What to Check:**
- ✅ Both dashboards load correctly
- ✅ Switching tabs works smoothly
- ✅ Data doesn't mix between dashboards
- ✅ Chat context switches with active tab

## 🐛 Common Issues to Watch For

### Issue: "Module type not yet implemented"
**Cause**: Backend is returning wrong module type names
**Check**: Look at browser console for the actual type name
**Expected Types**: freeform, feed, table, metric.kpi, metric.dual, chart.*

### Issue: Empty Charts
**Cause**: Chart data array is empty
**Check**: Open browser DevTools → Network → Find the generate request → Check response
**Expected**: `data.series` should have numbers, `data.labels` should have strings

### Issue: Blank Modules
**Cause**: Module data is missing or incomplete
**Check**: Browser console for errors
**Expected**: Every module should have `data` object with required fields

### Issue: Tables Not Rendering
**Cause**: Wrong table structure
**Check**: Table should have `columns: [{key, label}]` and `rows: [{objects}]`
**Not**: `headers: [strings]` and `rows: [[arrays]]`

### Issue: Timeout Errors
**Cause**: Query is too complex or Gemini is slow
**Check**: Backend logs in terminal
**Expected**: Should complete within 3 minutes

## 📊 Backend Logs

To monitor what's happening, watch the backend terminal:

```bash
# You'll see logs like:
{"timestamp": "...", "level": "INFO", "message": "Request started: POST /api/generate"}
{"timestamp": "...", "level": "INFO", "message": "Generating dashboard for query: ..."}
{"timestamp": "...", "level": "INFO", "message": "gemini_api_call_start"}
{"timestamp": "...", "level": "INFO", "message": "gemini_api_call_success"}
{"timestamp": "...", "level": "INFO", "message": "Dashboard validation passed"}
{"timestamp": "...", "level": "INFO", "message": "Dashboard generation completed successfully"}
```

**Red Flags:**
- ❌ "Gemini API error: 404" - Wrong model name
- ❌ "No valid JSON found in response" - JSON parsing issue
- ❌ "Validation error" - Dashboard structure is wrong
- ❌ "Request timed out" - Query took too long

## 🎉 Success Criteria

Your system is working correctly if:

1. ✅ Dashboards generate in 15-120 seconds
2. ✅ All module types render correctly
3. ✅ No blank or empty modules
4. ✅ Chat responds with relevant answers
5. ✅ Temporary tabs work correctly
6. ✅ No "Module type not yet implemented" errors
7. ✅ Tables have proper structure
8. ✅ Charts have data
9. ✅ No timeout errors
10. ✅ Can generate multiple dashboards

## 🔄 Switching Back to n8n (If Needed)

If you need to switch back to n8n:

1. Edit `kore-frontend/.env.local`:
   ```env
   NEXT_PUBLIC_BACKEND_TYPE=n8n
   ```

2. Restart frontend:
   ```bash
   # Stop: Ctrl+C in frontend terminal
   # Start: npm run dev
   ```

## 📝 Test Queries to Try

### Simple Queries (15-30 seconds)
- "Show me Apple Inc"
- "Analyze Tesla"
- "Microsoft overview"

### Medium Queries (30-60 seconds)
- "Compare Apple and Microsoft"
- "Show me top 5 tech companies"
- "Analyze startup funding trends"

### Complex Queries (60-120 seconds)
- "Compare top 10 tech companies"
- "Analyze global smartphone market"
- "Show me comprehensive analysis of Tesla including competitors, financials, and market trends"

## 🚀 Ready to Test!

1. Open http://localhost:3000
2. Start with a simple query: "Show me Apple Inc"
3. Wait for the dashboard to load
4. Try chatting: "Tell me more about revenue"
5. Test temporary tabs: "Show me competitors"
6. Try different queries and scenarios

**Have fun testing!** 🎉

If you encounter any issues, check:
1. Backend logs (FastAPI terminal)
2. Frontend logs (Next.js terminal)
3. Browser console (F12 → Console tab)
4. Browser network tab (F12 → Network tab)
