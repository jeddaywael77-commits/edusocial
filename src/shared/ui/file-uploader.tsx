"use client";

import React, { useCallback, useRef, useState } from "react";
import { mediaApi } from "@/api/media";
import { Media, MediaUploadProgress } from "@/shared/types";
import { UploadProgress } from "./upload-progress";

interface FileUploaderProps {
  category?: string;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeBytes?: number;
  onUploadComplete?: (media: Media) => void;
  onUploadError?: (error: Error, file: File) => void;
  children?: React.ReactNode;
  className?: string;
}

export function FileUploader({
  category = "POST_IMAGE",
  accept,
  multiple = false,
  maxFiles = 10,
  maxSizeBytes = 50 * 1024 * 1024,
  onUploadComplete,
  onUploadError,
  children,
  className = "",
}: FileUploaderProps) {
  const [uploads, setUploads] = useState<MediaUploadProgress[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files).slice(0, maxFiles);

      for (const file of fileArray) {
        if (file.size > maxSizeBytes) {
          onUploadError?.(
            new Error(`File "${file.name}" exceeds ${Math.round(maxSizeBytes / 1024 / 1024)}MB limit`),
            file
          );
          continue;
        }

        const fileId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

        const uploadProgress: MediaUploadProgress = {
          fileId,
          file,
          progress: 0,
          status: "uploading",
        };

        setUploads((prev) => [...prev, uploadProgress]);

        try {
          const media = await mediaApi.upload(file, category, (pct) => {
            setUploads((prev) =>
              prev.map((u) => (u.fileId === fileId ? { ...u, progress: pct } : u))
            );
          });

          setUploads((prev) =>
            prev.map((u) =>
              u.fileId === fileId ? { ...u, status: "complete", progress: 100, media } : u
            )
          );

          onUploadComplete?.(media);

          setTimeout(() => {
            setUploads((prev) => prev.filter((u) => u.fileId !== fileId));
          }, 3000);
        } catch (err: any) {
          setUploads((prev) =>
            prev.map((u) =>
              u.fileId === fileId ? { ...u, status: "error", error: err.message } : u
            )
          );
          onUploadError?.(err, file);
        }
      }
    },
    [category, maxFiles, maxSizeBytes, onUploadComplete, onUploadError]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const cancelUpload = (fileId: string) => {
    setUploads((prev) => prev.filter((u) => u.fileId !== fileId));
  };

  const retryUpload = (fileId: string) => {
    const upload = uploads.find((u) => u.fileId === fileId);
    if (upload) {
      setUploads((prev) => prev.filter((u) => u.fileId !== fileId));
      handleFiles([upload.file]);
    }
  };

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-500/10"
            : "border-[#1e293b] bg-[#0a0f1a] hover:border-gray-600 hover:bg-[#0f1724]"
        }`}
      >
        {children || (
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1a2332]">
              <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-sm text-gray-400">
              Drag & drop files here or <span className="text-blue-400">browse</span>
            </p>
            <p className="text-xs text-gray-500">
              Max {Math.round(maxSizeBytes / 1024 / 1024)}MB per file{multiple ? `, up to ${maxFiles} files` : ""}
            </p>
          </div>
        )}
      </div>

      {uploads.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploads.map((u) => (
            <UploadProgress
              key={u.fileId}
              progress={u.progress}
              status={u.status}
              fileName={u.file.name}
              error={u.error}
              onCancel={() => cancelUpload(u.fileId)}
              onRetry={() => retryUpload(u.fileId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
