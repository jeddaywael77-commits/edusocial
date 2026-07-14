"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { useGuide } from "@/features/study-tunisia";
import { formatDate, getInitials } from "@/shared/lib/utils";

export default function GuideDetailPage() {
  const params = useParams();
  const { data: guide, isLoading } = useGuide(params.id as string);

  if (isLoading) return <div className="max-w-3xl mx-auto"><div className="h-64 rounded-2xl bg-muted animate-pulse" /></div>;
  if (!guide) return <div className="max-w-3xl mx-auto text-center py-16"><p className="text-muted-foreground">Not found</p></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/study-tunisia/guides" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Guides
      </Link>
      <article className="rounded-2xl border border-border bg-card p-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary">{guide.category}</Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {formatDate(guide.createdAt)}</span>
        </div>
        <h1 className="text-3xl font-bold mb-4">{guide.title}</h1>
        {guide.author && (
          <div className="flex items-center gap-2 mb-6 pb-6 border-b border-border">
            <Avatar><AvatarImage src={guide.author.avatar ?? undefined} /><AvatarFallback>{getInitials(guide.author.name)}</AvatarFallback></Avatar>
            <div><p className="font-medium text-sm">{guide.author.name}</p><p className="text-xs text-muted-foreground">{guide.author.role}</p></div>
          </div>
        )}
        {guide.coverImage && <div className="mb-6 rounded-xl overflow-hidden"><img src={guide.coverImage} alt="" className="w-full h-auto" /></div>}
        {guide.summary && <p className="text-lg text-muted-foreground italic mb-6">{guide.summary}</p>}
        <div className="prose prose-invert max-w-none"><p className="whitespace-pre-wrap">{guide.content}</p></div>
      </article>
    </div>
  );
}
