import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Paperclip, FileText, MessageSquare, Settings, X, Edit2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sidebar } from "@/components/sidebar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import type { Project, ProjectAttachment, ConversationWithPreview } from "@shared/schema";

export default function ProjectDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [isEditingInstructions, setIsEditingInstructions] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleNewChat = () => {
    setLocation("/");
  };

  if (!id) {
    return <div>Project not found</div>;
  }

  const projectId = parseInt(id);

  const { data: project, isLoading: projectLoading, error: projectError } = useQuery<Project>({
    queryKey: ["/api/projects", projectId],
    queryFn: async () => {
      console.log('Project Detail: Fetching project', projectId);
      const res = await fetch(`/api/projects/${projectId}`, {
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
      console.log('Project Detail: Project data:', data);
      return data;
    },
    retry: false,
  });
  
  console.log('Project Detail: Project', project, 'Loading:', projectLoading, 'Error:', projectError);

  const { data: attachments = [], isLoading: attachmentsLoading } = useQuery<ProjectAttachment[]>({
    queryKey: ["/api/projects", projectId, "attachments"],
    queryFn: async () => {
      console.log('Project Detail: Fetching attachments for project', projectId);
      const res = await fetch(`/api/projects/${projectId}/attachments`, {
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
      console.log('Project Detail: Attachments data:', data);
      return data;
    },
    enabled: !!project,
  });

  const { data: conversations = [] } = useQuery<ConversationWithPreview[]>({
    queryKey: ["/api/conversations"],
    queryFn: async () => {
      console.log('Project Detail: Fetching conversations');
      const res = await fetch('/api/conversations', {
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
      console.log('Project Detail: All conversations:', data);
      return data.filter((conv: any) => conv.projectId === projectId);
    },
    enabled: !!project,
  });

  const updateProjectMutation = useMutation({
    mutationFn: async (data: { instructions: string }) => {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${await res.text()}`);
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId] });
      setIsEditingInstructions(false);
      toast({
        title: "Success",
        description: "Project instructions updated",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      });
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      console.log('Project Detail: Uploading file to project', projectId);
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await fetch(`/api/projects/${projectId}/attachments`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      console.log('Project Detail: Upload response status:', response.status);
      
      if (!response.ok) {
        const text = await response.text();
        console.log('Project Detail: Upload error:', text);
        throw new Error(`HTTP ${response.status}: ${text}`);
      }
      
      const data = await response.json();
      console.log('Project Detail: Upload response data:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "attachments"] });
      setIsUploadOpen(false);
      setSelectedFile(null);
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    },
  });

  const createConversationMutation = useMutation({
    mutationFn: async () => {
      console.log('Project Detail: Creating conversation for project', projectId);
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Hello! I'd like to start discussing this project with you.",
          title: `${project?.name} Discussion`,
          type: "project",
          projectId,
        }),
        credentials: "include",
      });
      
      console.log('Project Detail: Create conversation response status:', response.status);
      
      if (!response.ok) {
        const text = await response.text();
        console.log('Project Detail: Create conversation error:', text);
        throw new Error(`HTTP ${response.status}: ${text}`);
      }
      
      const data = await response.json();
      console.log('Project Detail: Create conversation data:', data);
      return data;
    },
    onSuccess: (data) => {
      const conversationId = data.conversation?.id || data.id;
      setLocation(`/conversations/${conversationId}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create conversation",
        variant: "destructive",
      });
    },
  });

  const handleEditInstructions = () => {
    setInstructions(project?.instructions || "");
    setIsEditingInstructions(true);
  };

  const handleSaveInstructions = () => {
    updateProjectMutation.mutate({ instructions });
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  if (projectLoading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar 
          onNewChat={handleNewChat}
        />
        <main className="flex-1 flex flex-col overflow-hidden bg-gray-50">
          <div className="p-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar 
          onNewChat={handleNewChat}
        />
        <main className="flex-1 flex flex-col overflow-hidden bg-gray-50">
          <div className="p-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
              <Link href="/projects">
                <Button>Back to Projects</Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar 
        onNewChat={handleNewChat}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/projects">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Projects
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{project.name}</h1>
                <p className="text-sm text-gray-500">
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Button
              onClick={() => createConversationMutation.mutate()}
              disabled={createConversationMutation.isPending}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Start Conversation
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Instructions Section */}
          <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Project Instructions</span>
          </CardTitle>
          {!isEditingInstructions && (
            <Button variant="ghost" size="sm" onClick={handleEditInstructions}>
              <Edit2 className="w-4 h-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isEditingInstructions ? (
            <div className="space-y-4">
              <Textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Set up instructions for TheoAssist in this project..."
                rows={4}
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditingInstructions(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveInstructions}
                  disabled={updateProjectMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">
              {project.instructions || "No instructions set for this project. Click edit to add instructions that TheoAssist will follow in all conversations."}
            </p>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="conversations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="conversations" className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>Conversations</span>
          </TabsTrigger>
          <TabsTrigger value="attachments" className="flex items-center space-x-2">
            <Paperclip className="w-4 h-4" />
            <span>Attachments</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="conversations" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Project Conversations</h3>
            <Button onClick={() => createConversationMutation.mutate()}>
              <Plus className="w-4 h-4 mr-2" />
              New Conversation
            </Button>
          </div>

          {conversations.length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="font-semibold mb-2">No Conversations Yet</h4>
                <p className="text-muted-foreground mb-4">
                  Start a new conversation in this project to discuss with TheoAssist using your attachments and instructions.
                </p>
                <Button onClick={() => createConversationMutation.mutate()}>
                  Start Conversation
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {conversations.map((conversation) => (
                <Link key={conversation.id} href={`/conversations/${conversation.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{conversation.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {conversation.messageCount} messages • {new Date(conversation.updatedAt).toLocaleDateString()}
                          </p>
                          {conversation.preview && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                              {conversation.preview}
                            </p>
                          )}
                        </div>
                        <MessageSquare className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="attachments" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Project Attachments</h3>
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Attach File
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Attachment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="file">Select File</Label>
                    <Input
                      id="file"
                      type="file"
                      accept=".pdf,.txt"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Support for PDF and text files (max 10MB)
                    </p>
                  </div>
                  {selectedFile && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleUpload}
                      disabled={!selectedFile || uploadMutation.isPending}
                    >
                      Upload
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {attachmentsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : attachments.length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <Paperclip className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="font-semibold mb-2">No Attachments</h4>
                <p className="text-muted-foreground mb-4">
                  Start by attaching files to your project. They will be used in all chats within this project.
                </p>
                <Button onClick={() => setIsUploadOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Attach File
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {attachments.map((attachment) => (
                <Card key={attachment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{attachment.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(attachment.size / 1024).toFixed(1)} KB • {new Date(attachment.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}