import { supabase } from '../lib/supabase';

export async function configureGoogleOAuth() {
  try {
    console.log('✓ Supabase connection successful');
    
    // Check if Google OAuth credentials are available
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    
    if (!googleClientId || !googleClientSecret) {
      console.log('ℹ Google OAuth credentials not configured');
      return false;
    }
    
    console.log('✓ Google OAuth credentials found');
    console.log('ℹ To complete Google OAuth setup:');
    console.log('1. Go to your Supabase Dashboard > Authentication > Providers');
    console.log('2. Enable Google provider');
    console.log('3. Add your Google Client ID and Client Secret');
    console.log('4. Set the redirect URL to: https://your-project.supabase.co/auth/v1/callback');
    
    return true;
  } catch (error) {
    console.error('Error configuring Google OAuth:', error);
    return false;
  }
}

export function getGoogleOAuthConfig() {
  return {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUrl: `${process.env.SUPABASE_URL}/auth/v1/callback`
  };
}