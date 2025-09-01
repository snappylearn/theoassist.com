import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Artifact, InsertArtifact } from "@shared/schema";

export function useArtifacts(filters?: { type?: string; collectionId?: number }) {
  const params = new URLSearchParams();
  if (filters?.type) params.append("type", filters.type);
  if (filters?.collectionId) params.append("collectionId", filters.collectionId.toString());
  
  const queryString = params.toString();
  const url = `/api/artifacts${queryString ? `?${queryString}` : ""}`;
  
  return useQuery({
    queryKey: ["/api/artifacts", filters],
    queryFn: () => apiRequest(url),
  });
}

export function useArtifact(id: number) {
  return useQuery({
    queryKey: ["/api/artifacts", id],
    queryFn: () => apiRequest(`/api/artifacts/${id}`),
    enabled: !!id,
  });
}

export function useCreateArtifact() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (artifact: InsertArtifact) =>
      apiRequest("/api/artifacts", {
        method: "POST",
        body: JSON.stringify(artifact),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/artifacts"] });
    },
  });
}

export function useUpdateArtifact() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...updates }: { id: number } & Partial<InsertArtifact>) =>
      apiRequest(`/api/artifacts/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/artifacts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/artifacts", variables.id] });
    },
  });
}

export function useDeleteArtifact() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) =>
      apiRequest(`/api/artifacts/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/artifacts"] });
    },
  });
}