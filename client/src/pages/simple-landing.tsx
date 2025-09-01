import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, FileText, Zap } from "lucide-react";
const theoAssistLogo = "/snappylearn-transparent-logo.png";

export default function SimpleLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="mb-6">
            <img 
              src={theoAssistLogo} 
              alt="TheoAssist Logo" 
              className="h-20 w-auto mx-auto"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            TheoAssist
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Your daily companion for spiritual growth. Upload biblical documents, create collections, and chat with AI about theology and scripture.
          </p>
          
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                Sign in to access your biblical collections and AI theology assistant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="w-full"
                size="lg"
              >
                Sign in with Replit
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <FileText className="w-8 h-8 text-blue-600 mb-2" />
              <CardTitle className="text-lg">Biblical Document Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Upload and organize your biblical documents, sermons, and theology texts into collections for easy access and study.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <img src={theoAssistLogo} alt="TheoAssist" className="w-8 h-8 mb-2" />
              <CardTitle className="text-lg">AI Bible Companion</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Chat with AI about biblical texts and theology. Get insights, scripture analysis, and spiritual guidance from your content.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <MessageSquare className="w-8 h-8 text-green-600 mb-2" />
              <CardTitle className="text-lg">Spiritual Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Maintain conversation history and spiritual context across multiple theology discussion sessions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="w-8 h-8 text-yellow-600 mb-2" />
              <CardTitle className="text-lg">Scripture Search</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Quickly find biblical passages and theological concepts across all your documents with intelligent search.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}