import { useEffect } from 'react'
import { useLocation } from 'wouter'
import { supabase } from '@/lib/supabase'

export function AuthCallback() {
  const [, setLocation] = useLocation()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔗 Processing OAuth callback...')
        console.log('Current URL:', window.location.href)
        
        // Handle the OAuth callback automatically with Supabase
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        // If we already have a session, we're good
        if (sessionData.session) {
          console.log('✅ Existing session found during callback')
          console.log('User:', sessionData.session.user.email)
          
          // Clean up URL and redirect immediately
          window.history.replaceState({}, document.title, '/')
          setLocation('/')
          return
        }
        
        // Otherwise, wait a moment for Supabase to process the URL
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check for session after processing
        const { data, error } = await supabase.auth.getSession()
        
        console.log('Session check result:', { 
          hasSession: !!data.session, 
          user: data.session?.user?.email,
          error: error?.message 
        });
        
        if (error) {
          console.error('Session error:', error)
          setLocation('/')
          return
        }

        if (data.session && data.session.user) {
          console.log('✅ Google OAuth session found')
          console.log('User:', data.session.user.email)
          
          // Create backend session for development compatibility
          try {
            const response = await fetch('/api/auth/google-callback', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                user: data.session.user,
                session: data.session
              }),
              credentials: 'include'
            });
            
            const result = await response.json();
            
            if (response.ok) {
              console.log('✅ Backend session created:', result.message)
            } else {
              console.warn('⚠️ Backend session creation failed:', result.error)
            }
          } catch (error) {
            console.warn('⚠️ Backend session creation error:', error)
          }
          
          // Clean up URL and redirect
          window.history.replaceState({}, document.title, '/')
          
          // Short delay then redirect
          setTimeout(() => {
            setLocation('/');
          }, 500);
        } else {
          console.log('No session found after OAuth callback, redirecting to home')
          setTimeout(() => {
            setLocation('/');
          }, 1000);
        }
      } catch (err) {
        console.error('OAuth callback error:', err)
        setLocation('/')
      }
    }

    // Small delay to ensure URL is fully loaded
    const timer = setTimeout(handleAuthCallback, 100)
    return () => clearTimeout(timer)
  }, [setLocation])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Completing Sign In</h2>
        <p className="text-gray-600">Please wait while we authenticate you...</p>
      </div>
    </div>
  )
}