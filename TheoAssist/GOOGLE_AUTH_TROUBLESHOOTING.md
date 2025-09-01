# Google OAuth Troubleshooting Guide

## Your Supabase Callback URL
Your Supabase project callback URL is:
```
https://hrtdbvwocrlqkmxttqox.supabase.co/auth/v1/callback
```

## Google Cloud Console Setup

### 1. Update Authorized Redirect URIs
In your Google Cloud Console OAuth client settings, ensure these redirect URIs are added:

**Production URLs:**
```
https://hrtdbvwocrlqkmxttqox.supabase.co/auth/v1/callback
```

**Development URLs (add these too):**
```
http://localhost:5000/auth/callback
https://your-replit-domain.replit.app/auth/callback
```

### 2. Update Authorized Domains
Add these authorized domains:
```
hrtdbvwocrlqkmxttqox.supabase.co
replit.app
localhost
```

## Testing Steps

### 1. Test Google OAuth Flow
1. Click "Continue with Google" 
2. Should redirect to Google OAuth page
3. After Google authorization, should redirect back to TheoAssist
4. Should automatically log you in

### 2. Check Browser Console
Open Developer Tools (F12) and watch for these logs:
```
🚀 Initiating Supabase Google OAuth...
Google OAuth result: { error: null }
Auth state change: SIGNED_IN [user object]
```

## Common Issues

### Issue: "redirect_uri_mismatch"
**Solution**: Add the exact callback URL to Google Cloud Console redirect URIs

### Issue: "unauthorized_client" 
**Solution**: Check that your Google Client ID and Secret are correctly set in Supabase

### Issue: "provider is not enabled"
**Solution**: Ensure Google provider is enabled in Supabase Authentication > Providers

### Issue: OAuth works but user not logged in
**Solution**: Check that Supabase session is being set correctly

## Current Status
✅ Google provider enabled in Supabase
✅ Google Client ID and Secret configured
❓ Google Cloud Console redirect URIs (needs verification)
❓ Test OAuth flow

## Next Steps
1. Update Google Cloud Console with callback URL
2. Test the Google OAuth flow
3. Verify user session is created successfully