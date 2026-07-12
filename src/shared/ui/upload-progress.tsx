"use client";

import { Progress } from "@/shared/ui/progress";

interface UploadProgressProps {
  progress: number;
  status: "pending" | "uploading" | "processing" | "complete" | "error";
  fileName: string;
  error?: string;
  onCancel?: () => void;
  onRetry?: () => void;
}

export function UploadProgress({
  progress,
  status,
  fileName,
  error,
  onCancel,
  onRetry,
}: UploadProgressProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-[#1e293b] bg-[#0f1724] p-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{fileName}</p>
        <div className="mt-1.5">
          <Progress value={progress} />
        </div>
        <p className="mt-1 text-xs text-gray-400">
          {status === "uploading" && `${progress}%`}
          {status === "processing" && "Processing..."}
          {status === "complete" && "Complete"}
          {status === "error" && (error || "Upload failed")}
          {status === "pending" && "Waiting..."}
        </p>
      </div>
      <div className="flex gap-1">
        {status === "uploading" && onCancel && (
          <button
            onClick={onCancel}
            className="rounded p-1 text-gray-400 hover:bg-red-500/20 hover:text-red-400"
          >
            ✕
          </button>
        )}
        {status === "error" && onRetry && (
          <button
            onClick={onRetry}
            className="rounded p-1 text-gray-400 hover:bg-blue-500/20 hover:text-blue-400"
          >
            ↻
          </button>
        )}
      </div>
    </div>
  );
}
