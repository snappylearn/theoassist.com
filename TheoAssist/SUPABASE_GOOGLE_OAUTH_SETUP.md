# Supabase Google OAuth Setup Guide

## Overview
This application now uses Supabase's built-in Google OAuth provider instead of Firebase. This is much simpler and more reliable.

## Setup Steps

### 1. Configure Google OAuth in Supabase Dashboard
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/projects)
2. Select your project: `TheoAssist`
3. Navigate to **Authentication > Providers**
4. Find **Google** in the list and click to enable it
5. Enter your Google OAuth credentials:
   - **Client ID**: Use the value from `GOOGLE_CLIENT_ID` secret
   - **Client Secret**: Use the value from `GOOGLE_CLIENT_SECRET` secret

### 2. Configure Redirect URLs
In the Google provider settings, ensure the redirect URL is set to:
```
https://your-project-ref.supabase.co/auth/v1/callback
```

### 3. Update Google Cloud Console (if needed)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services > Credentials**
3. Edit your OAuth 2.0 client
4. Add authorized redirect URI:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```
5. Add authorized domains:
   - `your-project-ref.supabase.co`
   - `theo-assist.replit.app` (for development)

## How It Works

### Frontend Flow
1. User clicks "Continue with Google" button
2. `signInWithGoogle()` method calls Supabase OAuth
3. Supabase redirects to Google OAuth
4. Google redirects back to Supabase with authorization
5. Supabase creates user session and redirects to app
6. AuthContext detects the session and logs user in

### Authentication Code
```typescript
const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`
    }
  });
  return { error };
}
```

## Benefits Over Firebase
- ✅ No additional Firebase configuration needed
- ✅ Uses existing Supabase auth system
- ✅ Automatic user creation in Supabase database
- ✅ Seamless integration with existing auth flow
- ✅ Built-in session management
- ✅ No custom backend endpoints needed

## Testing
1. Click "Continue with Google" button
2. Should redirect to Google OAuth
3. After Google authorization, should redirect back and log you in
4. Check browser console for detailed logs of the process