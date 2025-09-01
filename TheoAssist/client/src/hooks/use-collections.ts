import { useQuery, useMutation } from "@tanstack/react-query";
import { collectionsApi } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useCollections() {
  return useQuery({
    queryKey: ["/api/collections"],
    queryFn: collectionsApi.getAll,
  });
}

export function useCollection(id: number) {
  return useQuery({
    queryKey: ["/api/collections", id],
    queryFn: () => collectionsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateCollection() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: collectionsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/collections"] });
      toast({
        title: "Success",
        description: "Collection created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create collection",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteCollection() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: collectionsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/collections"] });
      toast({
        title: "Success",
        description: "Collection deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete collection",
        variant: "destructive",
      });
    },
  });
}
