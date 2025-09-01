import { type Express, type Request, type Response, type NextFunction, type RequestHandler } from "express";
import { supabaseAdmin, supabaseClient } from "./lib/supabaseAdmin";
import { storage } from "./storage";
import { configureSupabaseForDevelopment } from "./auth-config";
import { createClient } from '@supabase/supabase-js';

// Enhanced request type with user info
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

// Get user ID from request (supports both Replit and Supabase auth)
export function getUserId(req: AuthenticatedRequest): string {
  if (req.user?.id) {
    return req.user.id;
  }
  
  // Fallback to session-based auth if available
  const session = (req as any).session;
  if (session?.user?.id) {
    return session.user.id;
  }
  
  throw new Error("User not authenticated");
}

// Middleware to authenticate requests using Supabase
export const isAuthenticated: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(' ')[1];
    
    // Use the proper Supabase client for user validation
    const { data, error } = await supabaseClient.auth.getUser(token);
    
    if (error || !data.user) {
      console.error("Supabase auth error:", error);
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = data.user;
    console.log("Authenticated user:", user.id, user.email);

    // Ensure user exists in our database
    let dbUser = await storage.getUser(user.id);
    if (!dbUser) {
      try {
        dbUser = await storage.upsertUser({
          id: user.id,
          email: user.email || '',
          firstName: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          profileImageUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
        });
      } catch (error: any) {
        // Handle duplicate key error - user already exists
        if (error.code === '23505') {
          dbUser = await storage.getUser(user.id);
        } else {
          throw error;
        }
      }
    }

    // Add user to request
    (req as AuthenticatedRequest).user = {
      id: user.id,
      email: user.email || '',
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// Setup Supabase auth routes
export async function setupSupabaseAuth(app: Express) {
  // Configure Supabase for development
  await configureSupabaseForDevelopment();
  // Get current user
  app.get("/api/auth/user", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getUserId(req);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json({
        id: user.id,
        email: user.email,
        name: user.firstName || user.email?.split('@')[0] || 'User',
        profileImage: user.profileImageUrl,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Sign out (client-side handled, but we can add server cleanup if needed)
  app.post("/api/auth/signout", (req: Request, res: Response) => {
    res.json({ message: "Signed out successfully" });
  });
}