# Supabase Dashboard Configuration Guide

## Step 1: Access Supabase Dashboard
**URL:** https://supabase.com/dashboard
**Project:** TheoAssist (look for your project name)

## Step 2: Navigate to Authentication
1. Click **Authentication** in the left sidebar
2. Click **Providers** tab at the top
3. You should see a list of OAuth providers

## Step 3: Configure Google Provider
Look for **Google** in the provider list and:
1. Click the **toggle switch** to enable it
2. Fill in these fields:
   - **Client ID**: `559650623795-at0nucv...`
   - **Client Secret**: `[Your Google Client Secret]`
   - **Redirect URL**: `https://ptlhykwgdidqgaimaxcj.supabase.co/auth/v1/callback`

## What You Should See:
- Provider list with toggles (Google, GitHub, etc.)
- Configuration form when you enable Google
- Redirect URL that ends with `/auth/v1/callback`

## What You Should NOT See:
- Firebase Auth Project ID (that's a different service)
- Firebase Console interface
- Google Cloud Console settings

## Your Project Details:
- **Supabase URL**: https://ptlhykwgdidqgaimaxcj.supabase.co
- **Project Reference**: ptlhykwgdidqgaimaxcj
- **Google OAuth Redirect**: https://ptlhykwgdidqgaimaxcj.supabase.co/auth/v1/callback

## If You're Still in Firebase Console:
1. Close the Firebase tab
2. Open https://supabase.com/dashboard
3. Find your TheoAssist project
4. Follow the steps above