"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Heart, MessageSquare, Eye, Clock } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Badge } from "@/shared/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { useNewsArticle, useToggleNewsLike, useAddNewsComment, useNewsComments } from "@/features/news";
import { formatDate, formatNumber, getInitials } from "@/shared/lib/utils";

export default function NewsDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [comment, setComment] = useState("");

  const { data: article, isLoading } = useNewsArticle(id);
  const { data: comments } = useNewsComments(id);
  const toggleLike = useToggleNewsLike();
  const addComment = useAddNewsComment();

  if (isLoading) {
    return <div className="max-w-3xl mx-auto space-y-6"><div className="h-96 rounded-2xl bg-muted animate-pulse" /></div>;
  }

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <p className="text-muted-foreground">Article not found</p>
        <Link href="/news"><Button variant="ghost" className="mt-4">Back to News</Button></Link>
      </div>
    );
  }

  const handleComment = () => {
    if (!comment.trim()) return;
    addComment.mutate({ id, content: comment });
    setComment("");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/news" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to News
      </Link>

      <article className="rounded-2xl border border-border bg-card p-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary">{article.category}</Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(article.createdAt)}
          </span>
        </div>

        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>

        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
          <Avatar>
            <AvatarImage src={article.author?.avatar ?? undefined} />
            <AvatarFallback>{getInitials(article.author?.name || "U")}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{article.author?.name}</p>
            <p className="text-xs text-muted-foreground">{article.author?.role}</p>
          </div>
        </div>

        {article.coverImage && (
          <div className="mb-6 rounded-xl overflow-hidden">
            <img src={article.coverImage} alt="" className="w-full h-auto" />
          </div>
        )}

        {article.summary && (
          <p className="text-lg text-muted-foreground mb-6 italic">{article.summary}</p>
        )}

        <div className="prose prose-invert max-w-none">
          <p className="whitespace-pre-wrap">{article.content}</p>
        </div>

        <div className="flex items-center gap-4 mt-8 pt-6 border-t border-border">
          <button
            onClick={() => toggleLike.mutate(id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              article.isLiked ? "bg-red-500/10 text-red-500" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <Heart className={`h-4 w-4 ${article.isLiked ? "fill-current" : ""}`} />
            {formatNumber(article._count?.likes || 0)}
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-muted text-muted-foreground">
            <MessageSquare className="h-4 w-4" />
            {article._count?.comments || 0}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-muted text-muted-foreground">
            <Eye className="h-4 w-4" />
            {formatNumber(article.viewCount)}
          </div>
        </div>
      </article>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Comments</h2>

        <div className="flex gap-3 mb-6">
          <Input
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleComment()}
          />
          <Button onClick={handleComment} disabled={!comment.trim()}>Post</Button>
        </div>

        <div className="space-y-4">
          {comments?.map((c) => (
            <div key={c.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={c.author?.avatar ?? undefined} />
                <AvatarFallback className="text-[10px]">{getInitials(c.author?.name || "U")}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{c.author?.name}</span>
                  <span className="text-[10px] text-muted-foreground">{formatDate(c.createdAt)}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{c.content}</p>
              </div>
            </div>
          ))}
          {(!comments || comments.length === 0) && (
            <p className="text-sm text-muted-foreground text-center py-4">No comments yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
