"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Search,
  Upload,
  Download,
  Eye,
  Trash2,
  Clock,
  Grid,
  List,
  Filter,
  FolderOpen,
  File,
  FileImage,
  FileVideo,
  FileCode,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Badge } from "@/shared/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { useMyDocuments } from "@/features/documents";

const fileIcons: Record<string, React.ReactNode> = {
  pdf: <FileText className="h-5 w-5 text-destructive" />,
  doc: <FileText className="h-5 w-5 text-primary" />,
  docx: <FileText className="h-5 w-5 text-primary" />,
  code: <FileCode className="h-5 w-5 text-success" />,
  ipynb: <FileCode className="h-5 w-5 text-success" />,
  presentation: <File className="h-5 w-5 text-warning" />,
  pptx: <File className="h-5 w-5 text-warning" />,
  image: <FileImage className="h-5 w-5 text-accent" />,
  png: <FileImage className="h-5 w-5 text-accent" />,
  video: <FileVideo className="h-5 w-5 text-secondary" />,
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const { data: documents = [], isLoading } = useMyDocuments();

  const filteredDocs = documents.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" />
            Documents
          </h1>
          <Button>
            <Upload className="h-4 w-4 mr-1" />
            Upload
          </Button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="icon" onClick={() => setViewMode("list")}><List className="h-4 w-4" /></Button>
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="icon" onClick={() => setViewMode("grid")}><Grid className="h-4 w-4" /></Button>
        </div>

        {isLoading ? (
          <div className="space-y-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl animate-pulse">
                <div className="w-10 h-10 rounded-lg bg-muted" />
                <div className="flex-1 space-y-1">
                  <div className="h-4 w-48 bg-muted rounded" />
                  <div className="h-3 w-32 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All ({filteredDocs.length})</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="shared">Shared with Me</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              {filteredDocs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No documents yet</p>
                </div>
              ) : viewMode === "list" ? (
                <div className="space-y-1">
                  {filteredDocs.map((doc, i) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        {fileIcons[doc.type] || <File className="h-5 w-5 text-muted-foreground" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{doc.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{formatFileSize(doc.size)}</span>
                          <span>\u2022</span>
                          <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      {doc.tags.length > 0 && (
                        <div className="flex items-center gap-1">
                          {doc.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon-sm"><Eye className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon-sm"><Download className="h-3.5 w-3.5" /></Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm"><MoreVertical className="h-3.5 w-3.5" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Share</DropdownMenuItem>
                            <DropdownMenuItem>Rename</DropdownMenuItem>
                            <DropdownMenuItem>Version History</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {filteredDocs.map((doc, i) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-4 rounded-xl bg-muted/30 border border-border hover:border-primary/30 transition-all cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-3">
                        {fileIcons[doc.type] || <File className="h-5 w-5 text-muted-foreground" />}
                      </div>
                      <p className="text-sm font-medium truncate">{doc.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatFileSize(doc.size)}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="recent" className="mt-4">
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Your recently viewed documents will appear here</p>
              </div>
            </TabsContent>

            <TabsContent value="shared" className="mt-4">
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No documents shared with you yet</p>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
