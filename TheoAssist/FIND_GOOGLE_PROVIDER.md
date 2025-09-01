# Updated Google Cloud Console Configuration

## Current Setup Status
✅ App deployed to: https://theo-assist.replit.app/
✅ Supabase project: ptlhykwgdidqgaimaxcj
✅ Google OAuth enabled in Supabase
✅ App configured to use deployed URL for OAuth redirects

## Required Google Cloud Console Updates

### Authorized JavaScript Origins
Add these domains:
```
https://ptlhykwgdidqgaimaxcj.supabase.co
https://theo-assist.replit.app
http://localhost:5000
```

### Authorized Redirect URIs
Add these callback URLs:
```
https://ptlhykwgdidqgaimaxcj.supabase.co/auth/v1/callback
https://theo-assist.replit.app/auth/callback
http://localhost:5000/auth/callback
```

## Testing the OAuth Flow

### Option 1: Test on Deployed App (Recommended)
1. Go to https://theo-assist.replit.app/
2. Click "Continue with Google"
3. Should redirect to Google OAuth
4. After Google sign-in, should redirect back to deployed app
5. Should be logged in as Josiah

### Option 2: Test on Development
1. Go to http://localhost:5000/
2. Click "Continue with Google"
3. Should work the same way

## Current OAuth Configuration
- ✅ Supabase Google provider enabled
- ✅ Client ID and Secret configured
- ✅ App updated to use deployed URL
- ❓ Google Cloud Console redirect URLs (needs update)

## Next Steps
1. Update Google Cloud Console with the URLs above
2. Test OAuth on deployed app
3. Verify successful login flow