import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, Share, Bookmark, MoreVertical, ChevronLeft, X, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatInput } from "@/components/chat-input";
import { MessageComponent } from "@/components/message";
import { ChatLoading } from "@/components/chat-loading";
import { ArtifactViewer } from "@/components/artifact-viewer";
import { Sidebar } from "@/components/sidebar";
import { useConversation } from "@/hooks/use-conversations";
import { useMessages, useSendMessage } from "@/hooks/use-messages";
import { useCollection } from "@/hooks/use-collections";

export default function Conversation() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const conversationId = parseInt(params.id!);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Artifact state management
  const [isArtifactOpen, setIsArtifactOpen] = useState(false);
  const [currentArtifact, setCurrentArtifact] = useState<{html: string, title: string} | null>(null);
  const [showArtifactToggle, setShowArtifactToggle] = useState(false);

  const { data: conversation, isLoading: conversationLoading, error: conversationError } = useConversation(conversationId);
  const { data: messages = [], isLoading: messagesLoading } = useMessages(conversationId);
  const { data: collection } = useCollection(conversation?.collectionId || 0);
  const sendMessage = useSendMessage();

  // Debug logging
  console.log('Conversation ID:', conversationId);
  console.log('Conversation data:', conversation);
  console.log('Conversation error:', conversationError);

  const handleSendMessage = (content: string) => {
    sendMessage.mutate({ 
      conversationId, 
      content 
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleViewArtifact = (artifactHtml: string, title: string) => {
    setCurrentArtifact({ html: artifactHtml, title });
    setShowArtifactToggle(true);
    setIsArtifactOpen(true);
  };

  const openArtifact = () => {
    if (currentArtifact) {
      setIsArtifactOpen(true);
    }
  };

  const closeArtifact = () => {
    setIsArtifactOpen(false);
    setCurrentArtifact(null);
    setShowArtifactToggle(false);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check if any messages contain artifacts to show toggle
  useEffect(() => {
    const hasArtifacts = messages.some(message => 
      message.role === 'assistant' && message.content.includes('[ARTIFACT_START]')
    );
    if (hasArtifacts && !showArtifactToggle) {
      setShowArtifactToggle(true);
    }
  }, [messages, showArtifactToggle]);

  if (!conversation) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Conversation not found</h2>
            <Button onClick={() => setLocation("/")} variant="outline">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isCollectionBased = conversation.type === "collection";
  const isProjectBased = conversation.type === "project";

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className={`flex-1 flex flex-col ${isArtifactOpen ? 'md:mr-[50%]' : ''} transition-all duration-300`}>
        {/* Header */}
        <header className="border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setLocation("/")}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{conversation.title}</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${
                    isCollectionBased ? "bg-blue-500" : isProjectBased ? "bg-purple-500" : "bg-gray-500"
                  }`} />
                  <span className="text-sm text-gray-500">
                    {isCollectionBased && collection 
                      ? `Collection: ${collection.name}`
                      : isProjectBased 
                        ? ""
                        : "Independent Conversation"
                    }
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                <Share className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                <Bookmark className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Messages Area */}
        <ScrollArea className="flex-1 px-6 py-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message) => (
              <MessageComponent 
                key={message.id} 
                message={message} 
                onViewArtifact={handleViewArtifact}
              />
            ))}
            {sendMessage.isPending && <ChatLoading />}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="max-w-3xl mx-auto">
            <ChatInput
              onSend={handleSendMessage}
              disabled={sendMessage.isPending}
              placeholder="Continue the conversation..."
            />
          </div>
        </div>
      </div>

      {/* Artifact Toggle Button */}
      {showArtifactToggle && !isArtifactOpen && (
        <Button
          onClick={openArtifact}
          className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-l-lg shadow-lg hover:bg-blue-600 z-40 transition-all duration-300 hover:transform hover:-translate-x-1"
          size="sm"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      )}

      {/* Artifact Viewer */}
      {currentArtifact && (
        <ArtifactViewer
          artifact={currentArtifact}
          onClose={closeArtifact}
          isOpen={isArtifactOpen}
        />
      )}
    </div>
  );
}
