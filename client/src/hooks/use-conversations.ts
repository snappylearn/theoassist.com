import { useQuery, useMutation } from "@tanstack/react-query";
import { conversationsApi } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useConversations(projectId?: number) {
  return useQuery({
    queryKey: ["/api/conversations", { projectId }],
    queryFn: () => {
      console.log('Fetching conversations for sidebar, projectId:', projectId);
      return conversationsApi.getAll(projectId);
    },
    refetchOnWindowFocus: true,
    staleTime: 0, // Always refetch to ensure fresh data
  });
}

export function useConversation(id: number) {
  return useQuery({
    queryKey: ["/api/conversations", id],
    queryFn: () => {
      console.log('Fetching conversation with ID:', id);
      return conversationsApi.getById(id);
    },
    enabled: !!id,
    retry: false, // Disable retries to see the exact error
  });
}

export function useCreateConversation() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: conversationsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to start conversation",
        variant: "destructive",
      });
    },
  });
}
