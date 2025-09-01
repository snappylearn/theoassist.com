import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Plus, Folder, FolderOpen, MessageSquare, User, Settings, LogOut, Code, Calculator, ChevronDown, ChevronRight } from "lucide-react";
const snappyLearnIcon = "/favicon.png";
import { useConversations } from "@/hooks/use-conversations";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import type { ProjectWithStats } from "@shared/schema";

interface SidebarProps {
  onNewChat?: () => void;
}

export function Sidebar({ onNewChat }: SidebarProps) {
  const [location, setLocation] = useLocation();
  const [projectsExpanded, setProjectsExpanded] = useState(false);
  
  // Extract project ID from current URL if we're in a project detail page
  const getCurrentProjectId = (): number | undefined => {
    const match = location.match(/^\/projects\/(\d+)/);
    return match ? parseInt(match[1]) : undefined;
  };

  const currentProjectId = getCurrentProjectId();
  const { data: conversations = [], isLoading: conversationsLoading, error: conversationsError } = useConversations(currentProjectId);
  console.log('Sidebar conversations:', conversations, 'Loading:', conversationsLoading, 'Error:', conversationsError);
  const { data: projects = [], isLoading: projectsLoading, error: projectsError } = useQuery<ProjectWithStats[]>({
    queryKey: ["/api/projects"],
    queryFn: async () => {
      console.log('Sidebar: Fetching projects');
      const res = await fetch('/api/projects', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${await res.text()}`);
      }
      
      const data = await res.json();
      console.log('Sidebar: Projects data:', data);
      return data;
    },
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
  console.log('Sidebar projects:', projects, 'Loading:', projectsLoading, 'Error:', projectsError);
  const { user, signOut } = useAuth();

  const recentConversations = conversations.slice(0, 5);

  const handleNewChat = () => {
    if (onNewChat) {
      onNewChat();
    } else {
      // Navigate to home/dashboard to start fresh
      setLocation("/");
    }
  };

  const handleLogout = async () => {
    await signOut();
  };



  const getProjectColor = (index: number) => {
    const colors = [
      "bg-blue-100 text-blue-600",
      "bg-green-100 text-green-600", 
      "bg-purple-100 text-purple-600",
      "bg-orange-100 text-orange-600",
      "bg-pink-100 text-pink-600",
      "bg-cyan-100 text-cyan-600"
    ];
    return colors[index % colors.length];
  };

  return (
    <>
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
        {/* Logo/Header */}
        <div className="p-4 border-b border-gray-200">
          <Link href="/" className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold text-gray-800">TheoAssist</span>
            </div>
          </Link>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <Button 
            onClick={handleNewChat}
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>

        {/* Biblical Tools Section */}
        <div className="px-4 mb-4">
          <Link
            href="/artifacts"
            className={`flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 transition-colors w-full ${
              location === '/artifacts' ? 'bg-purple-50 border border-purple-200 text-purple-600' : 'text-gray-700 hover:text-purple-600'
            }`}
          >
            <Code className="w-5 h-5" />
            <span className="text-sm font-medium">Biblical Tools</span>
          </Link>
        </div>

        <ScrollArea className="flex-1 px-4">


          {/* Projects Section - Toggleable */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setProjectsExpanded(!projectsExpanded)}
                className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors cursor-pointer"
              >
                {projectsExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                <FolderOpen className="w-4 h-4" />
                <h3 className="text-sm font-semibold uppercase tracking-wide">
                  Projects
                </h3>
              </button>
              <Link href="/projects">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-gray-500 hover:text-white hover:bg-purple-500 rounded-full transition-all duration-200 cursor-pointer"
                  title="Create new project"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            
            {projectsExpanded && (
              <div className="space-y-1">
                {projects.slice(0, 5).map((project, index) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className={`w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left ${
                      location === `/projects/${project.id}` ? 'bg-purple-50 border border-purple-200' : ''
                    }`}
                  >
                    <div className={`w-6 h-6 rounded flex items-center justify-center ${getProjectColor(index)}`}>
                      <FolderOpen className="w-3 h-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {project.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {project.attachmentCount} attachments • {project.conversationCount} chats
                      </p>
                    </div>
                  </Link>
                ))}
                
                {projects.length === 0 && (
                  <div className="flex flex-col items-center py-4 px-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                      <FolderOpen className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500 text-center mb-2">No projects yet</p>
                    <Link href="/projects">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs px-3 text-purple-600 border-purple-200 hover:bg-purple-50 hover:border-purple-300"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Project
                      </Button>
                    </Link>
                  </div>
                )}
                
                {projects.length > 0 && (
                  <Link
                    href="/projects"
                    className="block text-xs text-gray-500 hover:text-purple-600 cursor-pointer p-2"
                  >
                    See all
                  </Link>
                )}
              </div>
            )}
          </div>

          <Separator className="my-4" />

          {/* Recent Chats Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Link
                href="/conversations"
                className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <h3 className="text-sm font-semibold uppercase tracking-wide">
                  Recent Chats
                </h3>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/")}
                className="h-6 w-6 p-0 text-gray-500 hover:text-white hover:bg-green-500 rounded-full transition-all duration-200 cursor-pointer"
                title="Start new conversation"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-1">
              {recentConversations.map((conversation) => (
                <Link
                  key={conversation.id}
                  href={`/conversations/${conversation.id}`}
                  className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors ${
                    location === `/conversations/${conversation.id}` ? 'bg-gray-100' : ''
                  }`}
                >
                  <div className={`w-6 h-6 rounded flex items-center justify-center ${
                    conversation.type === 'project' ? 'bg-purple-100' : 'bg-gray-100'
                  }`}>
                    {conversation.type === 'project' ? (
                      <Folder className="w-3 h-3 text-purple-600" />
                    ) : (
                      <MessageSquare className="w-3 h-3 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">
                      {conversation.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(() => {
                        const date = new Date(conversation.updatedAt);
                        return !isNaN(date.getTime()) ? date.toLocaleDateString() : 'No messages';
                      })()}
                    </p>
                  </div>
                </Link>
              ))}
              
              {recentConversations.length === 0 && (
                <p className="text-xs text-gray-500 italic">No recent chats</p>
              )}
            </div>
          </div>


        </ScrollArea>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            {user?.user_metadata?.avatar_url ? (
              <img 
                src={user.user_metadata.avatar_url} 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="text-white w-4 h-4" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-xs text-gray-500">TheoAssist</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
              onClick={handleLogout}
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>


    </>
  );
}
