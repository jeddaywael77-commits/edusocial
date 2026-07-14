"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HelpCircle, ArrowLeft, Search, Plus, Eye } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Badge } from "@/shared/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { useQuestions } from "@/features/study-tunisia";
import { formatDate, getInitials } from "@/shared/lib/utils";

export default function QuestionsPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useQuestions({ search: search || undefined });
  const questions = data?.data || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/study-tunisia" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Study Tunisia
      </Link>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HelpCircle className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Questions & Answers</h1>
        </div>
        <Link href="/study-tunisia/questions/ask">
          <Button><Plus className="h-4 w-4 mr-1" /> Ask Question</Button>
        </Link>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search questions..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>
      {isLoading ? (
        <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-28 rounded-2xl bg-muted animate-pulse" />)}</div>
      ) : questions.length === 0 ? (
        <div className="text-center py-16"><HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">No questions yet</p></div>
      ) : (
        <div className="space-y-3">
          {questions.map((q, i) => (
            <motion.div key={q.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={`/study-tunisia/questions/${q.id}`}>
                <div className="rounded-2xl border border-border bg-card p-5 hover:border-primary/30 transition-all cursor-pointer group">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-1 text-center shrink-0">
                      <div className="text-lg font-bold">{q._count?.answers || 0}</div>
                      <div className="text-[10px] text-muted-foreground">answers</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">{q.title}</h3>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        {q.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Avatar className="h-4 w-4"><AvatarImage src={q.author?.avatar ?? undefined} /><AvatarFallback className="text-[7px]">{getInitials(q.author?.name || "U")}</AvatarFallback></Avatar>
                          {q.author?.name}
                        </div>
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {q.viewCount}</span>
                        <span>{formatDate(q.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
