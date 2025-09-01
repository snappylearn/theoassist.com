import { supabase } from './lib/supabase';
import { getGoogleOAuthConfig } from './config/googleOAuth';

async function testGoogleOAuthSetup() {
  console.log('🔍 Testing Google OAuth Configuration...\n');
  
  // Check environment variables
  const config = getGoogleOAuthConfig();
  
  if (!config.clientId || !config.clientSecret) {
    console.error('❌ Google OAuth credentials not found!');
    console.log('Please ensure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set in your environment.\n');
    return false;
  }
  
  console.log('✅ Google OAuth credentials found');
  console.log(`Client ID: ${config.clientId.substring(0, 20)}...`);
  console.log(`Redirect URL: ${config.redirectUrl}\n`);
  
  // Test Supabase connection
  try {
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      return false;
    }
    console.log('✅ Supabase connection successful\n');
  } catch (error) {
    console.error('❌ Supabase connection error:', error);
    return false;
  }
  
  // Instructions for final setup
  console.log('📋 Final Setup Instructions:');
  console.log('1. Go to your Supabase Dashboard → Authentication → Providers');
  console.log('2. Enable the Google provider');
  console.log('3. Enter your Google Client ID and Client Secret');
  console.log('4. Set the redirect URL to:', config.redirectUrl);
  console.log('5. Save the configuration\n');
  
  console.log('⚠️  Important: Make sure your Google Cloud Console OAuth client has the correct redirect URI:');
  console.log('   ', config.redirectUrl);
  console.log('\n✅ Setup complete! Google OAuth should now work with your TheoAssist app.');
  
  return true;
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testGoogleOAuthSetup();
}

export { testGoogleOAuthSetup };