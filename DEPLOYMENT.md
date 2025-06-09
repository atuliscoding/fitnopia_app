# Fitnopia - Netlify Deployment Guide

## Prerequisites
1. A Netlify account
2. A GitHub repository with your code
3. Configured Supabase project
4. Google Gemini AI API key

## Environment Variables for Netlify

Configure these environment variables in your Netlify site settings (Site settings > Environment variables):

### NextAuth Configuration
```
NEXTAUTH_URL=https://your-app-name.netlify.app
NEXTAUTH_SECRET=your-random-secret-key-here
```

### OAuth Providers (configure based on your auth setup)
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_ID=your-github-id  
GITHUB_SECRET=your-github-secret
```

### Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### AI & Database
```
GEMINI_API_KEY=your-gemini-api-key
DATABASE_URL=your-supabase-database-connection-string
```

### Optional - Rate Limiting
```
UPSTASH_REDIS_REST_URL=your-upstash-redis-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-token
```

## Deployment Steps

### 1. Prepare Your Repository
1. Commit all changes to your GitHub repository
2. Make sure your repository is public or you have Netlify access

### 2. Create New Site on Netlify
1. Go to [Netlify](https://netlify.com) and log in
2. Click "New site from Git"
3. Choose GitHub and select your repository
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18

### 3. Configure Environment Variables
1. Go to Site settings > Environment variables
2. Add all the environment variables listed above
3. Make sure to use your actual values

### 4. Configure OAuth Redirect URLs
Update your OAuth provider settings to include your Netlify URL:
- Google Console: Add `https://your-app-name.netlify.app/api/auth/callback/google`
- GitHub Apps: Add `https://your-app-name.netlify.app/api/auth/callback/github`

### 5. Update Supabase Settings
1. Go to your Supabase project settings
2. Add your Netlify URL to the allowed origins
3. Update any CORS settings if needed

### 6. Deploy
1. Click "Deploy site" in Netlify
2. Monitor the build logs for any errors
3. Once deployed, test all functionality

## Troubleshooting

### Common Issues
1. **Build Errors**: Check the build logs and ensure all dependencies are installed
2. **Environment Variables**: Double-check all variable names and values
3. **OAuth Issues**: Verify redirect URLs are correctly configured
4. **Database Connection**: Ensure Supabase credentials are correct

### Build Command Issues
If the build fails, try these alternatives:
```bash
# Alternative build command
npm ci && npm run build

# Clear cache and rebuild
rm -rf .next node_modules && npm install && npm run build
```

## Post-Deployment Checklist
- [ ] Test user authentication
- [ ] Test workout generation
- [ ] Test database operations
- [ ] Test all API endpoints
- [ ] Verify responsive design
- [ ] Check console for errors

## Domain Configuration (Optional)
To use a custom domain:
1. Go to Site settings > Domain management
2. Add your custom domain
3. Update DNS settings as instructed
4. Update NEXTAUTH_URL environment variable 