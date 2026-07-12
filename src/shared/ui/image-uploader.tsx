"use client";

import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { Media } from "@/shared/types";
import { FileUploader } from "./file-uploader";

interface ImageUploaderProps {
  category?: string;
  onImageUploaded?: (media: Media) => void;
  className?: string;
}

export function ImageUploader({ category = "POST_IMAGE", onImageUploaded, className }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<Media | null>(null);

  const handleComplete = (media: Media) => {
    setUploadedImage(media);
    setPreview(media.thumbnailUrl || media.url);
    onImageUploaded?.(media);
  };

  return (
    <div className={className}>
      {preview && (
        <div className="mb-4 relative">
          <Image
            src={preview}
            alt="Upload preview"
            width={640}
            height={256}
            className="max-h-64 w-full rounded-lg object-cover"
            unoptimized
          />
          <button
            onClick={() => {
              setPreview(null);
              setUploadedImage(null);
            }}
            className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
            aria-label="Remove preview"
          >
            ✕
          </button>
        </div>
      )}
      <FileUploader
        category={category}
        accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
        multiple={false}
        maxSizeBytes={10 * 1024 * 1024}
        onUploadComplete={handleComplete}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10">
            <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm text-gray-400">
            Drag & drop an image or <span className="text-purple-400">browse</span>
          </p>
          <p className="text-xs text-gray-500">JPG, PNG, GIF, WebP up to 10MB</p>
        </div>
      </FileUploader>
    </div>
  );
}
