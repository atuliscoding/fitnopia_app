# Google OAuth Configuration Check

## Current Setup Status

### Your Google OAuth Credentials:
- **Client ID**: `22179482251-tc70c8pp80p22r3glpqvm90kkqgjfdq7.apps.googleusercontent.com`
- **Client Secret**: `GOCSPX-***` (Hidden for security)

### Required Google Cloud Console Configuration:

1. **Authorized JavaScript Origins**:
   ```
   http://localhost:3001
   ```

2. **Authorized Redirect URIs**:
   ```
   http://localhost:3001/api/auth/callback/google
   ```

### Current NextAuth Configuration:
- **NextAuth URL**: `http://localhost:3001` (from NEXTAUTH_URL or default)
- **Google Provider**: Enabled
- **Callback URL**: `/api/auth/callback/google`

## Common Issues and Solutions:

### Issue 1: Redirect URI Mismatch
**Symptom**: Button click doesn't redirect to Google, stays on same page
**Solution**: Ensure Google Cloud Console has EXACT redirect URI: `http://localhost:3001/api/auth/callback/google`

### Issue 2: JavaScript Origins Not Set
**Symptom**: CORS errors or blocked requests
**Solution**: Add `http://localhost:3001` to "Authorized JavaScript origins"

### Issue 3: OAuth Consent Screen Not Configured
**Symptom**: OAuth flow fails with configuration error
**Solution**: Configure OAuth consent screen in Google Cloud Console

## Testing URLs:
- Test direct OAuth: http://localhost:3001/api/auth/signin/google
- Check providers: http://localhost:3001/api/auth/providers
- Debug environment: http://localhost:3001/api/debug-env

## Next Steps:
1. Verify Google Cloud Console settings match the URLs above
2. Make sure OAuth consent screen is configured
3. Test the OAuth flow again
