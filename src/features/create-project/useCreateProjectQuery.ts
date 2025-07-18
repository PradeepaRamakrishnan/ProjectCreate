import { useMutation, useQuery } from "@tanstack/react-query";
import { searchSourcesApi } from "@/services/sources.service";
import { toast } from "sonner";
import { createProjectApi } from "./create-project.service";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { uploadFileToSupabase } from "@/fileUtils";
import { LocalUploadedFileInfo } from "./types";

export const useSearchSourcesMutation = () => {
  return useMutation({
    mutationFn: async (searchBody: unknown) => {
      const response = await searchSourcesApi(searchBody);
      return response;
    },

    onError: (error) => {
      toast.error(`Failed to fetch sources. Please try again. ${error}`);
    },
  });
};

export const useTeamsQuery = (visibility: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["teams", user?.id, visibility],
    queryFn: async () => {
      if (visibility !== "team" || !user?.id) return [];
      const { data, error } = await supabase
        .from("teams")
        .select(
          "id, name, description, created_at, updated_at, team_members!inner(*)"
        )
        .eq("team_members.user_id", user.id);
      if (error) throw error;
      // Map to Team[]
      return (data || []).map((team: Record<string, unknown>) => ({
        id: team.id as string,
        name: team.name as string,
        description: team.description as string,
        created_at: team.created_at as string,
        updated_at: team.updated_at as string,
      }));
    },
    enabled: visibility === "team" && !!user?.id,
  });
};

export const useCreateProjectMutation = () => {
  return useMutation({
    mutationFn: async (payload: unknown) => {
      const response = await createProjectApi(payload);
      return response;
    },
    onSuccess: (data) => {
      toast.success(
        `Project created successfully. Redirecting to dashboard...`
      );
      return data;
    },
    onError: (error) => {
      toast.error(`Failed to create project. Please try again. ${error}`);
    },
  });
};

export const useUploadFilesMutation = () => {
  return useMutation({
    mutationFn: async ({
      files,
      projectId,
      userId,
    }: {
      files: File[];
      projectId: string | null;
      userId: string;
    }) => {
      const uploadedFiles: LocalUploadedFileInfo[] = [];

      for (const file of files) {
        const fileInfo = await uploadFileToSupabase(file, projectId, userId);

        // // Create document record
        // const { data: document, error: docError } = await supabase
        //   .from("documents")
        //   .insert({
        //     name: file.name,
        //     type: file.type,
        //     size: file.size,
        //     upload_date: new Date().toISOString(),
        //     user_id: userId,
        //     storage_path: fileInfo.path,
        //     public_url: fileInfo.url,
        //     created_at: new Date().toISOString(),
        //     updated_at: new Date().toISOString(),
        //     project_id: projectId,
        //   })
        //   .select()
        //   .single();

        // if (docError) {
        //   console.error('Document creation error:', docError);
        //   throw docError;
        // }

        // console.log('Document created:', document);

        // Create file data with document ID for proper tracking
        const fileData = {
          url: fileInfo.url,
          path: fileInfo.path,
          source: "local",
          name: file.name,
          size: file.size,
          type: file.type,
        };

        uploadedFiles.push(fileData);
      }

      return uploadedFiles;
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast.error(`Failed to upload files. Please try again. ${error}`);
    },
  });
};
