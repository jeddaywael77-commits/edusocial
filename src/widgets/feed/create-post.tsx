"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Image, FileText, Video, PenLine, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { useProfile } from "@/features/auth";
import { useCreatePost } from "@/features/posts";
import { getInitials } from "@/shared/lib/utils";

const postTypes = [
  { label: "Ask Question", icon: PenLine, color: "text-primary" },
  { label: "Share PDF", icon: FileText, color: "text-accent" },
  { label: "Upload Video", icon: Video, color: "text-secondary" },
  { label: "Photo", icon: Image, color: "text-success" },
  { label: "Ask AI", icon: Sparkles, color: "text-warning" },
];

export function CreatePost() {
  const { data: user } = useProfile();
  const createPost = useCreatePost();
  const [isExpanded, setIsExpanded] = useState(false);
  const [content, setContent] = useState("");
  const [selectedType, setSelectedType] = useState<string>("text");

  const handlePost = () => {
    if (!content.trim()) return;

    createPost.mutate(
      { content: content.trim() },
      {
        onSuccess: () => {
          setContent("");
          setIsExpanded(false);
        },
      }
    );
  };

  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={user?.avatar ?? undefined} />
            <AvatarFallback className="bg-primary/20 text-primary text-sm">
              {getInitials(user?.name || "U")}
            </AvatarFallback>
          </Avatar>
          <button
            onClick={() => setIsExpanded(true)}
            className="flex-1 text-left px-4 py-2.5 rounded-xl bg-muted text-muted-foreground text-sm hover:bg-muted/80 transition-colors cursor-pointer"
          >
            What&apos;s on your mind, {user?.name?.split(" ")[0]}?
          </button>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          {postTypes.slice(0, 4).map((type) => (
            <button
              key={type.label}
              onClick={() => {
                setSelectedType(type.label);
                setIsExpanded(true);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <type.icon className={`h-4 w-4 ${type.color}`} />
              <span className="hidden sm:inline">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Post</DialogTitle>
          </DialogHeader>

          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.avatar ?? undefined} />
              <AvatarFallback className="bg-primary/20 text-primary">
                {getInitials(user?.name || "U")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role?.toLowerCase()}</p>
            </div>
          </div>

          <Textarea
            placeholder={`What's on your mind, ${user?.name?.split(" ")[0]}?`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] bg-muted/50 border-transparent focus:border-primary resize-none text-base"
            autoFocus
          />

          <div className="flex items-center gap-2 flex-wrap">
            {postTypes.map((type) => (
              <Button
                key={type.label}
                variant={selectedType === type.label ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type.label)}
                className="gap-1.5"
              >
                <type.icon className={`h-3.5 w-3.5 ${type.color}`} />
                {type.label}
              </Button>
            ))}
          </div>

          <Button
            onClick={handlePost}
            disabled={!content.trim() || createPost.isPending}
            className="w-full"
          >
            {createPost.isPending ? "Posting..." : "Post"}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
