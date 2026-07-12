"use client";

import React from "react";
import { Media } from "@/shared/types";
import { FileUploader } from "./file-uploader";

interface DocumentUploaderProps {
  category?: string;
  onDocumentUploaded?: (media: Media) => void;
  className?: string;
}

const DOC_ICONS: Record<string, { color: string; label: string }> = {
  pdf: { color: "text-red-400", label: "PDF" },
  doc: { color: "text-blue-400", label: "DOC" },
  docx: { color: "text-blue-400", label: "DOCX" },
  xls: { color: "text-green-400", label: "XLS" },
  xlsx: { color: "text-green-400", label: "XLSX" },
  ppt: { color: "text-orange-400", label: "PPT" },
  pptx: { color: "text-orange-400", label: "PPTX" },
  txt: { color: "text-gray-400", label: "TXT" },
};

export function DocumentUploader({
  category = "POST_DOCUMENT",
  onDocumentUploaded,
  className,
}: DocumentUploaderProps) {
  return (
    <div className={className}>
      <FileUploader
        category={category}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.*,application/vnd.ms-excel,application/vnd.ms-powerpoint,text/plain"
        multiple={true}
        maxFiles={5}
        maxSizeBytes={50 * 1024 * 1024}
        onUploadComplete={onDocumentUploaded}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
            <svg className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-sm text-gray-400">
            Drag & drop documents or <span className="text-amber-400">browse</span>
          </p>
          <p className="text-xs text-gray-500">PDF, Word, Excel, PowerPoint up to 50MB</p>
        </div>
      </FileUploader>
    </div>
  );
}
