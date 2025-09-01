import {
  users,
  projects,
  projectAttachments,
  conversations,
  messages,
  artifacts,
  type User,
  type UpsertUser,
  type Project,
  type InsertProject,
  type ProjectAttachment,
  type InsertProjectAttachment,
  type Conversation,
  type InsertConversation,
  type Message,
  type InsertMessage,
  type Artifact,
  type InsertArtifact,
  type ProjectWithStats,
  type ConversationWithPreview,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, sql, and, isNull } from "drizzle-orm";

export interface IStorage {
  // User methods - required for multi-provider Auth
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createUser(user: UpsertUser): Promise<User>;

  // Project methods
  getProjects(userId: string): Promise<ProjectWithStats[]>;
  getProject(id: number, userId: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, updates: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number, userId: string): Promise<boolean>;

  // Project attachment methods
  getProjectAttachments(projectId: number, userId?: string): Promise<ProjectAttachment[]>;
  getProjectAttachment(id: number): Promise<ProjectAttachment | undefined>;
  createProjectAttachment(attachment: InsertProjectAttachment): Promise<ProjectAttachment>;
  deleteProjectAttachment(id: number, userId?: string): Promise<boolean>;

  // Conversation methods
  getConversations(userId: string): Promise<ConversationWithPreview[]>;
  getConversation(id: number, userId: string): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: number, updates: Partial<InsertConversation>): Promise<Conversation | undefined>;
  deleteConversation(id: number, userId: string): Promise<boolean>;

  // Message methods
  getMessages(conversationId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;

  // Artifact methods
  getArtifacts(userId: string, filters?: { type?: string }): Promise<Artifact[]>;
  getArtifact(id: number, userId?: string): Promise<Artifact | undefined>;
  createArtifact(artifact: InsertArtifact): Promise<Artifact>;
  updateArtifact(id: number, updates: Partial<InsertArtifact>): Promise<Artifact | undefined>;
  deleteArtifact(id: number, userId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations - required for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  // Project operations
  async getProjects(userId: string): Promise<ProjectWithStats[]> {
    const result = await db
      .select({
        id: projects.id,
        name: projects.name,
        instructions: projects.instructions,
        userId: projects.userId,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
        attachmentCount: count(projectAttachments.id),
        conversationCount: count(conversations.id),
      })
      .from(projects)
      .leftJoin(projectAttachments, eq(projects.id, projectAttachments.projectId))
      .leftJoin(conversations, eq(projects.id, conversations.projectId))
      .where(eq(projects.userId, userId))
      .groupBy(projects.id)
      .orderBy(desc(projects.updatedAt));

    return result.map(r => ({
      ...r,
      attachmentCount: Number(r.attachmentCount),
      conversationCount: Number(r.conversationCount),
    }));
  }

  async getProject(id: number, userId: string): Promise<Project | undefined> {
    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, userId)));
    return project || undefined;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [created] = await db.insert(projects).values(project).returning();
    return created;
  }

  async updateProject(id: number, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const [updated] = await db
      .update(projects)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteProject(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, userId)));
    return (result.rowCount ?? 0) > 0;
  }

  // Project attachment operations
  async getProjectAttachments(projectId: number, userId?: string): Promise<ProjectAttachment[]> {
    if (userId) {
      const project = await this.getProject(projectId, userId);
      if (!project) return [];
    }
    
    return await db
      .select()
      .from(projectAttachments)
      .where(eq(projectAttachments.projectId, projectId))
      .orderBy(desc(projectAttachments.uploadedAt));
  }

  async getProjectAttachment(id: number): Promise<ProjectAttachment | undefined> {
    const [attachment] = await db
      .select()
      .from(projectAttachments)
      .where(eq(projectAttachments.id, id));
    return attachment || undefined;
  }

  async createProjectAttachment(attachment: InsertProjectAttachment): Promise<ProjectAttachment> {
    const [created] = await db.insert(projectAttachments).values(attachment).returning();
    return created;
  }

  async deleteProjectAttachment(id: number, userId?: string): Promise<boolean> {
    if (userId) {
      const attachment = await this.getProjectAttachment(id);
      if (!attachment) return false;
      
      const project = await this.getProject(attachment.projectId, userId);
      if (!project) return false;
    }
    
    const result = await db
      .delete(projectAttachments)
      .where(eq(projectAttachments.id, id));
    return (result.rowCount ?? 0) > 0;
  }



  // Conversation methods
  async getConversations(userId: string, projectId?: number | null): Promise<ConversationWithPreview[]> {
    let query = db
      .select({
        id: conversations.id,
        title: conversations.title,
        type: conversations.type,
        collectionId: conversations.collectionId,
        projectId: conversations.projectId,
        userId: conversations.userId,
        createdAt: conversations.createdAt,
        updatedAt: conversations.updatedAt,
        messageCount: count(messages.id),
        lastMessage: sql<string>`(
          SELECT content 
          FROM ${messages} 
          WHERE ${messages.conversationId} = ${conversations.id} 
          ORDER BY ${messages.createdAt} DESC 
          LIMIT 1
        )`,
      })
      .from(conversations)
      .leftJoin(messages, eq(conversations.id, messages.conversationId));

    // Apply filters
    const conditions = [eq(conversations.userId, userId)];
    
    if (projectId !== undefined) {
      if (projectId === null) {
        // Filter for conversations not associated with any project (independent chats)
        conditions.push(isNull(conversations.projectId));
      } else {
        // Filter for conversations associated with specific project
        conditions.push(eq(conversations.projectId, projectId));
      }
    }

    const conversationsWithPreview = await query
      .where(and(...conditions))
      .groupBy(conversations.id)
      .orderBy(desc(conversations.updatedAt));

    return conversationsWithPreview.map(conv => ({
      ...conv,
      preview: conv.lastMessage || "No messages yet",
      messageCount: conv.messageCount || 0,
      lastMessage: conv.lastMessage || undefined,
    }));
  }

  async getConversation(id: number, userId: string): Promise<Conversation | undefined> {
    console.log(`Storage: Looking for conversation ${id} for user ${userId}`);
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(and(eq(conversations.id, id), eq(conversations.userId, userId)));
    console.log(`Storage: Found conversation:`, conversation);
    return conversation || undefined;
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const [conversation] = await db
      .insert(conversations)
      .values(insertConversation)
      .returning();
    return conversation;
  }

  async updateConversation(id: number, updates: Partial<InsertConversation>): Promise<Conversation | undefined> {
    const [conversation] = await db
      .update(conversations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(conversations.id, id))
      .returning();
    return conversation || undefined;
  }

  async deleteConversation(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(conversations)
      .where(eq(conversations.id, id) && eq(conversations.userId, userId));
    return (result.rowCount ?? 0) > 0;
  }

  // Message methods
  async getMessages(conversationId: number): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(insertMessage)
      .returning();
    return message;
  }

  // Artifact methods
  async getArtifacts(userId: string, filters?: { type?: string }): Promise<Artifact[]> {
    let query = db
      .select()
      .from(artifacts)
      .where(eq(artifacts.userId, userId));
    
    if (filters?.type) {
      query = query.where(and(eq(artifacts.userId, userId), eq(artifacts.type, filters.type)));
    }
    
    const results = await query.orderBy(desc(artifacts.createdAt));
    return results;
  }

  async getArtifact(id: number, userId?: string): Promise<Artifact | undefined> {
    let query = db
      .select()
      .from(artifacts)
      .where(eq(artifacts.id, id));
    
    if (userId) {
      query = query.where(and(eq(artifacts.id, id), eq(artifacts.userId, userId)));
    }
    
    const [artifact] = await query;
    return artifact || undefined;
  }

  async createArtifact(insertArtifact: InsertArtifact): Promise<Artifact> {
    const [artifact] = await db
      .insert(artifacts)
      .values(insertArtifact)
      .returning();
    return artifact;
  }

  async updateArtifact(id: number, updates: Partial<InsertArtifact>): Promise<Artifact | undefined> {
    const [artifact] = await db
      .update(artifacts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(artifacts.id, id))
      .returning();
    return artifact || undefined;
  }

  async deleteArtifact(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(artifacts)
      .where(eq(artifacts.id, id) && eq(artifacts.userId, userId));
    return (result.rowCount ?? 0) > 0;
  }
}

export const storage = new DatabaseStorage();