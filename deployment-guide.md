# Fitnopia - Netlify Deployment Guide

## Quick Setup Summary
1. Push code to GitHub
2. Connect GitHub repo to Netlify
3. Configure environment variables
4. Deploy and test

## Environment Variables Needed

Add these to Netlify Site Settings > Environment Variables:

```
NEXTAUTH_URL=https://your-site-name.netlify.app
NEXTAUTH_SECRET=your-secret-key
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-api-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Detailed Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare for Netlify deployment"
git push origin main
```

### 2. Deploy on Netlify
1. Go to netlify.com
2. Click "New site from Git"
3. Choose GitHub, select your repo
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Click "Deploy site"

### 3. Configure Environment Variables
Go to Site settings > Environment variables and add all the variables listed above.

### 4. Update OAuth Settings
- Google Console: Add `https://your-site.netlify.app/api/auth/callback/google`
- Update your Supabase project allowed origins

Your app will be live at: https://your-site-name.netlify.app 