# Firebase Google OAuth Setup for Supabase

## The Situation
Your Supabase project uses Firebase Auth for Google OAuth integration. This is a valid setup where:
- Supabase connects to a Firebase project
- Firebase handles Google OAuth
- Users sign in with Google through Firebase
- Supabase receives the authentication tokens

## Step 1: Get Firebase Project ID
You need to create or use an existing Firebase project:

1. Go to https://console.firebase.google.com/
2. Create a new project or select existing one
3. Copy the **Project ID** (not the project name)
4. Enable Google Authentication in Firebase console:
   - Go to Authentication → Sign-in method
   - Enable Google sign-in provider
   - Use the same Google Client ID and Secret

## Step 2: Configure in Supabase
1. In your Supabase dashboard, click "Add provider" → "Firebase"
2. Enter your **Firebase Auth Project ID**
3. Click "Create connection"

## Step 3: Update Frontend Code
We need to modify the authentication to use Firebase Auth instead of direct Supabase Google OAuth.

## Alternative: Use Direct Google OAuth
If you prefer not to use Firebase, we can:
1. Check if your Supabase plan supports direct Google OAuth
2. Contact Supabase support to enable Google provider
3. Use a different authentication approach