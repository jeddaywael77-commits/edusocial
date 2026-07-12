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
import { Textarea } from "@/shared/ui/textarea";
import { Badge } from "@/shared/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useFeedStore } from "@/stores/feed-store";
import { useAuthStore } from "@/stores/auth-store";
import { formatDate, formatNumber, getInitials } from "@/lib/utils";
import { Post } from "@/types";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { toggleLike, toggleSave, addComment } = useFeedStore();
  const { user } = useAuthStore();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLike = () => {
    toggleLike(post.id);
  };

  const handleSave = () => {
    toggleSave(post.id);
  };

  const handleComment = () => {
    if (!commentText.trim() || !user) return;
    addComment(post.id, {
      id: Date.now().toString(),
      author: user,
      content: commentText.trim(),
      likes: 0,
      isLiked: false,
      replies: [],
      createdAt: new Date().toISOString(),
    });
    setCommentText("");
  };

  const shouldTruncate = post.content.length > 300;
  const displayContent = shouldTruncate && !isExpanded
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
          <Link href={`/profile/${post.author.id}`} className="flex items-center gap-3 group">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.author.avatar} />
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
                {post.author.role === "teacher" && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
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

        {post.type === "assignment" && post.assignment && (
          <div className="mb-3 p-3 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{post.assignment.title}</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Due: {post.assignment.dueDate}
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Max: {post.assignment.maxScore} pts
              </div>
            </div>
          </div>
        )}

        <div className="mb-3">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{displayContent}</p>
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

      {(post.likes > 0 || post.commentsCount > 0 || post.shares > 0) && (
        <div className="px-4 py-2 flex items-center justify-between text-xs text-muted-foreground border-t border-border">
          <div className="flex items-center gap-1">
            {post.likes > 0 && (
              <>
                <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                  <ThumbsUp className="h-2.5 w-2.5 text-white" />
                </div>
                <span>{formatNumber(post.likes)}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            {post.commentsCount > 0 && (
              <button
                onClick={() => setShowComments(!showComments)}
                className="hover:underline cursor-pointer"
              >
                {post.commentsCount} comments
              </button>
            )}
            {post.shares > 0 && (
              <span>{post.shares} shares</span>
            )}
          </div>
        </div>
      )}

      <div className="px-4 py-1 flex items-center border-t border-border">
        <Button
          variant="ghost"
          className={`flex-1 gap-2 ${post.isLiked ? "text-primary" : ""}`}
          onClick={handleLike}
        >
          <motion.div
            animate={post.isLiked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Heart className={`h-4 w-4 ${post.isLiked ? "fill-primary" : ""}`} />
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
          className={post.isSaved ? "text-warning" : ""}
          onClick={handleSave}
        >
          <Bookmark className={`h-4 w-4 ${post.isSaved ? "fill-warning" : ""}`} />
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
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex gap-2">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={comment.author.avatar} />
                    <AvatarFallback className="text-xs bg-muted">
                      {getInitials(comment.author.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-muted rounded-xl px-3 py-2">
                      <p className="text-xs font-medium">{comment.author.name}</p>
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
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="text-xs bg-primary/20 text-primary">
                    {getInitials(user?.name || "U")}
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
                    disabled={!commentText.trim()}
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
