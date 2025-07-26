# Vercel Deployment Guide for HealthDecodeAI

## 🚀 Quick Setup Steps

### 1. Database Setup (MongoDB Atlas)
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free cluster
3. Create a database user
4. Get your connection string
5. Whitelist Vercel IPs (0.0.0.0/0 for all IPs)

### 2. Environment Variables in Vercel
Go to your Vercel project settings → Environment Variables and add:

```bash
# Required for authentication
JWT_SECRET=your-super-secure-jwt-secret-at-least-32-characters-long
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/healthdecodeai?retryWrites=true&w=majority

# Required for email functionality
RESEND_API_KEY=re_your_actual_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# App configuration
NEXT_PUBLIC_APP_NAME=HealthDecodeAI
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_API_URL=/api
NODE_ENV=production
```

### 3. Generate JWT Secret
Run this command to generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Common Issues & Solutions

#### Issue: "Invalid email or password" on working credentials
**Cause**: Missing environment variables or database connection issues
**Solution**: 
- Check Vercel logs for detailed error messages
- Verify all environment variables are set
- Test database connection

#### Issue: "Server error" on signup/forgot password
**Cause**: Missing JWT_SECRET or RESEND_API_KEY
**Solution**: 
- Add all required environment variables
- Verify Resend API key is valid

#### Issue: Authentication works locally but not in production
**Cause**: Cookie settings or environment differences
**Solution**: 
- Check cookie sameSite settings
- Verify domain configuration
- Test with Vercel preview deployments

### 5. Debugging Production Issues

1. **Check Vercel Function Logs**:
   - Go to Vercel Dashboard → Your Project → Functions tab
   - Click on a function to see logs

2. **Test API Endpoints Directly**:
   ```bash
   curl -X POST https://your-app.vercel.app/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"testpassword"}'
   ```

3. **Monitor Environment Variables**:
   - Add logging to verify env vars are loaded
   - Check for typos in variable names

### 6. Security Checklist
- [ ] Strong JWT secret (32+ characters)
- [ ] Database connection uses SSL
- [ ] CORS configured properly
- [ ] Rate limiting implemented
- [ ] Environment variables properly set
- [ ] No secrets in code

### 7. Performance Optimization
- [ ] Database connection pooling
- [ ] API response caching
- [ ] Image optimization
- [ ] Bundle size optimization

## 🔧 Troubleshooting Commands

Test your deployment:
```bash
# Test login endpoint
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Test signup endpoint  
curl -X POST https://your-app.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"password123"}'
```

## 📞 Need Help?
- Check Vercel function logs for detailed error messages
- Test locally with production environment variables
- Verify database connectivity from Vercel
