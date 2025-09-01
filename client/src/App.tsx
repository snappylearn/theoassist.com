import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AuthPage } from "@/components/auth/AuthPage";
import SimpleLanding from "@/pages/simple-landing";
import ModernLanding from "@/pages/modern-landing";
import Dashboard from "@/pages/dashboard";

import Projects from "@/pages/projects";
import ProjectDetail from "@/pages/project-detail";
import Conversations from "@/pages/conversations";
import Conversation from "@/pages/conversation";
import ArtifactsPage from "@/pages/artifacts-new";
import OAuthStatusPage from "@/pages/oauth-status";
import { AuthCallback } from "@/pages/auth-callback";
import NotFound from "@/pages/not-found";

function Router() {
  const { user, loading } = useAuth();

  console.log('Router state:', { user: !!user, loading, showAuth: !user && !loading });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('Showing landing page');
    return (
      <Switch>
        <Route path="/" component={ModernLanding} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/auth/callback" component={AuthCallback} />
        <Route path="/auth/callback/*" component={AuthCallback} />
        <Route path="/simple" component={SimpleLanding} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  console.log('Showing authenticated routes');
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/projects" component={Projects} />
      <Route path="/projects/:id" component={ProjectDetail} />
      <Route path="/conversations" component={Conversations} />
      <Route path="/conversations/:id" component={Conversation} />
      <Route path="/artifacts" component={ArtifactsPage} />
      <Route path="/oauth-status" component={OAuthStatusPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
