# Supabase Google OAuth Complete Setup Guide

## Issue: "provider is not enabled" error after configuration

This error can occur even after enabling Google OAuth in Supabase. Here are the troubleshooting steps:

## 1. Verify Supabase Google Provider Configuration

### Check These Settings in Supabase Dashboard:
1. Go to **Authentication > Providers**
2. Find **Google** and ensure it's **Enabled** (toggle should be ON)
3. Verify these fields are filled:
   - **Client ID**: Your Google OAuth Client ID
   - **Client Secret**: Your Google OAuth Client Secret
   - **Redirect URL**: Should auto-populate as `https://hrtdbvwocrlqkmxttqox.supabase.co/auth/v1/callback`

### Important: Save and Wait
- After making changes, click **Save**
- Wait 2-3 minutes for changes to propagate across Supabase infrastructure
- Sometimes it takes a few minutes for the provider to become fully active

## 2. Google Cloud Console Configuration

### Ensure these are set in your Google OAuth client:

**Authorized JavaScript origins:**
```
https://hrtdbvwocrlqkmxttqox.supabase.co
https://your-app-domain.replit.app
http://localhost:5000
```

**Authorized redirect URIs:**
```
https://hrtdbvwocrlqkmxttqox.supabase.co/auth/v1/callback
https://your-app-domain.replit.app/auth/callback
http://localhost:5000/auth/callback
```

## 3. Test Direct Supabase OAuth

You can test Google OAuth directly by visiting this URL in your browser:
```
https://hrtdbvwocrlqkmxttqox.supabase.co/auth/v1/authorize?provider=google&redirect_to=https://your-app-domain.replit.app/
```

If this works, the Supabase configuration is correct.

## 4. Common Issues and Solutions

### Issue: Changes not taking effect
**Solution**: Clear browser cache and wait 5 minutes after saving in Supabase

### Issue: Wrong Client ID/Secret
**Solution**: Double-check that you copied the correct values from Google Cloud Console

### Issue: Provider toggle appears on but still getting error
**Solution**: Try toggling the provider OFF, save, wait 1 minute, then toggle ON again

### Issue: Domain restrictions
**Solution**: Make sure your domain is not restricted in Google Cloud Console

## 5. Step-by-Step Verification Process

1. **Disable Google provider** in Supabase (toggle OFF) → Save
2. **Wait 1 minute**
3. **Re-enable Google provider** (toggle ON) → Save
4. **Re-enter your Client ID and Secret** → Save
5. **Wait 2-3 minutes**
6. **Test the OAuth flow**

## 6. Alternative: Manual Test

Open browser console and run:
```javascript
// Test if provider is actually enabled
fetch('https://hrtdbvwocrlqkmxttqox.supabase.co/auth/v1/authorize?provider=google')
  .then(r => console.log('Status:', r.status))
  .catch(e => console.log('Error:', e))
```

If this returns a redirect (status 302), the provider is working.
If it returns 400, the provider is still not enabled.

## 7. Debug Information

Current status:
- ✅ Supabase project: hrtdbvwocrlqkmxttqox
- ✅ Google OAuth enabled in dashboard (confirmed by user)
- ✅ Client ID and Secret added (confirmed by user)
- ❌ Still getting "provider is not enabled" error

Next steps: Try the disable/re-enable process above.