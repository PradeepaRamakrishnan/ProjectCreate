/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/integrations/supabase/client";
import { PubMedFile, UploadedFileInfo } from "@/lib/interfaces/document";

export const createCommonFileFormat = (
  file: any,
  type: "local" | "pubmed" | "uspto" | "clinicaltrials" | "uniprot",
  additionalData: any = {}
): UploadedFileInfo => {
  const timestamp = new Date().toISOString();
  const baseFile: UploadedFileInfo = {
    name: "",
    type: "",
    size: 0,
    path: "",
    url: "",
    uploaded_at: timestamp,
    source: type,
    metadata: {},
    id: "",
  };

  if (type === "local") {
    return {
      ...baseFile,
      name: file.name,
      type: file.type,
      size: file.size,
      path: additionalData.path,
      url: additionalData.url,
      metadata: {
        title: file.name,
        uploadType: "local",
      },
    };
  } else {
    return {
      ...baseFile,
      name: additionalData.filename || `${type}-${file.id || file.pmid}.pdf`,
      type: type,
      size: additionalData.filesize || 0,
      path: additionalData.fileUrl || "",
      url: additionalData.fileUrl || "",
      source_id: file.source_id,
      metadata: {
        title: file.title,
        authors: file.authors,
        pmid: file.pmid,
        year: file.year,
        journal: file.journal,
        uploadType: type,
      },
    };
  }
};

export const uploadFileToSupabase = async (
  file: File,
  projectId: string | null | undefined,
  userId: string
): Promise<{ path: string; url: string }> => {
  if (!userId) throw new Error("User must be authenticated to upload files");

  const fileExt = file.name.split(".").pop() || "";
  const fileName = `${Math.random()
    .toString(36)
    .substring(2)}-${Date.now()}.${fileExt}`;
  const storagePath = `${userId}/${fileName}`;

  try {
    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(storagePath, file);

    if (uploadError)
      throw new Error(`Storage upload failed: ${uploadError.message}`);

    const { data: urlData } = supabase.storage
      .from("documents")
      .getPublicUrl(storagePath);

    if (!urlData?.publicUrl) throw new Error("Failed to get public URL");

    return { path: storagePath, url: urlData.publicUrl };
  } catch (error) {
    throw new Error(
      `Failed to upload file: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const getFileDisplayInfo = (file: UploadedFileInfo) => {
  const isLocal = file.source === "local";
  return {
    title: isLocal ? file.name : file.metadata?.title || file.name,
    subtitle: isLocal
      ? file.type
      : `${file.metadata?.authors || "Unknown"} | PMID: ${
          file.metadata?.pmid || "N/A"
        }`,
  };
};

export const updateProjectFiles = async (
  projectId: string | null | undefined,
  newFiles: UploadedFileInfo[]
) => {
  if (!projectId) return;

  try {
    const { data: project, error: fetchError } = await supabase
      .from("projects")
      .select("files")
      .eq("id", projectId)
      .single();

    if (fetchError) throw fetchError;

    const currentFiles = project?.files ? (project.files as any[]) : [];

    const updatedFiles = [
      ...currentFiles,
      ...newFiles.filter(
        (newFile) =>
          !currentFiles.some((existingFile) => existingFile.url === newFile.url)
      ),
    ];

    const { error: updateError } = await supabase
      .from("projects")
      .update({
        files: JSON.parse(JSON.stringify(updatedFiles)),
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId);

    if (updateError) throw updateError;

    return updatedFiles;
  } catch (error) {
    console.error("Update project files error:", error);
    throw error;
  }
};
