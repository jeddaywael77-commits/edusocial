"use client";

import * as React from "react";
import { Users, BookOpen, MessageSquare, ShoppingBag, FileText, GraduationCap, Search, ArrowRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { SearchResult } from "@/api/search";

interface SearchResultsProps {
  results: SearchResult;
  onSelect?: (item: any, index: string) => void;
  className?: string;
}

const INDEX_CONFIG: Record<string, {
  icon: React.ReactNode;
  label: string;
  color: string;
  getName: (hit: any) => string;
  getDescription: (hit: any) => string;
}> = {
  users: {
    icon: <Users className="h-5 w-5" />,
    label: "People",
    color: "text-blue-400 bg-blue-400/10",
    getName: (hit) => hit.name || "Unknown",
    getDescription: (hit) => hit.bio || hit.email || "",
  },
  posts: {
    icon: <MessageSquare className="h-5 w-5" />,
    label: "Posts",
    color: "text-purple-400 bg-purple-400/10",
    getName: (hit: any) => hit.authorName || "Unknown",
    getDescription: (hit: any) => hit.content?.slice(0, 100) || "",
  },
  courses: {
    icon: <BookOpen className="h-5 w-5" />,
    label: "Courses",
    color: "text-green-400 bg-green-400/10",
    getName: (hit) => hit.title || "Untitled",
    getDescription: (hit) => hit.description?.slice(0, 100) || "",
  },
  groups: {
    icon: <GraduationCap className="h-5 w-5" />,
    label: "Groups",
    color: "text-orange-400 bg-orange-400/10",
    getName: (hit) => hit.name || "Unknown",
    getDescription: (hit) => hit.description?.slice(0, 100) || "",
  },
  marketplace: {
    icon: <ShoppingBag className="h-5 w-5" />,
    label: "Marketplace",
    color: "text-pink-400 bg-pink-400/10",
    getName: (hit) => hit.title || "Untitled",
    getDescription: (hit) => hit.description?.slice(0, 100) || "",
  },
  documents: {
    icon: <FileText className="h-5 w-5" />,
    label: "Documents",
    color: "text-cyan-400 bg-cyan-400/10",
    getName: (hit) => hit.name || "Untitled",
    getDescription: (hit) => hit.description?.slice(0, 100) || "",
  },
  lessons: {
    icon: <FileText className="h-5 w-5" />,
    label: "Lessons",
    color: "text-yellow-400 bg-yellow-400/10",
    getName: (hit) => hit.title || "Untitled",
    getDescription: (hit) => hit.content?.slice(0, 100) || "",
  },
};

export function SearchResults({ results, onSelect, className }: SearchResultsProps) {
  const indexEntries = Object.entries(results).filter(([, data]) => data.hits.length > 0);

  if (indexEntries.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
        <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-1">No results found</h3>
        <p className="text-sm text-muted-foreground">Try adjusting your search terms</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {indexEntries.map(([indexName, data]) => {
        const config = INDEX_CONFIG[indexName] || {
          icon: <Search className="h-5 w-5" />,
          label: indexName,
          color: "text-gray-400 bg-gray-400/10",
          getName: (h: any) => h.name || h.title || "Unknown",
          getDescription: (h: any) => h.description || "",
        };

        return (
          <div key={indexName}>
            <div className="flex items-center gap-2 mb-3">
              <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center", config.color)}>
                {config.icon}
              </div>
              <h3 className="text-sm font-semibold text-foreground">{config.label}</h3>
              <span className="text-xs text-muted-foreground">({data.totalHits})</span>
            </div>

            <div className="space-y-2">
              {data.hits.map((hit: any) => (
                <button
                  key={hit.id}
                  onClick={() => onSelect?.(hit, indexName)}
                  className="w-full p-3 rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-muted/50 transition-all duration-200 text-left group"
                >
                  <div className="flex items-start gap-3">
                    <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0", config.color)}>
                      {config.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {config.getName(hit)}
                      </p>
                      {config.getDescription(hit) && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {config.getDescription(hit)}
                        </p>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
