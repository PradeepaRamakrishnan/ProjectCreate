"use client";

import React, { useRef, useState } from "react";
import { FileText, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { useAuth } from "@/contexts/AuthContext";
import { useCreateProjectStore } from "../zustand/create-project-store";
import { useUploadFilesMutation } from "../useCreateProjectQuery";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface CreateProjectLocalFileUploadProps {
  projectId?: string | null;
  userId: string | null;
}

const CreateProjectLocalFileUpload: React.FC<
  CreateProjectLocalFileUploadProps
> = ({ projectId, userId }) => {
  const { user } = useAuth();

  // Use user.id if userId is not provided
  const effectiveUserId = userId || user?.id;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Get state from create-project store
  const uploadedFiles = useCreateProjectStore((s) => s.uploadedFiles);
  const setUploadedFiles = useCreateProjectStore((s) => s.setUploadedFiles);
  const selectedLocalFiles = useCreateProjectStore((s) => s.selectedLocalFiles);
  const setSelectedLocalFiles = useCreateProjectStore(
    (s) => s.setSelectedLocalFiles
  );

  // Upload mutation
  const { mutate: uploadFiles, isPending: isUploading } =
    useUploadFilesMutation();

  const [isDragOver, setIsDragOver] = useState(false);

  // Supported file types
  const supportedFileTypes = [
    "application/pdf",
    "text/plain",
    "application/json",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  const supportedExtensions = [
    ".pdf",
    ".txt",
    ".json",
    ".doc",
    ".docx",
    ".ppt",
    ".pptx",
    ".xls",
    ".xlsx",
  ];

  const isFileSupported = (file: File): boolean => {
    // Check MIME type first
    if (supportedFileTypes.includes(file.type)) {
      return true;
    }

    // Check file extension as fallback
    const extension = "." + file.name.split(".").pop()?.toLowerCase();
    return supportedExtensions.includes(extension);
  };

  const filterSupportedFiles = (files: File[]): File[] => {
    const supported: File[] = [];
    const unsupported: File[] = [];

    files.forEach((file) => {
      if (isFileSupported(file)) {
        supported.push(file);
      } else {
        unsupported.push(file);
      }
    });

    if (unsupported.length > 0) {
      const unsupportedNames = unsupported.map((f) => f.name).join(", ");
      toast.error(
        `Unsupported file type(s): ${unsupportedNames}. Supported formats: PDF, TXT, JSON, DOC, DOCX, PPT, PPTX, XLS, XLSX`
      );
    }

    return supported;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const supportedFiles = filterSupportedFiles(files);

      if (supportedFiles.length > 0) {
        setSelectedLocalFiles([...selectedLocalFiles, ...supportedFiles]);
        // Auto-upload after setting files
        setTimeout(() => {
          handleUploadWithFiles([...selectedLocalFiles, ...supportedFiles]);
        }, 100);
      }
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const supportedFiles = filterSupportedFiles(files);

      if (supportedFiles.length > 0) {
        setSelectedLocalFiles([...selectedLocalFiles, ...supportedFiles]);
        // Auto-upload after setting files
        setTimeout(() => {
          handleUploadWithFiles([...selectedLocalFiles, ...supportedFiles]);
        }, 100);
      }
    }
  };

  const handleUpload = () => {
    if (!selectedLocalFiles.length || !effectiveUserId) {
      return;
    }

    uploadFiles(
      { files: selectedLocalFiles, projectId, userId: effectiveUserId },
      {
        onSuccess: (newUploadedFiles) => {
          // Update the create-project store with new files
          const storeFiles = newUploadedFiles.map((file) => ({
            url: file.url,
            path: file.path,
            source: file.source || "local",
            name: file.name,
            size: file.size,
            type: file.type,
          }));

          // Add new files to existing uploaded files
          setUploadedFiles([...uploadedFiles, ...storeFiles]);

          // Clear selected files after successful upload
          setSelectedLocalFiles([]);

          // Show success message
          toast.success(
            `${newUploadedFiles.length} file(s) uploaded successfully!`
          );
        },
        onError: (error) => {
          console.error("Upload error", error);
          toast.error(`Upload failed: ${error.message}`);
        },
      }
    );
  };

  const handleUploadWithFiles = (filesToUpload: File[]) => {
    if (!filesToUpload.length || !effectiveUserId) {
      return;
    }

    uploadFiles(
      { files: filesToUpload, projectId, userId: effectiveUserId },
      {
        onSuccess: (newUploadedFiles) => {
          // Update the create-project store with new files
          const storeFiles = newUploadedFiles.map((file) => ({
            url: file.url,
            path: file.path,
            source: file.source || "local",
            name: file.name,
            size: file.size,
            type: file.type,
          }));

          // Add new files to existing uploaded files
          setUploadedFiles([...uploadedFiles, ...storeFiles]);

          // Clear selected files after successful upload
          setSelectedLocalFiles([]);

          // Show success message
          toast.success(
            `${newUploadedFiles.length} file(s) uploaded successfully!`
          );
        },
        onError: (error) => {
          console.error("Auto-upload error", error);
          toast.error(`Upload failed: ${error.message}`);
          // Reset selected files on error
          setSelectedLocalFiles([]);
        },
      }
    );
  };

  const handleRemoveFile = (index: number) => {
    setSelectedLocalFiles(selectedLocalFiles.filter((_, i) => i !== index));
  };

  const handleRemoveUploadedFile = (fileUrl: string) => {
    setUploadedFiles(uploadedFiles.filter((file) => file.url !== fileUrl));
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpload();
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      {/* File Upload Area */}
      <div
        ref={dropZoneRef}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver
            ? "border-purple-500 bg-purple-50"
            : "border-gray-300 hover:border-purple-400"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.txt,.json,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full">
            <Upload className="w-6 h-6 text-purple-600" />
          </div>

          <div>
            <p className="text-lg font-medium text-gray-900">Upload Files</p>
            <p className="text-sm text-gray-500 mt-1">
              Drag and drop files here, or{" "}
              <button
                type="button"
                onClick={openFileDialog}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                browse
              </button>
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Files will upload automatically when selected
            </p>
            <p className="text-xs text-gray-400">
              Supported formats: PDF, TXT, JSON, DOC, DOCX, PPT, PPTX, XLS, XLSX
            </p>
          </div>
        </div>
      </div>

      {/* Selected Files (uploading status) */}
      {selectedLocalFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm text-gray-700">
              {isUploading
                ? "Uploading Files..."
                : `Selected Files (${selectedLocalFiles.length}):`}
            </h4>
            {isUploading && (
              <div className="flex items-center text-blue-600 text-sm">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </div>
            )}
          </div>
          <ul className="mt-2 space-y-1">
            {selectedLocalFiles.map((file, idx) => (
              <li
                key={file.name + idx}
                className={`flex items-center justify-between rounded px-3 py-2 border ${
                  isUploading
                    ? "bg-blue-50 border-blue-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <span className="truncate text-sm">{file.name}</span>
                {!isUploading && (
                  <button
                    type="button"
                    className="ml-2 text-red-500 hover:bg-red-100 rounded-full p-1"
                    title="Remove"
                    onClick={() => handleRemoveFile(idx)}
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
                {isUploading && (
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-700">
            Uploaded Files ({uploadedFiles.length}):
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16V6a2 2 0 012-2h8a2 2 0 012 2v10M4 16h16M4 16v2a2 2 0 002 2h8a2 2 0 002-2v-2M9 10h6"
                      />
                    </svg>
                  </span>
                  <span className="font-medium">{file.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-500">local</span>
                  <span className="text-green-500">
                    <svg
                      className="inline h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveUploadedFile(file.url)}
                    className="ml-2 text-red-500 hover:bg-red-100 rounded-full p-1"
                    title="Remove"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </form>
  );
};

export default CreateProjectLocalFileUpload;
