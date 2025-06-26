#!/bin/bash

echo "🚀 Fitnopia Google OAuth Setup Helper"
echo "======================================"
echo ""

echo "📋 Current Environment Status:"
echo "NEXTAUTH_URL: ${NEXTAUTH_URL:-'Not set (will default to http://localhost:3001)'}"
echo "GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID:-'❌ Not set'}"
echo "GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET:-'❌ Not set'}"
echo ""

echo "🔧 Steps to Set Up Google OAuth:"
echo ""
echo "1. Go to: https://console.cloud.google.com/"
echo "2. Create/select a project"
echo "3. Enable 'Google+ API' in APIs & Services > Library"
echo "4. Go to APIs & Services > Credentials"
echo "5. Create OAuth 2.0 Client ID (Web Application)"
echo "6. Add these URLs:"
echo "   - Authorized JavaScript origins: http://localhost:3001"
echo "   - Authorized redirect URIs: http://localhost:3001/api/auth/callback/google"
echo ""

echo "📝 Then update your .env file with:"
echo "GOOGLE_CLIENT_ID=\"your-client-id-from-google\""
echo "GOOGLE_CLIENT_SECRET=\"your-client-secret-from-google\""
echo ""

echo "🧪 Test the setup at: http://localhost:3001/test-google-oauth"
echo ""

# Check if credentials are set
if [[ -n "$GOOGLE_CLIENT_ID" && "$GOOGLE_CLIENT_ID" != "your-google-client-id" && "$GOOGLE_CLIENT_ID" != "your-actual-google-client-id-from-console" ]]; then
    echo "✅ Google OAuth appears to be configured!"
    echo "🌐 You can now test Google sign-in"
else
    echo "⚠️  Google OAuth not yet configured"
    echo "📋 Follow the steps above to set up your credentials"
fi
