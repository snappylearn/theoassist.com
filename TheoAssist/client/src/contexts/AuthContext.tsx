import { createContext, useContext, useEffect, useState } from "react";
import { User, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
// Removed Firebase imports - using Supabase OAuth instead

interface AuthContextType {
  user: User | null;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: any }>;
  signUp: (
    email: string,
    password: string,
  ) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Initialize authentication - check for existing session or OAuth callback
    const initAuth = async () => {
      console.log("🚀 Initializing authentication...");

      try {
        // Check if we're handling an OAuth callback (tokens in URL)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const hasOAuthTokens = hashParams.get('access_token') && hashParams.get('refresh_token');
        
        if (hasOAuthTokens) {
          console.log("🔗 OAuth tokens detected in URL, processing...");
          // Let Supabase handle the session automatically
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Check for existing Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session && session.user) {
          console.log("📋 Found existing Google OAuth session");
          
          // Create mock user object for development compatibility
          const mockUser = {
            id: session.user.id,
            email: session.user.email,
            user_metadata: {
              full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
            },
            app_metadata: {},
            aud: "authenticated",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            role: "authenticated",
            email_confirmed_at: new Date().toISOString(),
            phone_confirmed_at: undefined,
            confirmation_sent_at: undefined,
            recovery_sent_at: undefined,
            email_change_sent_at: undefined,
            new_email: undefined,
            invited_at: undefined,
            action_link: undefined,
            phone: undefined,
            is_anonymous: false,
            identities: [],
            factors: [],
          } as any;
          
          if (mounted) {
            setUser(mockUser);
            setLoading(false);
          }
          
          console.log("✅ Google OAuth user authenticated:", session.user.email);
          
          // Clean up OAuth tokens from URL
          if (hasOAuthTokens) {
            window.history.replaceState({}, document.title, '/');
          }
          
          return;
        }
      } catch (error) {
        console.warn("⚠️ Failed to check Google OAuth session:", error);
      }

      if (mounted) {
        // No existing session found, set loading to false
        setUser(null);
        setLoading(false);
      }
    };

    initAuth();

    // Set up auth state listener for Google OAuth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("🔄 Auth state changed:", event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session?.user && mounted) {
          console.log("✅ User signed in via Google OAuth:", session.user.email);
          
          // Create mock user object for development compatibility
          const mockUser = {
            id: session.user.id,
            email: session.user.email,
            user_metadata: {
              full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
            },
            app_metadata: {},
            aud: "authenticated",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            role: "authenticated",
            email_confirmed_at: new Date().toISOString(),
            phone_confirmed_at: undefined,
            confirmation_sent_at: undefined,
            recovery_sent_at: undefined,
            email_change_sent_at: undefined,
            new_email: undefined,
            invited_at: undefined,
            action_link: undefined,
            phone: undefined,
            is_anonymous: false,
            identities: [],
            factors: [],
          } as any;
          
          setUser(mockUser);
          setLoading(false);
        } else if (event === 'SIGNED_OUT' && mounted) {
          console.log("🚪 User signed out");
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: { message: data.error || "Login failed", __isAuthError: true, name: "AuthError", status: response.status, code: "auth_error" } as any };
      }

      // For development mode, bypass Supabase session and set user directly
      if (data.success && data.user) {
        // Create a mock user object that matches Supabase User interface
        const mockUser = {
          id: data.user.id,
          email: data.user.email,
          user_metadata: {
            full_name: `${data.user.firstName || ''} ${data.user.lastName || ''}`.trim(),
          },
          app_metadata: {},
          aud: "authenticated",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          role: "authenticated",
          email_confirmed_at: new Date().toISOString(),
          phone_confirmed_at: undefined,
          confirmation_sent_at: undefined,
          recovery_sent_at: undefined,
          email_change_sent_at: undefined,
          new_email: undefined,
          invited_at: undefined,
          action_link: undefined,
          phone: undefined,
          is_anonymous: false,
          identities: [],
          factors: [],
        } as any;
        
        setUser(mockUser);
        setLoading(false);
        
        // Redirect to dashboard
        window.history.replaceState({}, "", "/");
      }

      return { error: null };
    } catch (error) {
      return { error: { message: "Network error occurred" } };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      // Use custom signup endpoint that auto-confirms users
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: { message: data.error || "Signup failed" } };
      }

      return { error: null };
    } catch (error) {
      return { error: { message: "Network error occurred" } };
    }
  };

  const signInWithGoogle = async () => {
    console.log("🚀 Initiating Supabase Google OAuth...");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://theo-assist.replit.app/",
      },
    });
    console.log("Google OAuth result:", { error });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{ user, signIn, signUp, signInWithGoogle, signOut, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
