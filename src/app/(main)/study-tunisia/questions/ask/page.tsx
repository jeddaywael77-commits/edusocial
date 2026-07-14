"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Badge } from "@/shared/ui/badge";
import { useCreateQuestion } from "@/features/study-tunisia";

export default function AskQuestionPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const createQuestion = useCreateQuestion();

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const removeTag = (t: string) => setTags(tags.filter((tag) => tag !== t));

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    createQuestion.mutate(
      { title, content, tags },
      { onSuccess: () => router.push("/study-tunisia/questions") }
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/study-tunisia/questions" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Questions
      </Link>

      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Ask a Question</h1>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Title</label>
            <Input placeholder="What's your question?" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Details</label>
            <Textarea placeholder="Provide more context about your question..." value={content} onChange={(e) => setContent(e.target.value)} rows={6} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Tags (up to 5)</label>
            <div className="flex gap-2">
              <Input placeholder="Add a tag" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} />
              <Button variant="outline" onClick={addTag}>Add</Button>
            </div>
            {tags.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {tags.map((t) => (
                  <Badge key={t} variant="secondary" className="cursor-pointer" onClick={() => removeTag(t)}>
                    {t} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <Button onClick={handleSubmit} disabled={!title.trim() || !content.trim()} className="w-full" size="lg">
            Post Question
          </Button>
        </div>
      </div>
    </div>
  );
}
