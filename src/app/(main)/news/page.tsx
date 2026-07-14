"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Newspaper, Search, Clock, Eye, Heart, MessageSquare, Filter } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Badge } from "@/shared/ui/badge";
import { useNewsArticles } from "@/features/news";
import { formatNumber, getInitials } from "@/shared/lib/utils";
import { formatDate } from "@/shared/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";

const CATEGORIES = ["all", "general", "announcement", "academic", "event", "tip", "campus", "technology", "sports"];

export default function NewsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const { data, isLoading } = useNewsArticles({
    search: search || undefined,
    category: category === "all" ? undefined : category,
  });

  const articles = data?.data || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
          <Newspaper className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">News</h1>
          <p className="text-sm text-muted-foreground">Latest articles and announcements</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
              category === cat
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-16">
          <Newspaper className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No articles found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/news/${article.id}`}>
                <div className="rounded-2xl border border-border bg-card p-6 hover:border-primary/30 transition-all cursor-pointer group">
                  <div className="flex items-start gap-4">
                    {article.coverImage && (
                      <div className="w-32 h-24 rounded-xl bg-muted overflow-hidden shrink-0">
                        <img src={article.coverImage} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-[10px]">
                          {article.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(article.createdAt)}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-1">
                        {article.title}
                      </h3>
                      {article.summary && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {article.summary}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1.5">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={article.author?.avatar ?? undefined} />
                            <AvatarFallback className="text-[8px]">
                              {getInitials(article.author?.name || "U")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">{article.author?.name}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Eye className="h-3 w-3" />
                          {formatNumber(article.viewCount)}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Heart className="h-3 w-3" />
                          {article._count?.likes || 0}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MessageSquare className="h-3 w-3" />
                          {article._count?.comments || 0}
                        </div>
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
