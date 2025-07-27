# 🚨 503 Service Unavailable - Quick Fix Guide

## 🎯 **Immediate Actions Required**

### 1. 🔑 **Add Environment Variables to Vercel Dashboard**

Go to: Vercel Dashboard → Your Project → Settings → Environment Variables

Add these **EXACT** variables:

```bash
JWT_SECRET=1234567890abcdef1234567890abcdef
MONGODB_URI=mongodb+srv://mateebsaleemi:zsvBJQDWWfdY6Wec@healthdecodeai.mukfwmb.mongodb.net/healthdecodeai?retryWrites=true&w=majority
GEMINI_API_KEY=AIzaSyA4Y_gpz0JvwJA4iBvevvJCh8lBFRaW3wo
OCR_SPACE_API_KEY=K83792497288957
RESEND_API_KEY=re_bd82iYeW_56ERFEj4X6PhNVZxnsLJnPLy
RESEND_FROM_EMAIL=onboarding@resend.dev
RESET_SECRET=1234567890abcdef1234567890abcdef
```

**⚠️ CRITICAL**: Set environment for **Production**, **Preview**, and **Development**

### 2. 🚀 **Redeploy After Adding Variables**

After adding environment variables:
1. Go to Deployments tab
2. Click "Redeploy" on latest deployment
3. Or push a new commit to trigger automatic deployment

### 3. ✅ **Verify the Fix**

Run verification script:
```bash
node verify-deployment.js https://healthdecodeai.vercel.app
```

Or manually test these endpoints:
- https://healthdecodeai.vercel.app/api/health
- https://healthdecodeai.vercel.app/api/diagnostic

### 4. 🔧 **Expected Results After Fix**

✅ **Health Check Should Return:**
```json
{
  "success": true,
  "message": "API is working",
  "environment": {
    "hasMongoUri": true,
    "hasJwtSecret": true,
    "hasGeminiKey": true
  }
}
```

❌ **If Still Getting 503:**
1. Check Vercel Function logs in dashboard
2. Verify all environment variables are exactly as shown above
3. Check MongoDB Atlas whitelist (allow all IPs: 0.0.0.0/0)
4. Verify Gemini API key is active

## 🔍 **Root Cause Analysis**

Your 503 error is caused by:

1. **Missing Environment Variables** - Vercel can't access your `.env.local` file
2. **Database Connection Failure** - MongoDB URI not available in production
3. **AI Service Authentication** - Gemini API key missing in production environment

## 📊 **Monitoring Commands**

```bash
# Test health endpoint
curl https://healthdecodeai.vercel.app/api/health

# Test with verbose output
curl -v https://healthdecodeai.vercel.app/api/health

# Test chat endpoint (should return 401 without auth)
curl -X POST https://healthdecodeai.vercel.app/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test","sessionId":"test"}'
```

## 🎯 **Success Indicators**

✅ Health endpoint returns 200 OK
✅ All environment variables show `true`
✅ Chat endpoint returns 401 (auth required) instead of 503
✅ No more "Service Unavailable" errors

---
**Next Step**: Add the environment variables to Vercel and redeploy!
