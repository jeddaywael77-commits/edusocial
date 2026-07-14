"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, Clock, CheckCircle, MessageSquare } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Badge } from "@/shared/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { useQuestion, useCreateAnswer, useAcceptAnswer } from "@/features/study-tunisia";
import { formatDate, getInitials } from "@/shared/lib/utils";

export default function QuestionDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [answer, setAnswer] = useState("");

  const { data: question, isLoading } = useQuestion(id);
  const createAnswer = useCreateAnswer();
  const acceptAnswer = useAcceptAnswer();

  if (isLoading) return <div className="max-w-3xl mx-auto"><div className="h-64 rounded-2xl bg-muted animate-pulse" /></div>;
  if (!question) return <div className="max-w-3xl mx-auto text-center py-16"><p className="text-muted-foreground">Not found</p></div>;

  const handleSubmit = () => {
    if (!answer.trim()) return;
    createAnswer.mutate({ questionId: id, content: answer });
    setAnswer("");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/study-tunisia/questions" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Questions
      </Link>

      <div className="rounded-2xl border border-border bg-card p-8">
        <h1 className="text-2xl font-bold mb-3">{question.title}</h1>
        <div className="flex items-center gap-3 mb-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Avatar className="h-5 w-5"><AvatarImage src={question.author?.avatar ?? undefined} /><AvatarFallback className="text-[8px]">{getInitials(question.author?.name || "U")}</AvatarFallback></Avatar>
            {question.author?.name}
          </div>
          <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {question.viewCount} views</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatDate(question.createdAt)}</span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          {question.tags.map((tag) => <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>)}
        </div>
        <div className="prose prose-invert max-w-none"><p className="whitespace-pre-wrap">{question.content}</p></div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5" /> {question.answers?.length || 0} Answers
        </h2>
        <div className="space-y-4 mb-6">
          {question.answers?.map((a) => (
            <div key={a.id} className={`p-4 rounded-xl ${a.isAccepted ? "bg-green-500/10 border border-green-500/20" : "bg-muted/50"}`}>
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="h-6 w-6"><AvatarImage src={a.author?.avatar ?? undefined} /><AvatarFallback className="text-[8px]">{getInitials(a.author?.name || "U")}</AvatarFallback></Avatar>
                <span className="text-sm font-medium">{a.author?.name}</span>
                <span className="text-[10px] text-muted-foreground">{formatDate(a.createdAt)}</span>
                {a.isAccepted && <Badge variant="success" className="text-[10px]"><CheckCircle className="h-3 w-3 mr-1" /> Accepted</Badge>}
              </div>
              <p className="text-sm whitespace-pre-wrap">{a.content}</p>
              {!a.isAccepted && question.authorId === a.authorId && (
                <Button variant="ghost" size="sm" className="mt-2 text-xs" onClick={() => acceptAnswer.mutate(a.id)}>
                  <CheckCircle className="h-3.5 w-3.5 mr-1" /> Accept Answer
                </Button>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <Input placeholder="Write your answer..." value={answer} onChange={(e) => setAnswer(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
          <Button onClick={handleSubmit} disabled={!answer.trim()}>Post</Button>
        </div>
      </div>
    </div>
  );
}
