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
  Clock,
  CheckCircle2,
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

  const handleLike = () => {
    toggleReaction.mutate("LIKE" as never);
  };

  const handleSave = () => {
    savePost.mutate(post.id);
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    createComment.mutate(
      { content: commentText.trim() },
      {
        onSuccess: () => setCommentText(""),
      }
    );
  };

  const shouldTruncate = post.content.length > 300;
  const displayContent =
    shouldTruncate && !isExpanded
      ? post.content.slice(0, 300) + "..."
      : post.content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card overflow-hidden"
    >
      <div className="p-4 pb-0">
        <div className="flex items-start justify-between mb-3">
          <Link
            href={`/profile/${post.author.id}`}
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.author.avatar ?? undefined} />
                <AvatarFallback className="bg-primary/20 text-primary text-sm">
                  {getInitials(post.author.name)}
                </AvatarFallback>
              </Avatar>
              {post.author.isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-success border-2 border-card" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold group-hover:text-primary transition-colors">
                  {post.author.name}
                </p>
                {post.author.role === "TEACHER" && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0"
                  >
                    Teacher
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatDate(post.createdAt)}
              </p>
            </div>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>Save Post</DropdownMenuItem>
              <DropdownMenuItem>Hide Post</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Report</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {post.type === "ASSIGNMENT" && (
          <div className="mb-3 p-3 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Assignment</span>
            </div>
          </div>
        )}

        <div className="mb-3">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {displayContent}
          </p>
          {shouldTruncate && !isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="text-sm text-primary hover:underline mt-1"
            >
              See more
            </button>
          )}
        </div>
      </div>

      {(reactionCount > 0 || commentCount > 0 || shareCount > 0) && (
        <div className="px-4 py-2 flex items-center justify-between text-xs text-muted-foreground border-t border-border">
          <div className="flex items-center gap-1">
            {reactionCount > 0 && (
              <>
                <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                  <ThumbsUp className="h-2.5 w-2.5 text-white" />
                </div>
                <span>{formatNumber(reactionCount)}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            {commentCount > 0 && (
              <button
                onClick={() => setShowComments(!showComments)}
                className="hover:underline cursor-pointer"
              >
                {commentCount} comments
              </button>
            )}
            {shareCount > 0 && <span>{shareCount} shares</span>}
          </div>
        </div>
      )}

      <div className="px-4 py-1 flex items-center border-t border-border">
        <Button
          variant="ghost"
          className={`flex-1 gap-2 ${hasReacted ? "text-primary" : ""}`}
          onClick={handleLike}
          disabled={toggleReaction.isPending}
        >
          <motion.div
            animate={hasReacted ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Heart
              className={`h-4 w-4 ${hasReacted ? "fill-primary" : ""}`}
            />
          </motion.div>
          Like
        </Button>
        <Button
          variant="ghost"
          className="flex-1 gap-2"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle className="h-4 w-4" />
          Comment
        </Button>
        <Button variant="ghost" className="flex-1 gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={isSaved ? "text-warning" : ""}
          onClick={handleSave}
          disabled={savePost.isPending}
        >
          <Bookmark
            className={`h-4 w-4 ${isSaved ? "fill-warning" : ""}`}
          />
        </Button>
      </div>

      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border overflow-hidden"
          >
            <div className="p-4 space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-2">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={comment.author.avatar ?? undefined} />
                    <AvatarFallback className="text-xs bg-muted">
                      {getInitials(comment.author.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-muted rounded-xl px-3 py-2">
                      <p className="text-xs font-medium">
                        {comment.author.name}
                      </p>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-1 px-1">
                      <button className="text-xs text-muted-foreground hover:text-primary">
                        Like
                      </button>
                      <button className="text-xs text-muted-foreground hover:text-primary">
                        Reply
                      </button>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={currentUser?.avatar ?? undefined} />
                  <AvatarFallback className="text-xs bg-primary/20 text-primary">
                    {getInitials(currentUser?.name || "U")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 flex items-center gap-2">
                  <input
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleComment()}
                    className="flex-1 bg-muted rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary border-transparent"
                  />
                  <Button
                    size="icon-sm"
                    onClick={handleComment}
                    disabled={!commentText.trim() || createComment.isPending}
                    className="shrink-0"
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
