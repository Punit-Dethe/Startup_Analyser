# Groq Integration - Deployment Checklist

## ✅ Pre-Deployment Verification

### 1. Dependencies Installed

- [ ] `groq==0.11.0` added to `requirements.txt`
- [ ] Run: `python -m pip install groq`
- [ ] Verify: `python -c "from groq import Groq; print('✓ Groq installed')"`

### 2. Files Created

- [ ] `fastapi-backend/app/integrations/groq_client.py`
- [ ] `fastapi-backend/app/integrations/ai_client_factory.py`
- [ ] `fastapi-backend/app/integrations/__init__.py`
- [ ] `fastapi-backend/test_taco_integration.py`

### 3. Files Modified

- [ ] `fastapi-backend/app/dependencies.py`
- [ ] `fastapi-backend/app/services/generate_service.py`
- [ ] `fastapi-backend/app/services/chat_service.py`
- [ ] `fastapi-backend/.env`
- [ ] `kore-frontend/.env.local`
- [ ] `kore-frontend/src/app/page.tsx`
- [ ] `kore-frontend/src/components/layout/Topbar.tsx`

### 4. Configuration

- [ ] Frontend `.env.local` has TACO key: `NEXT_PUBLIC_GEMINI_KEY_1=gsk_...`
- [ ] Backend `.env` documented for Groq support
- [ ] API key starts with `gsk_`

### 5. Tests Passing

Run: `python fastapi-backend/test_taco_integration.py`

- [ ] Test 1: API Key Detection ✅
- [ ] Test 2: Client Creation ✅
- [ ] Test 3: Groq API Call ✅
- [ ] Test 4: Full Integration Flow ✅

Expected output:
```
🎉 ALL TESTS PASSED!
✅ TACO integration is working correctly!
```

## 🚀 Deployment Steps

### Step 1: Backend Deployment

```bash
cd fastapi-backend

# Install dependencies
python -m pip install -r requirements.txt

# Verify Groq is installed
python -c "from groq import Groq; print('✓ Groq ready')"

# Run tests
python test_taco_integration.py

# Start backend
python -m uvicorn app.main:app --reload --port 8000
```

**Verify:**
- [ ] Backend starts without errors
- [ ] Logs show: "Creating Groq client" when TACO is used
- [ ] No import errors

### Step 2: Frontend Deployment

```bash
cd kore-frontend

# Install dependencies (if needed)
npm install

# Verify environment variables
cat .env.local | grep GEMINI_KEY_1

# Start frontend
npm run dev
```

**Verify:**
- [ ] Frontend starts on http://localhost:3000
- [ ] TACO appears in API key dropdown
- [ ] No console errors

### Step 3: Integration Test

1. **Open Browser**
   - [ ] Navigate to http://localhost:3000

2. **Select TACO**
   - [ ] Click API key dropdown
   - [ ] Select "TACO"
   - [ ] Verify selection persists

3. **Generate Dashboard**
   - [ ] Enter query: "Analyze ChargeConnect startup"
   - [ ] Click "Analyze"
   - [ ] Wait for response

4. **Verify Response**
   - [ ] Dashboard generates successfully
   - [ ] No errors in browser console
   - [ ] No errors in backend logs
   - [ ] Response time is fast (1-3 seconds)

5. **Check Backend Logs**
   - [ ] Look for: "Creating Groq client"
   - [ ] Look for: "Using model: llama-3.3-70b-versatile"
   - [ ] Look for: "groq_api_call_success"

### Step 4: Test Other Keys

1. **Select Max (Gemini)**
   - [ ] Select "Max" from dropdown
   - [ ] Generate dashboard
   - [ ] Verify it uses Gemini (check logs)

2. **Switch Back to TACO**
   - [ ] Select "TACO" again
   - [ ] Generate dashboard
   - [ ] Verify it uses Groq (check logs)

## 🔍 Verification Checklist

### Functional Tests

- [ ] TACO selection works
- [ ] Dashboard generation works with TACO
- [ ] Chat works with TACO
- [ ] Switching between keys works
- [ ] Error handling works (try invalid query)

### Performance Tests

- [ ] Response time < 5 seconds for simple queries
- [ ] Response time < 10 seconds for complex queries
- [ ] No memory leaks (check after multiple requests)

### Error Handling Tests

- [ ] Invalid API key shows error
- [ ] Rate limit handled gracefully
- [ ] Timeout handled gracefully
- [ ] Network error handled gracefully

## 📊 Monitoring

### Backend Logs to Watch

```bash
# Watch backend logs
tail -f logs/kore.log

# Look for these patterns:
# ✅ "Creating Groq client"
# ✅ "groq_api_call_start"
# ✅ "groq_api_call_success"
# ❌ "Groq API error"
# ❌ "Rate limit exceeded"
```

### Frontend Console

```javascript
// Open browser console (F12)
// Look for these patterns:
// ✅ "API Key: TACO"
// ✅ "Response received"
// ❌ "API Error"
// ❌ "Network Error"
```

## 🐛 Troubleshooting

### Issue: "Module 'groq' not found"

**Solution:**
```bash
cd fastapi-backend
python -m pip install groq
```

### Issue: "Invalid API key format"

**Solution:**
- Verify key starts with `gsk_`
- Check `.env.local` has correct key
- Restart frontend after changing `.env.local`

### Issue: "TACO not appearing in dropdown"

**Solution:**
- Check `kore-frontend/src/app/page.tsx` has "TACO"
- Check `kore-frontend/src/components/layout/Topbar.tsx` has "TACO"
- Restart frontend

### Issue: "Still using Gemini instead of Groq"

**Solution:**
- Check backend logs for "Creating Groq client"
- Verify API key in request header
- Run: `python test_taco_integration.py`

### Issue: "Rate limit exceeded"

**Solution:**
- Groq has generous limits, but if exceeded:
- Wait 60 seconds
- System will auto-retry
- Or switch to another key

## 📝 Post-Deployment

### Documentation

- [ ] Update README with TACO information
- [ ] Document Groq API key in team wiki
- [ ] Share TACO_QUICKSTART.md with team

### Monitoring

- [ ] Set up alerts for API errors
- [ ] Monitor response times
- [ ] Track usage by provider

### Backup Plan

- [ ] Keep Gemini keys active
- [ ] Document rollback procedure
- [ ] Test switching between providers

## 🎯 Success Criteria

### Must Have

- [x] TACO appears in dropdown
- [x] Selecting TACO uses Groq API
- [x] Dashboard generation works
- [x] Chat works
- [x] All tests pass

### Nice to Have

- [ ] Response time < 3 seconds average
- [ ] Zero errors in first 100 requests
- [ ] Team trained on TACO usage

## 🎉 Deployment Complete!

Once all checkboxes are checked:

✅ **Groq integration is live!**
✅ **TACO is ready to use!**
✅ **Team can start using ultra-fast inference!**

---

## Quick Reference

### Start Backend
```bash
cd fastapi-backend
python -m uvicorn app.main:app --reload
```

### Start Frontend
```bash
cd kore-frontend
npm run dev
```

### Run Tests
```bash
cd fastapi-backend
python test_taco_integration.py
```

### Check Logs
```bash
# Backend
tail -f fastapi-backend/logs/kore.log

# Frontend
# Open browser console (F12)
```

---

**Need help?** Check:
- `TACO_QUICKSTART.md` - Quick start guide
- `GROQ_INTEGRATION.md` - Complete technical guide
- `GROQ_ARCHITECTURE.md` - Architecture diagrams
- `GROQ_INTEGRATION_SUMMARY.md` - Complete summary
