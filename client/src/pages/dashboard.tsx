import { useState } from "react";
import { useLocation } from "wouter";
import { Lightbulb, Search, FileText, Code, Calculator, MessageSquare } from "lucide-react";
const theoAssistLogo = "/snappylearn-transparent-logo.png";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar";
import { ChatInput } from "@/components/chat-input";
import { ConversationCard } from "@/components/conversation-card";
import { useConversations, useCreateConversation } from "@/hooks/use-conversations";

import { useArtifacts } from "@/hooks/use-artifacts";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { data: conversations = [] } = useConversations();
  const { data: artifacts = [] } = useArtifacts();
  const createConversation = useCreateConversation();

  const recentConversations = conversations.slice(0, 6);

  const handleSendMessage = async (message: string, attachments?: File[]) => {
    createConversation.mutate(
      {
        message,
        type: "independent",
        attachments,
      },
      {
        onSuccess: (data) => {
          console.log('Conversation created:', data);
          const conversationId = data.conversation?.id;
          if (conversationId) {
            setLocation(`/conversations/${conversationId}`);
          }
        },
      }
    );
  };

  const handleNewChat = () => {
    // Dashboard new chat function - no collections anymore
  };

  const handleQuickAction = (action: string) => {
    const prompts = {
      "Get Ideas": "I need some spiritual insights and biblical ideas. Can you help me with theological reflection?",
      "Search Knowledge": "Help me search and find biblical information from my theological knowledge base.",
      "Analyze Document": "I'd like to analyze and get insights from my biblical documents and theological texts."
    };
    
    if (prompts[action as keyof typeof prompts]) {
      handleSendMessage(prompts[action as keyof typeof prompts]);
    }
  };

  const quickActions = [
    { icon: Lightbulb, label: "Spiritual Ideas", color: "text-yellow-500", action: "Get Ideas" },
    { icon: Search, label: "Search Scripture", color: "text-blue-500", action: "Search Knowledge" },
    { icon: FileText, label: "Analyze Theology", color: "text-green-500", action: "Analyze Document" },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar 
        onNewChat={handleNewChat}
      />
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full p-6 min-h-full">
          


          {/* Welcome/Centered Chat */}
          <div className="flex flex-col items-center space-y-8 py-8">
            
            {/* Welcome Message */}
            <div className="text-center max-w-2xl">
              <img src={theoAssistLogo} alt="TheoAssist" className="w-24 h-24 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Welcome to TheoAssist</h1>
              <p className="text-lg text-gray-600 mb-8">
                Your daily companion for spiritual growth. Start a theological conversation or explore your biblical projects.
              </p>
            </div>

            {/* Centered Chat Input */}
            <ChatInput
              onSend={handleSendMessage}
              disabled={createConversation.isPending}
              placeholder="Ask me anything about theology and scripture, or create a project for biblical context..."
            />

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3 justify-center">
              {quickActions.map((action, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  className="px-4 py-2"
                  onClick={() => handleQuickAction(action.action)}
                  disabled={createConversation.isPending}
                >
                  <action.icon className={`w-4 h-4 mr-2 ${action.color}`} />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Recent Conversations Grid */}
          {recentConversations.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Conversations</h2>
                <Button 
                  variant="ghost" 
                  onClick={() => setLocation("/conversations")}
                  className="text-primary hover:text-primary/80"
                >
                  View All
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentConversations.map((conversation) => (
                  <ConversationCard key={conversation.id} conversation={conversation} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
