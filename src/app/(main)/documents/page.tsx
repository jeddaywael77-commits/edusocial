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
  Tag,
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

const mockDocuments = [
  { id: "d1", name: "Calculus III - Lecture Notes.pdf", type: "pdf", size: "2.4 MB", tags: ["math", "calculus"], uploadedAt: "2024-03-10", version: 3 },
  { id: "d2", name: "Physics Lab Report.docx", type: "doc", size: "1.8 MB", tags: ["physics", "lab"], uploadedAt: "2024-03-08", version: 1 },
  { id: "d3", name: "Python Tutorial.ipynb", type: "code", size: "856 KB", tags: ["programming", "python"], uploadedAt: "2024-03-05", version: 2 },
  { id: "d4", name: "AI Workshop Presentation.pptx", type: "presentation", size: "15.2 MB", tags: ["ai", "presentation"], uploadedAt: "2024-03-01", version: 1 },
  { id: "d5", name: "Linear Algebra Formula Sheet.pdf", type: "pdf", size: "520 KB", tags: ["math", "algebra"], uploadedAt: "2024-02-28", version: 1 },
  { id: "d6", name: "Database Design Diagram.png", type: "image", size: "3.1 MB", tags: ["databases", "diagram"], uploadedAt: "2024-02-25", version: 1 },
];

const fileIcons: Record<string, React.ReactNode> = {
  pdf: <FileText className="h-5 w-5 text-destructive" />,
  doc: <FileText className="h-5 w-5 text-primary" />,
  code: <FileCode className="h-5 w-5 text-success" />,
  presentation: <File className="h-5 w-5 text-warning" />,
  image: <FileImage className="h-5 w-5 text-accent" />,
  video: <FileVideo className="h-5 w-5 text-secondary" />,
};

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

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

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All ({mockDocuments.length})</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="shared">Shared with Me</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            {viewMode === "list" ? (
              <div className="space-y-1">
                {mockDocuments
                  .filter((d) => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((doc, i) => (
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
                        <span>{doc.size}</span>
                        <span>•</span>
                        <span>v{doc.version}</span>
                        <span>•</span>
                        <span>{doc.uploadedAt}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {doc.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>
                      ))}
                    </div>
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
                {mockDocuments
                  .filter((d) => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((doc, i) => (
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
                    <p className="text-xs text-muted-foreground mt-1">{doc.size} • v{doc.version}</p>
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
      </div>
    </div>
  );
}
