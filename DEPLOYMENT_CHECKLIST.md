# 🚀 VERCEL DEPLOYMENT CHECKLIST

## ✅ Pre-Deployment Setup

### 1. Database Setup (MongoDB Atlas)
- [ ] Create MongoDB Atlas account
- [ ] Create a new cluster (free tier is fine)
- [ ] Create database user with read/write permissions
- [ ] Whitelist all IPs (0.0.0.0/0) for Vercel access
- [ ] Get connection string

### 2. Email Service Setup (Resend)
- [ ] Create Resend account
- [ ] Get API key from dashboard
- [ ] Verify your domain (optional, can use resend.dev for testing)

### 3. Generate JWT Secret
```bash
# Run this command to generate a secure JWT secret:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📝 Environment Variables for Vercel

Go to your Vercel project → Settings → Environment Variables and add:

```bash
# Authentication (CRITICAL)
JWT_SECRET=your-generated-32-character-secret-here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/healthdecodeai?retryWrites=true&w=majority

# Email Service (CRITICAL)
RESEND_API_KEY=re_your_actual_resend_api_key_here
RESEND_FROM_EMAIL=noreply@yourdomain.com

# App Configuration
NEXT_PUBLIC_APP_NAME=HealthDecodeAI
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_API_URL=/api
NODE_ENV=production
```

## 🔧 Vercel Deployment Steps

### 1. Deploy to Vercel
```bash
# Option 1: Connect GitHub repo to Vercel
# - Go to vercel.com
# - Import your GitHub repository
# - Add environment variables
# - Deploy

# Option 2: Use Vercel CLI
npm i -g vercel
vercel
# Follow the prompts
```

### 2. Set Environment Variables
- Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- Add all the variables listed above
- Make sure to set them for all environments (Production, Preview, Development)

### 3. Redeploy After Adding Environment Variables
- After adding env vars, trigger a new deployment
- Go to Deployments tab and redeploy the latest deployment

## 🐛 Troubleshooting Production Issues

### Common Error: "Invalid email or password"
**Possible Causes:**
1. MONGODB_URI not set or incorrect
2. JWT_SECRET not set
3. Database connection issues
4. User doesn't exist in production database

**Debug Steps:**
1. Check Vercel function logs:
   - Go to Vercel Dashboard → Your Project → Functions
   - Click on the failing function to see logs
2. Test database connection directly
3. Verify environment variables are set

### Common Error: "Server error" on signup/forgot password
**Possible Causes:**
1. RESEND_API_KEY not set or invalid
2. JWT_SECRET missing
3. MongoDB connection issues

**Debug Steps:**
1. Check function logs for detailed error messages
2. Test each endpoint individually
3. Verify email service configuration

### Test Your Deployment

#### Test Login Endpoint:
```bash
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpassword123"}'
```

#### Test Signup Endpoint:
```bash
curl -X POST https://your-app.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"testpassword123"}'
```

#### Test Forgot Password:
```bash
curl -X POST https://your-app.vercel.app/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## 📋 Final Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] Database connection string obtained
- [ ] Resend account created and API key obtained
- [ ] JWT secret generated (32+ characters)
- [ ] All environment variables added to Vercel
- [ ] Project deployed to Vercel
- [ ] Environment variables applied to all environments
- [ ] Redeployment triggered after adding env vars
- [ ] Test login functionality
- [ ] Test signup functionality
- [ ] Test forgot password functionality
- [ ] Check Vercel function logs for any errors

## 🔍 Monitoring Your App

1. **Vercel Analytics**: Monitor performance and errors
2. **Function Logs**: Check for runtime errors
3. **MongoDB Atlas Monitoring**: Monitor database performance
4. **Resend Dashboard**: Monitor email delivery

## 🆘 If You're Still Having Issues

1. **Check Function Logs**: Most important debugging tool
2. **Test Locally with Production Env Vars**: 
   ```bash
   # Create .env.production.local with production values
   npm run build
   npm run start
   ```
3. **Verify Each Service Individually**:
   - Test MongoDB connection
   - Test Resend API key
   - Verify JWT secret format

## 📞 Success Indicators

✅ **Login works**: Users can sign in with existing credentials
✅ **Signup works**: New users can create accounts
✅ **Forgot password works**: Password reset emails are sent
✅ **Dashboard access**: Authenticated users can access protected routes
✅ **No console errors**: Check browser console and Vercel logs

Your HealthDecodeAI app should now be fully functional on Vercel! 🎉
