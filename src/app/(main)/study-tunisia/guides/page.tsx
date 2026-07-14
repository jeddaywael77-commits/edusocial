"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Search, ArrowLeft, Clock } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Badge } from "@/shared/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { useGuides } from "@/features/study-tunisia";
import { formatDate, getInitials } from "@/shared/lib/utils";

export default function GuidesPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useGuides({ search: search || undefined });
  const guides = data?.data || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/study-tunisia" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Study Tunisia
      </Link>
      <div className="flex items-center gap-3">
        <FileText className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Study Guides</h1>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search guides..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>
      {isLoading ? (
        <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-32 rounded-2xl bg-muted animate-pulse" />)}</div>
      ) : guides.length === 0 ? (
        <div className="text-center py-16"><FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">No guides found</p></div>
      ) : (
        <div className="space-y-4">
          {guides.map((g, i) => (
            <motion.div key={g.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={`/study-tunisia/guides/${g.id}`}>
                <div className="rounded-2xl border border-border bg-card p-5 hover:border-primary/30 transition-all cursor-pointer group">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-[10px]">{g.category}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {formatDate(g.createdAt)}</span>
                  </div>
                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{g.title}</h3>
                  {g.summary && <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{g.summary}</p>}
                  {g.author && (
                    <div className="flex items-center gap-2 mt-3">
                      <Avatar className="h-5 w-5"><AvatarImage src={g.author.avatar ?? undefined} /><AvatarFallback className="text-[8px]">{getInitials(g.author.name)}</AvatarFallback></Avatar>
                      <span className="text-xs text-muted-foreground">{g.author.name}</span>
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
