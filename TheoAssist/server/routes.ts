import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupSupabaseAuth, getUserId } from "./supabaseAuth";
import { setupAuthRoutes } from "./routes/auth";
import { 
  insertProjectSchema,
  insertProjectAttachmentSchema,
  insertConversationSchema, 
  insertMessageSchema,
  insertArtifactSchema
} from "@shared/schema";
import { generateIndependentResponse, generateProjectResponse, generateConversationTitle } from "./services/openai";
import multer from "multer";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only PDF and TXT files
    const allowedTypes = [
      'text/plain',
      'application/pdf'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up Supabase auth with minimal middleware
  await setupSupabaseAuth(app);
  setupAuthRoutes(app);
  


  // Auth routes are handled by setupSupabaseAuth

  // Test endpoint to check if basic endpoints work
  app.get("/api/test", (req: any, res) => {
    res.json({ message: "Test endpoint working", timestamp: new Date().toISOString() });
  });



  // Projects endpoints
  app.get("/api/projects", async (req: any, res) => {
    try {
      const userId = '880696e6-1d3d-47eb-a350-1bb11b697b9a';
      const projects = await storage.getProjects(userId);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", async (req: any, res) => {
    try {
      const userId = '880696e6-1d3d-47eb-a350-1bb11b697b9a';
      
      let { name, instructions = "" } = req.body;
      if (!name) {
        const projectCount = (await storage.getProjects(userId)).length;
        name = `Biblical Project ${projectCount + 1}`;
      }
      
      const validatedData = insertProjectSchema.parse({
        name,
        instructions,
        userId,
      });

      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.get("/api/projects/:id", async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = '880696e6-1d3d-47eb-a350-1bb11b697b9a';
      const project = await storage.getProject(id, userId);
      
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.patch("/api/projects/:id", async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = '880696e6-1d3d-47eb-a350-1bb11b697b9a';
      
      const existingProject = await storage.getProject(id, userId);
      if (!existingProject) {
        return res.status(404).json({ error: "Project not found" });
      }

      const updates = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(id, updates);
      
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      res.json(project);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = '880696e6-1d3d-47eb-a350-1bb11b697b9a';
      
      const success = await storage.deleteProject(id, userId);
      if (!success) {
        return res.status(404).json({ error: "Project not found" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  app.get("/api/projects/:id/attachments", async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const userId = '880696e6-1d3d-47eb-a350-1bb11b697b9a';
      const attachments = await storage.getProjectAttachments(projectId, userId);
      res.json(attachments);
    } catch (error) {
      console.error("Error fetching attachments:", error);
      res.status(500).json({ error: "Failed to fetch attachments" });
    }
  });

  app.post("/api/projects/:id/attachments", upload.single('file'), async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const userId = "880696e6-1d3d-47eb-a350-1bb11b697b9a";
      
      const project = await storage.getProject(projectId, userId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      let content = '';
      
      if (req.file.mimetype === 'application/pdf') {
        try {
          // Simplified PDF extraction - just store file info for now
          content = `PDF Document: ${req.file.originalname}\nSize: ${req.file.size} bytes\nContent extraction pending...`;
        } catch (error) {
          console.error("Error extracting PDF text:", error);
          return res.status(400).json({ error: "Failed to extract text from PDF" });
        }
      } else if (req.file.mimetype === 'text/plain') {
        content = req.file.buffer.toString('utf-8');
      } else if (req.file.mimetype.startsWith("text/")) {
        content = req.file.buffer.toString("utf-8");
      } else {
        content = `File: ${req.file.originalname} (${req.file.size} bytes)\nMime type: ${req.file.mimetype}`;
        return res.status(400).json({ error: "Unsupported file type" });
      }

      const validatedData = insertProjectAttachmentSchema.parse({
        name: req.file.originalname,
        content,
        mimeType: req.file.mimetype,
        size: req.file.size,
        projectId,
      });

      const attachment = await storage.createProjectAttachment(validatedData);
      res.status(201).json(attachment);
    } catch (error) {
      console.error("Error uploading attachment:", error);
      res.status(500).json({ error: "Failed to upload attachment" });
    }
  });

  app.delete("/api/project-attachments/:id", async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = "880696e6-1d3d-47eb-a350-1bb11b697b9a";
      
      const success = await storage.deleteProjectAttachment(id, userId);
      if (!success) {
        return res.status(404).json({ error: "Attachment not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting attachment:", error);
      res.status(500).json({ error: "Failed to delete attachment" });
    }
  });



  // Conversations endpoints
  app.get("/api/conversations", async (req: any, res) => {
    try {
      const userId = "880696e6-1d3d-47eb-a350-1bb11b697b9a";
      const projectId = req.query.projectId ? parseInt(req.query.projectId) : undefined;
      
      console.log("Fetching conversations for user:", userId, "projectId:", projectId);
      const conversations = await storage.getConversations(userId, projectId);
      console.log("Conversations found:", conversations.length);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  app.get("/api/conversations/:id", async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = "880696e6-1d3d-47eb-a350-1bb11b697b9a";
      
      console.log(`Fetching conversation ${id} for user ${userId}`);
      
      const conversation = await storage.getConversation(id, userId);
      
      console.log(`Conversation result:`, conversation);
      
      if (!conversation) {
        console.log(`Conversation ${id} not found`);
        return res.status(404).json({ error: "Conversation not found" });
      }
      
      console.log(`Returning conversation ${id}:`, conversation);
      res.json(conversation);
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ error: "Failed to fetch conversation" });
    }
  });

  // Update multer configuration to support more file types
  const conversationUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = [
        'text/plain',
        'text/markdown',
        'text/csv',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Unsupported file type'));
      }
    },
  });

  app.post("/api/conversations", conversationUpload.array('attachments'), async (req: any, res) => {
    try {
      const userId = "880696e6-1d3d-47eb-a350-1bb11b697b9a";
      const { message, type, collectionId, projectId, artifact, initialMessage, title } = req.body;
      const files = req.files as Express.Multer.File[] || [];
      
      // Handle both regular conversations and artifact customization
      const actualMessage = initialMessage || message;
      
      // Ensure we have a valid message
      if (!actualMessage || actualMessage.trim() === '') {
        return res.status(400).json({ error: "Message is required" });
      }

      // Parse collectionId and projectId if they're strings from FormData
      const parsedCollectionId = collectionId ? parseInt(collectionId) : undefined;
      const parsedProjectId = projectId ? parseInt(projectId) : undefined;

      // Validate collection ownership if provided
      if (parsedCollectionId) {
        const collection = await storage.getCollection(parsedCollectionId, userId);
        if (!collection) {
          return res.status(404).json({ error: "Collection not found" });
        }
      }

      // Validate project ownership if provided
      if (parsedProjectId) {
        const project = await storage.getProject(parsedProjectId, userId);
        if (!project) {
          return res.status(404).json({ error: "Project not found" });
        }
      }

      // Process attached files if any
      let attachmentContent = "";
      if (files.length > 0) {
        const attachmentParts: string[] = [];
        
        for (const file of files) {
          let content = "";
          
          // Extract text based on file type
          if (file.mimetype === 'application/pdf') {
            try {
              // Simplified PDF handling for now
              content = `PDF Document: ${file.originalname}\nSize: ${file.size} bytes\nContent extraction pending...`;
            } catch (error) {
              console.error("Error extracting PDF text:", error);
              return res.status(400).json({ error: `Failed to extract text from ${file.originalname}` });
            }
          } else if (file.mimetype === 'text/plain' || file.mimetype === 'text/markdown' || file.mimetype === 'text/csv') {
            content = file.buffer.toString('utf-8');
          } else if (file.mimetype.startsWith("text/")) {
            content = file.buffer.toString("utf-8");
          } else {
            content = `File: ${file.originalname} (${file.size} bytes)\nMime type: ${file.mimetype}`;
            return res.status(400).json({ error: `Unsupported file type: ${file.originalname}` });
          }
          
          attachmentParts.push(`--- Content from ${file.originalname} ---\n${content}\n`);
        }
        
        attachmentContent = attachmentParts.join('\n');
      }

      // Combine message with attachment content
      const fullMessage = attachmentContent 
        ? `${actualMessage}\n\n${attachmentContent}` 
        : actualMessage;

      // Generate conversation title from first message or use provided title
      const conversationTitle = title || await generateConversationTitle(actualMessage);

      const conversationData = insertConversationSchema.parse({
        title: conversationTitle,
        type,
        collectionId: parsedCollectionId,
        projectId: parsedProjectId,
        userId,
      });

      const conversation = await storage.createConversation(conversationData);

      // Create user message
      const userMessage = await storage.createMessage({
        content: fullMessage,
        role: "user",
        conversationId: conversation.id,
      });

      // Generate AI response
      let aiResponse;
      if (type === "project" && parsedProjectId) {
        const project = await storage.getProject(parsedProjectId, userId);
        const attachments = await storage.getProjectAttachments(parsedProjectId, userId);
        const attachmentData = attachments.map(att => ({
          name: att.name,
          content: att.content
        }));
        aiResponse = await generateProjectResponse(fullMessage, attachmentData, project?.instructions || undefined);
      } else {
        aiResponse = await generateIndependentResponse(fullMessage);
      }
      
      // If an artifact is provided, include it in the response
      if (artifact) {
        aiResponse.content = `${aiResponse.content}\n\n[ARTIFACT_START]${artifact.content}[ARTIFACT_END]`;
      }

      // Check if response contains artifact
      const artifactMatch = aiResponse.content.match(/\[ARTIFACT_START\]([\s\S]*?)\[ARTIFACT_END\]/);
      let artifactData = null;
      
      if (artifactMatch) {
        const artifactHtml = artifactMatch[1];
        
        // Use provided artifact info or extract from content
        let artifactTitle = 'Interactive Content';
        let artifactType = 'interactive';
        
        if (artifact) {
          // Use provided artifact data
          artifactTitle = artifact.title;
          artifactType = artifact.type;
        } else {
          // Extract from content
          const titleMatch = artifactHtml.match(/<!-- Artifact Title: (.*?) -->/);
          artifactTitle = titleMatch ? titleMatch[1] : 'Interactive Content';
          
          // Determine artifact type based on content
          if (artifactTitle.toLowerCase().includes('quiz')) artifactType = 'quiz_builder';
          else if (artifactTitle.toLowerCase().includes('calculator')) artifactType = 'math_visualizer';
          else if (artifactTitle.toLowerCase().includes('playground')) artifactType = 'code_playground';
          else if (artifactTitle.toLowerCase().includes('document')) artifactType = 'document_generator';
          else if (artifactTitle.toLowerCase().includes('presentation')) artifactType = 'presentation_maker';
          else if (artifactTitle.toLowerCase().includes('chart') || artifactTitle.toLowerCase().includes('graph')) artifactType = 'data_visualizer';
          else if (artifactTitle.toLowerCase().includes('mind map')) artifactType = 'mind_map_creator';
        }
        
        // Create artifact record
        const createdArtifact = await storage.createArtifact({
          title: artifactTitle,
          type: artifactType,
          content: artifactHtml,
          userId,
          collectionId: null,
          metadata: JSON.stringify({ 
            createdFrom: 'chat',
            conversationId: conversation.id,
            projectId: parsedProjectId
          })
        });
        
        artifactData = {
          artifactId: createdArtifact.id,
          title: artifactTitle,
          type: artifactType
        };
      }

      // Create AI message
      const aiMessage = await storage.createMessage({
        content: aiResponse.content,
        role: "assistant",
        conversationId: conversation.id,
        sources: aiResponse.sources ? JSON.stringify(aiResponse.sources) : null,
        artifactData: artifactData ? JSON.stringify(artifactData) : null,
      });

      res.status(201).json({
        conversation,
        messages: [userMessage, aiMessage],
      });
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ error: "Failed to create conversation" });
    }
  });

  app.delete("/api/conversations/:id", async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = "880696e6-1d3d-47eb-a350-1bb11b697b9a";
      const success = await storage.deleteConversation(id, userId);
      
      if (!success) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting conversation:", error);
      res.status(500).json({ error: "Failed to delete conversation" });
    }
  });

  // Messages endpoints
  app.get("/api/conversations/:id/messages", async (req: any, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      const userId = "880696e6-1d3d-47eb-a350-1bb11b697b9a";
      
      // Verify user owns the conversation
      const conversation = await storage.getConversation(conversationId, userId);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      
      const messages = await storage.getMessages(conversationId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/conversations/:id/messages", async (req: any, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      const userId = "880696e6-1d3d-47eb-a350-1bb11b697b9a";
      let { content } = req.body;

      // Verify user owns the conversation
      const conversation = await storage.getConversation(conversationId, userId);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      // Create user message
      const userMessage = await storage.createMessage({
        content,
        role: "user",
        conversationId,
      });

      // Get conversation history for context
      const existingMessages = await storage.getMessages(conversationId);
      const conversationHistory = existingMessages.map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content
      }));

      // Generate AI response
      let aiResponse;
      if (conversation.type === "project" && conversation.projectId) {
        const project = await storage.getProject(conversation.projectId, userId);
        const attachments = await storage.getProjectAttachments(conversation.projectId, userId);
        const attachmentData = attachments.map(att => ({
          name: att.name,
          content: att.content
        }));
        aiResponse = await generateProjectResponse(content, attachmentData, project?.instructions || undefined, conversationHistory);
      } else {
        aiResponse = await generateIndependentResponse(content, conversationHistory);
      }

      // Check if response contains artifact
      const artifactMatch = aiResponse.content.match(/\[ARTIFACT_START\]([\s\S]*?)\[ARTIFACT_END\]/);
      let artifactData = null;
      let artifactId = null;
      
      if (artifactMatch) {
        const artifactHtml = artifactMatch[1];
        const titleMatch = artifactHtml.match(/<!-- Artifact Title: (.*?) -->/);
        const title = titleMatch ? titleMatch[1] : 'Interactive Content';
        
        // Determine artifact type based on content
        let artifactType = 'interactive';
        if (title.toLowerCase().includes('quiz')) artifactType = 'quiz_builder';
        else if (title.toLowerCase().includes('calculator')) artifactType = 'math_visualizer';
        else if (title.toLowerCase().includes('playground')) artifactType = 'code_playground';
        else if (title.toLowerCase().includes('document')) artifactType = 'document_generator';
        else if (title.toLowerCase().includes('presentation')) artifactType = 'presentation_maker';
        else if (title.toLowerCase().includes('chart') || title.toLowerCase().includes('graph')) artifactType = 'data_visualizer';
        else if (title.toLowerCase().includes('mind map')) artifactType = 'mind_map_creator';
        
        // Create artifact record
        const artifact = await storage.createArtifact({
          title,
          type: artifactType,
          content: artifactHtml,
          userId,
          collectionId: null,
          metadata: JSON.stringify({ 
            createdFrom: 'chat',
            conversationId: conversationId,
            projectId: conversation.projectId
          })
        });
        
        artifactId = artifact.id;
        artifactData = {
          artifactId: artifact.id,
          title,
          type: artifactType
        };
      }

      // Create AI message
      const aiMessage = await storage.createMessage({
        content: aiResponse.content,
        role: "assistant",
        conversationId,
        sources: aiResponse.sources ? JSON.stringify(aiResponse.sources) : null,
        artifactData: artifactData ? JSON.stringify(artifactData) : null,
      });

      res.status(201).json([userMessage, aiMessage]);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ error: "Failed to create message" });
    }
  });

  // Project endpoints
  app.get("/api/projects", async (req: any, res) => {
    try {
      const userId = "880696e6-1d3d-47eb-a350-1bb11b697b9a";
      const projects = await storage.getProjects(userId);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = "880696e6-1d3d-47eb-a350-1bb11b697b9a";
      
      const project = await storage.getProject(id, userId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req: any, res) => {
    try {
      const userId = "880696e6-1d3d-47eb-a350-1bb11b697b9a";
      const { name, instructions } = req.body;
      
      const projectData = insertProjectSchema.parse({
        name: name || `Project ${Date.now()}`,
        instructions: instructions || null,
        userId,
      });
      
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.put("/api/projects/:id", async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = "880696e6-1d3d-47eb-a350-1bb11b697b9a";
      const { name, instructions } = req.body;
      
      // Verify user owns the project
      const existingProject = await storage.getProject(id, userId);
      if (!existingProject) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      const project = await storage.updateProject(id, {
        name,
        instructions,
      });
      
      res.json(project);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = "880696e6-1d3d-47eb-a350-1bb11b697b9a";
      
      const success = await storage.deleteProject(id, userId);
      if (!success) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  app.get("/api/projects/:id/attachments", async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const userId = "880696e6-1d3d-47eb-a350-1bb11b697b9a";
      
      // Verify user owns the project
      const project = await storage.getProject(projectId, userId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      const attachments = await storage.getProjectAttachments(projectId, userId);
      res.json(attachments);
    } catch (error) {
      console.error("Error fetching project attachments:", error);
      res.status(500).json({ error: "Failed to fetch project attachments" });
    }
  });

  app.post("/api/projects/:id/attachments", upload.single('file'), async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const userId = "880696e6-1d3d-47eb-a350-1bb11b697b9a";
      
      const project = await storage.getProject(projectId, userId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      let content = '';
      
      if (req.file.mimetype === 'application/pdf') {
        // Skip PDF parsing for now to avoid import issues
        content = `PDF file: ${req.file.originalname} (${req.file.size} bytes)\nPDF text extraction temporarily disabled.`;
      } else if (req.file.mimetype === 'text/plain' || req.file.mimetype.startsWith('text/')) {
        content = req.file.buffer.toString('utf-8');
      } else {
        // Accept other file types but store basic info
        content = `File: ${req.file.originalname} (${req.file.size} bytes)\nMime type: ${req.file.mimetype}`;
      }

      const validatedData = insertProjectAttachmentSchema.parse({
        name: req.file.originalname,
        content,
        mimeType: req.file.mimetype,
        size: req.file.size,
        projectId,
      });

      const attachment = await storage.createProjectAttachment(validatedData);
      res.status(201).json(attachment);
    } catch (error) {
      console.error("Error uploading attachment:", error);
      res.status(500).json({ error: "Failed to upload attachment" });
    }
  });

  app.delete("/api/project-attachments/:id", async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = "880696e6-1d3d-47eb-a350-1bb11b697b9a";
      
      const success = await storage.deleteProjectAttachment(id, userId);
      if (!success) {
        return res.status(404).json({ error: "Attachment not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting attachment:", error);
      res.status(500).json({ error: "Failed to delete attachment" });
    }
  });

  // Artifact endpoints
  app.get("/api/artifacts", async (req: any, res) => {
    try {
      const userId = "880696e6-1d3d-47eb-a350-1bb11b697b9a";
      const { type, collectionId } = req.query;
      
      const filters: any = {};
      if (type) filters.type = type;
      if (collectionId) filters.collectionId = parseInt(collectionId);
      
      const artifacts = await storage.getArtifacts(userId, filters);
      res.json(artifacts);
    } catch (error) {
      console.error("Error fetching artifacts:", error);
      res.status(500).json({ error: "Failed to fetch artifacts" });
    }
  });

  app.get("/api/artifacts/:id", async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = "880696e6-1d3d-47eb-a350-1bb11b697b9a";
      
      const artifact = await storage.getArtifact(id, userId);
      if (!artifact) {
        return res.status(404).json({ error: "Artifact not found" });
      }
      
      res.json(artifact);
    } catch (error) {
      console.error("Error fetching artifact:", error);
      res.status(500).json({ error: "Failed to fetch artifact" });
    }
  });

  app.post("/api/artifacts", async (req: any, res) => {
    try {
      const userId = "880696e6-1d3d-47eb-a350-1bb11b697b9a";
      const { title, type, content, description, collectionId, metadata } = req.body;
      
      // Validate collection ownership if provided
      if (collectionId) {
        const collection = await storage.getCollection(collectionId, userId);
        if (!collection) {
          return res.status(404).json({ error: "Collection not found" });
        }
      }
      
      const artifact = await storage.createArtifact({
        title,
        type,
        content,
        description,
        collectionId,
        metadata: metadata ? JSON.stringify(metadata) : null,
        userId,
      });
      
      res.status(201).json(artifact);
    } catch (error) {
      console.error("Error creating artifact:", error);
      res.status(500).json({ error: "Failed to create artifact" });
    }
  });

  app.put("/api/artifacts/:id", async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = "880696e6-1d3d-47eb-a350-1bb11b697b9a";
      const { title, type, content, description, collectionId, metadata } = req.body;
      
      // Verify user owns the artifact
      const existingArtifact = await storage.getArtifact(id, userId);
      if (!existingArtifact) {
        return res.status(404).json({ error: "Artifact not found" });
      }
      
      // Validate collection ownership if provided
      if (collectionId) {
        const collection = await storage.getCollection(collectionId, userId);
        if (!collection) {
          return res.status(404).json({ error: "Collection not found" });
        }
      }
      
      const artifact = await storage.updateArtifact(id, {
        title,
        type,
        content,
        description,
        collectionId,
        metadata: metadata ? JSON.stringify(metadata) : null,
      });
      
      res.json(artifact);
    } catch (error) {
      console.error("Error updating artifact:", error);
      res.status(500).json({ error: "Failed to update artifact" });
    }
  });

  app.delete("/api/artifacts/:id", async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = "880696e6-1d3d-47eb-a350-1bb11b697b9a";
      
      const success = await storage.deleteArtifact(id, userId);
      if (!success) {
        return res.status(404).json({ error: "Artifact not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting artifact:", error);
      res.status(500).json({ error: "Failed to delete artifact" });
    }
  });

  // Google OAuth configuration test endpoint
  app.get("/api/test-google-oauth", async (req, res) => {
    try {
      const config = {
        hasClientId: !!process.env.GOOGLE_CLIENT_ID,
        hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
        supabaseUrl: process.env.SUPABASE_URL,
        redirectUrl: `${process.env.SUPABASE_URL}/auth/v1/callback`,
        clientIdPreview: process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + '...'
      };
      
      res.json({
        message: "Google OAuth configuration check",
        config,
        status: config.hasClientId && config.hasClientSecret ? "ready" : "incomplete",
        nextSteps: [
          "1. Go to Supabase Dashboard → Authentication → Providers",
          "2. Enable Google provider",
          "3. Enter your Google Client ID and Secret",
          "4. Set redirect URL to: " + config.redirectUrl,
          "5. Save configuration"
        ]
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to check OAuth configuration" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}