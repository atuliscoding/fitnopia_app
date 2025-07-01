# OAuth Setup Guide for Fitnopia

This guide will help you set up Google and GitHub OAuth authentication for the Fitnopia app.

## Google OAuth Setup

### 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Make sure billing is enabled (OAuth requires it)

### 2. Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google+ API" and enable it
3. Also enable "Google Identity and Access Management (IAM) API"

### 3. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application" as the application type
4. Add the following to "Authorized JavaScript origins":
   - `http://localhost:3001`
   - `https://yourdomain.com` (for production)
5. Add the following to "Authorized redirect URIs":
   - `http://localhost:3001/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google` (for production)
6. Click "Create"
7. Copy the Client ID and Client Secret

### 4. Update Environment Variables

Add these to your `.env` file:
```
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## GitHub OAuth Setup

### 1. Create a GitHub OAuth App

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in the application details:
   - **Application name**: Fitnopia
   - **Homepage URL**: `http://localhost:3001` (for development)
   - **Authorization callback URL**: `http://localhost:3001/api/auth/callback/github`
4. Click "Register application"

### 2. Get Client Credentials

1. After creating the app, you'll see the Client ID
2. Click "Generate a new client secret" to get the Client Secret
3. Copy both values

### 3. Update Environment Variables

Add these to your `.env` file:
```
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
```

## Testing OAuth

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3001/test-auth` to test authentication
3. Try signing up/in with Google and GitHub
4. Check that users are created in your database

## Production Setup

For production deployment:

1. Update the OAuth app configurations with your production domain
2. Add production URLs to authorized origins and redirect URIs
3. Update your environment variables on your hosting platform
4. Ensure HTTPS is enabled for your production domain

## Troubleshooting

### Common Issues

1. **"redirect_uri_mismatch" error**: Make sure the redirect URI in your OAuth app matches exactly with the callback URL
2. **"access_denied" error**: Check that your OAuth app is properly configured and approved
3. **"invalid_client" error**: Verify your client ID and secret are correct in the environment variables

### Debug Mode

The app includes debug logging for NextAuth. Check your server console for detailed error messages during authentication.

## Security Notes

1. Never commit real OAuth credentials to version control
2. Use different OAuth apps for development and production
3. Regularly rotate your OAuth secrets
4. Monitor your OAuth app usage in the respective developer consoles
