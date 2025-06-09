# 🚀 Deploy Fitnopia to Netlify

## Quick Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for Netlify deployment"
git push origin main
```

### 2. Deploy on Netlify
1. Go to [netlify.com](https://netlify.com) and sign in
2. Click **"New site from Git"**
3. Choose **GitHub** and select your repository
4. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - **Node version:** 18
5. Click **"Deploy site"**

### 3. Configure Environment Variables
Go to **Site settings > Environment variables** and add:

```
NEXTAUTH_URL=https://your-site-name.netlify.app
NEXTAUTH_SECRET=your-secret-key-here
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-api-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 4. Update OAuth Settings
- **Google Console:** Add `https://your-site.netlify.app/api/auth/callback/google`
- **Supabase:** Add your Netlify URL to allowed origins

### 5. Test Your Deployment
Visit your site at `https://your-site-name.netlify.app` and test:
- [ ] User authentication
- [ ] Workout generation
- [ ] Database operations
- [ ] All pages load correctly

## ✅ Your app is now live!

The build completed successfully with all optimizations. Your Fitnopia app is ready for production deployment on Netlify. 