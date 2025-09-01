import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function GoogleOAuthStatus() {
  const [status, setStatus] = useState<"loading" | "ready" | "not-configured">(
    "loading",
  );
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    checkGoogleOAuthStatus();
  }, []);

  const checkGoogleOAuthStatus = async () => {
    try {
      // Test Google OAuth by attempting to get OAuth URL
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "https://theo-assist.replit.app/auth/callback",
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        if (error.message.includes("provider is not enabled")) {
          setStatus("not-configured");
        } else {
          setStatus("not-configured");
        }
      } else {
        setStatus("ready");
      }
    } catch (error) {
      setStatus("not-configured");
    }
  };

  const testGoogleOAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "https://theo-assist.replit.app/auth/callback",
        },
      });

      if (error) {
        console.error("Google OAuth test failed:", error);
      }
    } catch (error) {
      console.error("Google OAuth test error:", error);
    }
  };

  const StatusIcon = () => {
    switch (status) {
      case "ready":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "not-configured":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const StatusBadge = () => {
    switch (status) {
      case "ready":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Ready
          </Badge>
        );
      case "not-configured":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            Not Configured
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="text-yellow-600 border-yellow-600"
          >
            Checking...
          </Badge>
        );
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <StatusIcon />
          <CardTitle>Google OAuth Status</CardTitle>
          <StatusBadge />
        </div>
        <CardDescription>
          Check the configuration status of Google OAuth authentication
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === "loading" && (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span>Checking Google OAuth configuration...</span>
          </div>
        )}

        {status === "ready" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>Google OAuth is configured and ready to use!</span>
            </div>
            <div className="flex gap-2">
              <Button onClick={testGoogleOAuth} variant="outline">
                Test Google Sign-In
              </Button>
            </div>
          </div>
        )}

        {status === "not-configured" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-red-600">
              <XCircle className="h-4 w-4" />
              <span>Google OAuth is not configured yet.</span>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Setup Instructions:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>
                  Go to your Supabase Dashboard → Authentication → Providers
                </li>
                <li>Enable the Google provider</li>
                <li>Enter your Google Client ID and Client Secret</li>
                <li>Set the redirect URL to your Supabase callback URL</li>
                <li>Save the configuration</li>
              </ol>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() =>
                  window.open("https://supabase.com/dashboard", "_blank")
                }
                variant="outline"
                size="sm"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Open Supabase Dashboard
              </Button>
              <Button
                onClick={() =>
                  window.open("https://console.cloud.google.com", "_blank")
                }
                variant="outline"
                size="sm"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Open Google Console
              </Button>
              <Button
                onClick={checkGoogleOAuthStatus}
                variant="outline"
                size="sm"
              >
                Recheck Status
              </Button>
            </div>
          </div>
        )}

        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Configuration Details:</h4>
          <div className="text-sm space-y-1">
            <div>
              <strong>Redirect URL:</strong>{" "}
              https://ptlhykwgdidqgaimaxcj.supabase.co/auth/v1/callback
            </div>
            <div>
              <strong>Provider:</strong> Google OAuth 2.0
            </div>
            <div>
              <strong>Scopes:</strong> email, profile
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
