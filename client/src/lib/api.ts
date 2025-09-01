import { apiRequest } from "./queryClient";
import type { 
  Collection, 
  Document, 
  Conversation, 
  Message, 
  InsertCollection, 
  CollectionWithStats,
  ConversationWithPreview 
} from "@shared/schema";

// Collections API
export const collectionsApi = {
  getAll: async (): Promise<CollectionWithStats[]> => {
    const res = await apiRequest("GET", "/api/collections");
    return res.json();
  },

  getById: async (id: number): Promise<Collection> => {
    const res = await apiRequest("GET", `/api/collections/${id}`);
    return res.json();
  },

  create: async (data: Omit<InsertCollection, "userId">): Promise<Collection> => {
    const res = await apiRequest("POST", "/api/collections", data);
    return res.json();
  },

  delete: async (id: number): Promise<void> => {
    await apiRequest("DELETE", `/api/collections/${id}`);
  },
};

// Documents API
export const documentsApi = {
  getByCollection: async (collectionId: number): Promise<Document[]> => {
    const res = await apiRequest("GET", `/api/collections/${collectionId}/documents`);
    return res.json();
  },

  upload: async (collectionId: number, file: File): Promise<Document> => {
    const formData = new FormData();
    formData.append("file", file);
    
    const res = await fetch(`/api/collections/${collectionId}/documents`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!res.ok) {
      const text = (await res.text()) || res.statusText;
      throw new Error(`${res.status}: ${text}`);
    }

    return res.json();
  },

  delete: async (id: number): Promise<void> => {
    await apiRequest("DELETE", `/api/documents/${id}`);
  },
};

// Conversations API
export const conversationsApi = {
  getAll: async (projectId?: number): Promise<ConversationWithPreview[]> => {
    const params = new URLSearchParams();
    if (projectId !== undefined) {
      params.set('projectId', projectId.toString());
    }
    
    const url = `/api/conversations${params.toString() ? `?${params.toString()}` : ''}`;
    console.log('Conversations API: Making request to', url);
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      
      console.log('Conversations API: Response status:', res.status);
      
      if (!res.ok) {
        const textResponse = await res.text();
        console.log('Conversations API: Error response:', textResponse.substring(0, 200));
        throw new Error(`HTTP ${res.status}: ${textResponse}`);
      }
      
      const data = await res.json();
      console.log('Conversations API: Response data:', data);
      return data;
    } catch (error) {
      console.error('Conversations API: Error in getAll:', error);
      throw error;
    }
  },

  getById: async (id: number): Promise<Conversation> => {
    console.log('API: Making request to /api/conversations/' + id);
    try {
      // Make direct fetch to ensure we hit the Express server
      const res = await fetch(`/api/conversations/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      
      console.log('API: Response status:', res.status);
      console.log('API: Response URL:', res.url);
      const contentType = res.headers.get('content-type');
      console.log('API: Content-Type:', contentType);
      
      if (!res.ok) {
        const textResponse = await res.text();
        console.log('API: Error response:', textResponse.substring(0, 200));
        throw new Error(`HTTP ${res.status}: ${textResponse}`);
      }
      
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await res.text();
        console.log('API: Non-JSON response received:', textResponse.substring(0, 200));
        throw new Error('Server returned non-JSON response');
      }
      
      const data = await res.json();
      console.log('API: Response data:', data);
      return data;
    } catch (error) {
      console.error('API: Error in getById:', error);
      throw error;
    }
  },

  create: async (data: { message: string; type: string; collectionId?: number; attachments?: File[] }): Promise<{ conversation: Conversation; messages: Message[] }> => {
    if (data.attachments && data.attachments.length > 0) {
      // Use FormData for file uploads
      const formData = new FormData();
      formData.append("message", data.message);
      formData.append("type", data.type);
      if (data.collectionId) {
        formData.append("collectionId", data.collectionId.toString());
      }
      
      data.attachments.forEach((file, index) => {
        formData.append(`attachments`, file);
      });

      const res = await fetch("/api/conversations", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const text = (await res.text()) || res.statusText;
        throw new Error(`${res.status}: ${text}`);
      }

      return res.json();
    } else {
      // Use regular JSON for text-only messages
      const res = await apiRequest("/api/conversations", {
        method: "POST",
        body: data,
      });
      return res.json();
    }
  },
};

// Messages API
export const messagesApi = {
  getByConversation: async (conversationId: number): Promise<Message[]> => {
    console.log('Messages API: Making request to /api/conversations/' + conversationId + '/messages');
    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      
      console.log('Messages API: Response status:', res.status);
      const contentType = res.headers.get('content-type');
      console.log('Messages API: Content-Type:', contentType);
      
      if (!res.ok) {
        const textResponse = await res.text();
        console.log('Messages API: Error response:', textResponse.substring(0, 200));
        throw new Error(`HTTP ${res.status}: ${textResponse}`);
      }
      
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await res.text();
        console.log('Messages API: Non-JSON response received:', textResponse.substring(0, 200));
        throw new Error('Server returned non-JSON response');
      }
      
      const data = await res.json();
      console.log('Messages API: Response data:', data);
      return data;
    } catch (error) {
      console.error('Messages API: Error in getByConversation:', error);
      throw error;
    }
  },

  send: async (conversationId: number, content: string): Promise<Message[]> => {
    console.log('Messages API: Sending message to conversation', conversationId);
    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
        credentials: "include",
      });
      
      console.log('Messages API: Send response status:', res.status);
      
      if (!res.ok) {
        const textResponse = await res.text();
        console.log('Messages API: Send error response:', textResponse.substring(0, 200));
        throw new Error(`HTTP ${res.status}: ${textResponse}`);
      }
      
      const data = await res.json();
      console.log('Messages API: Send response data:', data);
      return data;
    } catch (error) {
      console.error('Messages API: Error in send:', error);
      throw error;
    }
  },
};
