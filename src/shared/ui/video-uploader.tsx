"use client";

import React, { useState } from "react";
import { Media } from "@/shared/types";
import { FileUploader } from "./file-uploader";

interface VideoUploaderProps {
  category?: string;
  onVideoUploaded?: (media: Media) => void;
  className?: string;
}

export function VideoUploader({ category = "STORY_VIDEO", onVideoUploaded, className }: VideoUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleComplete = (media: Media) => {
    setPreview(media.thumbnailUrl || media.url);
    onVideoUploaded?.(media);
  };

  return (
    <div className={className}>
      {preview && (
        <div className="mb-4">
          <video
            src={preview}
            controls
            className="max-h-64 w-full rounded-lg"
          />
        </div>
      )}
      <FileUploader
        category={category}
        accept="video/mp4,video/webm,video/ogg"
        multiple={false}
        maxSizeBytes={100 * 1024 * 1024}
        onUploadComplete={handleComplete}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
            <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm text-gray-400">
            Drag & drop a video or <span className="text-red-400">browse</span>
          </p>
          <p className="text-xs text-gray-500">MP4, WebM up to 100MB</p>
        </div>
      </FileUploader>
    </div>
  );
}
