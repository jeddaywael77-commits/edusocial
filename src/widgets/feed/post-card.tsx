"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  ThumbsUp,
  Send,
  FileText,
  Globe,
  Users,
  Lock,
  Pin,
  EyeOff,
  Flag,
  BookmarkCheck,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useProfile } from "@/features/auth";
import { useToggleReaction } from "@/features/reactions";
import { useSavePost } from "@/features/posts";
import { useCreateComment, useComments } from "@/features/comments";
import { formatDate, formatNumber, getInitials } from "@/shared/lib/utils";
import type { Post } from "@/shared/types";

interface PostCardProps {
  post: Post;
}

function parseContent(content: string) {
  const parts: React.ReactNode[] = [];
  const regex = /(#\w+)|(@\w+)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(content.slice(lastIndex, match.index));
    }
    if (match[1]) {
      parts.push(
        <span key={match.index} className="text-primary font-medium cursor-pointer hover:underline">
          {match[1]}
        </span>
      );
    } else if (match[2]) {
      parts.push(
        <span key={match.index} className="text-accent font-medium cursor-pointer hover:underline">
          {match[2]}
        </span>
      );
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }
  return parts;
}

const visibilityConfig: Record<string, { icon: typeof Globe; label: string; color: string }> = {
  PUBLIC: { icon: Globe, label: "Public", color: "text-success" },
  FRIENDS: { icon: Users, label: "Friends", color: "text-primary" },
  PRIVATE: { icon: Lock, label: "Private", color: "text-warning" },
};

export function PostCard({ post }: PostCardProps) {
  const { data: currentUser } = useProfile();
  const toggleReaction = useToggleReaction("POST", post.id);
  const savePost = useSavePost();
  const createComment = useCreateComment(post.id);
  const { data: commentsData } = useComments(post.id, 3);
  const comments = commentsData?.pages?.flatMap((p) => p.data) ?? [];

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const hasReacted = post.reactions && post.reactions.length > 0;
  const isSaved = post.saves && post.saves.length > 0;
  const reactionCount = post._count?.reactions ?? 0;
  const commentCount = post._count?.comments ?? 0;
  const shareCount = post._count?.shares ?? 0;

  const handleLike = () => toggleReaction.mutate("LIKE" as never);
  const handleSave = () => savePost.mutate(post.id);

  const handleComment = () => {
    if (!commentText.trim()) return;
    createComment.mutate({ content: commentText.trim() }, { onSuccess: () => setCommentText("") });
  };

  const shouldTruncate = post.content.length > 300;
  const displayContent = shouldTruncate && !isExpanded
    ? post.content.slice(0, 300)
    : post.content;

  const vis = visibilityConfig[post.visibility] ?? visibilityConfig.PUBLIC;
  const VisIcon = vis.icon;

  const imageGridClass = post.images.length === 1
    ? "grid-cols-1"
    : post.images.length === 2
      ? "grid-cols-2"
      : "grid-cols-2 grid-rows-2";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      {/* Header */}
      <div className="p-4 pb-0">
        <div className="flex items-start justify-between mb-3">
          <Link href={`/profile/${post.author.id}`} className="flex items-center gap-3 group">
            <div className="relative">
              <Avatar className="h-11 w-11 ring-2 ring-transparent group-hover:ring-primary/30 transition-all duration-300">
                <AvatarImage src={post.author.avatar ?? undefined} />
                <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">
                  {getInitials(post.author.name)}
                </AvatarFallback>
              </Avatar>
              {post.author.isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-success border-2 border-card animate-pulse" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold group-hover:text-primary transition-colors truncate">
                  {post.author.name}
                </p>
                <Badge
                  variant={post.author.role === "TEACHER" ? "secondary" : "outline"}
                  className={`text-[10px] px-1.5 py-0 shrink-0 ${
                    post.author.role === "TEACHER"
                      ? "bg-primary/10 text-primary border-primary/20"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {post.author.role === "TEACHER" ? "Teacher" : "Student"}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</span>
                <span className="text-muted-foreground">·</span>
                <VisIcon className={`h-3 w-3 ${vis.color}`} />
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-1">
            {post.isPinned && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 gap-1 bg-warning/10 text-warning border-warning/20">
                <Pin className="h-2.5 w-2.5" />
                Pinned
              </Badge>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-primary">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleSave}>
                  <BookmarkCheck className="h-4 w-4 mr-2" />
                  {isSaved ? "Unsave Post" : "Save Post"}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hide Post
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Flag className="h-4 w-4 mr-2" />
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Post type indicator */}
        {post.type !== "TEXT" && (
          <div className="mb-3 px-3 py-2 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">
              {post.type}
            </span>
          </div>
        )}

        {/* Content */}
        <div className="mb-3">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {parseContent(displayContent)}
            {shouldTruncate && !isExpanded && "..."}
          </p>
          {shouldTruncate && !isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="text-sm text-primary font-medium hover:underline mt-1 transition-colors"
            >
              See more
            </button>
          )}
          {shouldTruncate && isExpanded && (
            <button
              onClick={() => setIsExpanded(false)}
              className="text-sm text-muted-foreground hover:text-primary mt-1 transition-colors"
            >
              See less
            </button>
          )}
        </div>
      </div>

      {/* Image gallery */}
      {post.images.length > 0 && (
        <div className={`px-4 mb-3 grid gap-1 ${imageGridClass}`}>
          {post.images.map((img, i) => (
            <div key={i} className="relative overflow-hidden rounded-xl aspect-[16/10]">
              <img
                src={img}
                alt={`Post image ${i + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      )}

      {/* PDF preview */}
      {post.pdfUrl && (
        <div className="px-4 mb-3">
          <a
            href={post.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 group"
          >
            <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5 text-destructive" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                {post.pdfName ?? "Document"}
              </p>
              <p className="text-xs text-muted-foreground">PDF Document</p>
            </div>
          </a>
        </div>
      )}

      {/* Stats row */}
      {(reactionCount > 0 || commentCount > 0 || shareCount > 0) && (
        <div className="px-4 py-2 flex items-center justify-between text-xs text-muted-foreground border-t border-border">
          <div className="flex items-center gap-1.5">
            {reactionCount > 0 && (
              <>
                <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                  <ThumbsUp className="h-2.5 w-2.5 text-white fill-white" />
                </div>
                <span className="font-medium">{formatNumber(reactionCount)}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            {commentCount > 0 && (
              <button
                onClick={() => setShowComments((p) => !p)}
                className="hover:underline cursor-pointer font-medium"
              >
                {formatNumber(commentCount)} comment{commentCount !== 1 && "s"}
              </button>
            )}
            {shareCount > 0 && (
              <span>{formatNumber(shareCount)} share{shareCount !== 1 && "s"}</span>
            )}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="px-2 py-1 flex items-center border-t border-border">
        <Button
          variant="ghost"
          className={`flex-1 gap-2 h-9 text-sm font-medium ${hasReacted ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
          onClick={handleLike}
          disabled={toggleReaction.isPending}
        >
          <motion.div
            animate={hasReacted ? { scale: [1, 1.4, 1] } : { scale: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ThumbsUp className={`h-4 w-4 ${hasReacted ? "fill-primary" : ""}`} />
          </motion.div>
          Like
        </Button>
        <Button
          variant="ghost"
          className="flex-1 gap-2 h-9 text-sm font-medium text-muted-foreground hover:text-primary"
          onClick={() => setShowComments((p) => !p)}
        >
          <MessageCircle className="h-4 w-4" />
          Comment
        </Button>
        <Button
          variant="ghost"
          className="flex-1 gap-2 h-9 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className={`h-9 w-9 ${isSaved ? "text-warning" : "text-muted-foreground hover:text-warning"}`}
          onClick={handleSave}
          disabled={savePost.isPending}
        >
          <motion.div
            animate={isSaved ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ duration: 0.25 }}
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? "fill-warning" : ""}`} />
          </motion.div>
        </Button>
      </div>

      {/* Comments section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="border-t border-border overflow-hidden"
          >
            <div className="p-4 space-y-3">
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-2.5"
                >
                  <Avatar className="h-8 w-8 shrink-0 mt-0.5">
                    <AvatarImage src={comment.author.avatar ?? undefined} />
                    <AvatarFallback className="text-xs bg-muted font-medium">
                      {getInitials(comment.author.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="bg-muted/70 rounded-2xl rounded-tl-md px-3 py-2">
                      <p className="text-xs font-semibold text-primary">{comment.author.name}</p>
                      <p className="text-sm leading-relaxed mt-0.5">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-1 px-1">
                      <button className="text-xs text-muted-foreground hover:text-primary font-medium transition-colors">
                        Like
                      </button>
                      <button className="text-xs text-muted-foreground hover:text-primary font-medium transition-colors">
                        Reply
                      </button>
                      <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Comment input */}
              <div className="flex items-center gap-2.5 pt-1">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={currentUser?.avatar ?? undefined} />
                  <AvatarFallback className="text-xs bg-primary/20 text-primary font-medium">
                    {getInitials(currentUser?.name || "U")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 flex items-center gap-2 bg-muted rounded-full px-4 py-2">
                  <input
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleComment()}
                    className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground"
                  />
                  <Button
                    size="icon-sm"
                    onClick={handleComment}
                    disabled={!commentText.trim() || createComment.isPending}
                    className="shrink-0 h-7 w-7 rounded-full"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
