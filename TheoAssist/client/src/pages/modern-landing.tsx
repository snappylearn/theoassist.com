import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Check, FileText, MessageCircle, Search, Zap, Shield, BarChart3, Users, Globe, Sparkles } from "lucide-react";
import { useState } from "react";
import { SignUpForm } from "@/components/auth/SignUpForm";

const theoAssistLogo = "/snappylearn-transparent-logo.png";

export default function ModernLanding() {
  const [showSignUp, setShowSignUp] = useState(false);

  const handleGetStarted = () => {
    setShowSignUp(true);
  };

  const handleSignIn = () => {
    window.location.href = "/auth";
  };

  if (showSignUp) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4">
              <img src={theoAssistLogo} alt="TheoAssist" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">TheoAssist</h1>
            <p className="text-gray-600 mt-2">
              Your daily companion for spiritual growth
            </p>
          </div>
          <SignUpForm 
            onToggleMode={() => window.location.href = "/auth"} 
            onBackToHome={() => setShowSignUp(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src={theoAssistLogo} alt="TheoAssist" className="w-8 h-8" />
              <span className="text-xl font-bold text-gray-900">TheoAssist</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900">How It Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={handleSignIn}>Sign In</Button>
              <Button onClick={handleGetStarted} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-purple-100 text-purple-800 border-purple-200">
              🙏 AI-Powered Biblical Companion
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Your AI-Powered <br />
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Spiritual Companion
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Upload your theological documents, organize them in smart collections, and chat with an AI that understands biblical content. 
              Turn any document into an interactive spiritual learning experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleGetStarted} 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need for spiritual growth
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              TheoAssist combines biblical document management, AI chat, and conversation history to transform how you interact with theological knowledge.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Biblical Collections</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Organize your theological documents into smart collections. Upload PDFs, sermons, biblical texts, and attachments with automatic content extraction for AI analysis.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle>Theological AI</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Chat naturally with your biblical documents using GPT-4. Ask theological questions, get spiritual insights, and receive answers with source citations from your uploaded content.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Scripture Search</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Find relevant biblical content across all your documents based on theological meaning, not just keywords. AI understands spiritual context to surface the most relevant information.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-yellow-600" />
                </div>
                <CardTitle>Fast & Reliable</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Built for speed with optimized performance. Handle large document collections with ease.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>Secure & Private</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Your data stays secure with enterprise-grade encryption and privacy controls.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Conversation History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Keep track of all your conversations with the AI. Resume previous discussions and build on past insights across your document collections.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Start your spiritual journey in minutes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From biblical document upload to AI-powered spiritual insights in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Create Biblical Collections</h3>
              <p className="text-gray-600">
                Organize your theological documents into smart collections. Upload PDFs, sermons, biblical texts, and attachments with drag-and-drop ease.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Start Spiritual Conversations</h3>
              <p className="text-gray-600">
                Begin chatting with your biblical documents or have independent theological conversations. The AI understands spiritual context from your uploaded content.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Get Spiritual Insights</h3>
              <p className="text-gray-600">
                Ask theological questions, get detailed biblical answers with source citations, and build on previous conversations to deepen your spiritual understanding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start for free, then scale as you grow your knowledge base
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 border-gray-200">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Free</CardTitle>
                <CardDescription>Perfect for personal use</CardDescription>
                <div className="text-4xl font-bold text-gray-900 mt-4">
                  $0<span className="text-lg font-normal text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-gray-700">Up to 10 documents</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-gray-700">Basic AI chat</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-gray-700">1 collection</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-gray-700">Community support</span>
                  </li>
                </ul>
                <Button className="w-full mt-6" variant="outline" onClick={handleGetStarted}>
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-purple-600 text-white">Most Popular</Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Pro</CardTitle>
                <CardDescription>For power users and professionals</CardDescription>
                <div className="text-4xl font-bold text-gray-900 mt-4">
                  $19<span className="text-lg font-normal text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-gray-700">Up to 1,000 documents</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-gray-700">Advanced AI chat</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-gray-700">Unlimited collections</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-gray-700">Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-gray-700">Analytics dashboard</span>
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white" onClick={handleGetStarted}>
                  Start Pro Trial
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Enterprise</CardTitle>
                <CardDescription>For teams and organizations</CardDescription>
                <div className="text-4xl font-bold text-gray-900 mt-4">
                  Custom
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-gray-700">Unlimited documents</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-gray-700">Custom AI models</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-gray-700">Team collaboration</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-gray-700">Dedicated support</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-gray-700">SSO integration</span>
                  </li>
                </ul>
                <Button className="w-full mt-6" variant="outline">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to deepen your spiritual journey?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of believers who are already using TheoAssist to unlock the power of their biblical documents.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleGetStarted} 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3">
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src={theoAssistLogo} alt="TheoAssist" className="w-8 h-8" />
                <span className="text-xl font-bold">TheoAssist</span>
              </div>
              <p className="text-gray-400">
                Building intelligent biblical experiences with AI
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Use Cases</a></li>
                <li><a href="#" className="hover:text-white">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">API Reference</a></li>
                <li><a href="#" className="hover:text-white">Tutorials</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 TheoAssist, Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}