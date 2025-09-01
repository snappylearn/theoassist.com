import { useQuery, useMutation } from "@tanstack/react-query";
import { messagesApi } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useMessages(conversationId: number) {
  return useQuery({
    queryKey: ["/api/conversations", conversationId, "messages"],
    queryFn: () => {
      console.log('Fetching messages for conversation:', conversationId);
      return messagesApi.getByConversation(conversationId);
    },
    enabled: !!conversationId,
    retry: false,
  });
}

export function useSendMessage() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ conversationId, content }: { conversationId: number; content: string }) =>
      messagesApi.send(conversationId, content),
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({ 
        queryKey: ["/api/conversations", conversationId, "messages"] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ["/api/conversations"] 
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    },
  });
}
