"use client";

import React, { useState } from "react";
import { Media } from "@/shared/types";
import { mediaApi } from "@/api/media";

interface MediaGalleryProps {
  media: Media[];
  onMediaDeleted?: (id: string) => void;
  onMediaSelected?: (media: Media) => void;
  selectable?: boolean;
  className?: string;
}

export function MediaGallery({
  media,
  onMediaDeleted,
  onMediaSelected,
  selectable = false,
  className = "",
}: MediaGalleryProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState<string | null>(null);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await mediaApi.delete(id);
      onMediaDeleted?.(id);
    } catch (err) {
      console.error("Failed to delete media:", err);
    }
    setDeleting(null);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return "🖼";
    if (mimeType.startsWith("video/")) return "🎬";
    if (mimeType.includes("pdf")) return "📄";
    if (mimeType.includes("word") || mimeType.includes("document")) return "📝";
    if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) return "📊";
    if (mimeType.includes("powerpoint") || mimeType.includes("presentation")) return "📽";
    return "📁";
  };

  return (
    <div className={className}>
      {selectedIds.size > 0 && (
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-blue-500/10 px-3 py-2 text-sm text-blue-400">
          <span>{selectedIds.size} selected</span>
          <button
            onClick={async () => {
              await mediaApi.bulkDelete(Array.from(selectedIds));
              selectedIds.forEach((id) => onMediaDeleted?.(id));
              setSelectedIds(new Set());
            }}
            className="ml-auto text-red-400 hover:text-red-300"
          >
            Delete selected
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {media.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              if (selectable) toggleSelect(item.id);
              else onMediaSelected?.(item);
            }}
            className={`group relative cursor-pointer overflow-hidden rounded-lg border transition-all ${
              selectedIds.has(item.id)
                ? "border-blue-500 ring-2 ring-blue-500/30"
                : "border-[#1e293b] hover:border-gray-600"
            }`}
          >
            {item.mimeType.startsWith("image/") ? (
              <div className="aspect-square">
                <img
                  src={item.thumbnailUrl || item.url}
                  alt={item.originalName || "Media"}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="flex aspect-square items-center justify-center bg-[#0f1724]">
                <span className="text-3xl">{getFileIcon(item.mimeType)}</span>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
              <p className="truncate text-xs text-white">{item.originalName || item.mimeType}</p>
              <p className="text-[10px] text-gray-300">{formatSize(item.size)}</p>
            </div>

            <div className="absolute top-1 right-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              {selectable && (
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${
                    selectedIds.has(item.id)
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-white/30 bg-black/40 text-white"
                  }`}
                >
                  {selectedIds.has(item.id) ? "✓" : ""}
                </div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.id);
                }}
                disabled={deleting === item.id}
                className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/80 text-[10px] text-white hover:bg-red-500"
              >
                {deleting === item.id ? "..." : "✕"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {media.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <p className="text-sm">No media files</p>
        </div>
      )}
    </div>
  );
}
