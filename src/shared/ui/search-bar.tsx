"use client";

import * as React from "react";
import { Search, X, Loader2, Users, BookOpen, MessageSquare, ShoppingBag, FileText, GraduationCap } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useAutocomplete } from "@/api/search";
import type { AutocompleteResult } from "@/api/search";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onSelect?: (result: AutocompleteResult, index: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

const INDEX_ICONS: Record<string, React.ReactNode> = {
  users: <Users className="h-4 w-4" />,
  posts: <MessageSquare className="h-4 w-4" />,
  courses: <BookOpen className="h-4 w-4" />,
  groups: <GraduationCap className="h-4 w-4" />,
  marketplace: <ShoppingBag className="h-4 w-4" />,
  documents: <FileText className="h-4 w-4" />,
  lessons: <FileText className="h-4 w-4" />,
};

const INDEX_LABELS: Record<string, string> = {
  users: "People",
  posts: "Posts",
  courses: "Courses",
  groups: "Groups",
  marketplace: "Marketplace",
  documents: "Documents",
  lessons: "Lessons",
};

export function SearchBar({
  onSearch,
  onSelect,
  placeholder = "Search people, posts, courses...",
  className,
  autoFocus = false,
}: SearchBarProps) {
  const [query, setQuery] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [debouncedQuery, setDebouncedQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: results, isLoading } = useAutocomplete(debouncedQuery, {
    limit: 8,
  });

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch?.(query);
      setIsOpen(false);
    }
  };

  const handleSelect = (result: AutocompleteResult) => {
    const index = result.id ? "users" : "posts";
    onSelect?.(result, index);
    setQuery("");
    setIsOpen(false);
  };

  const groupedResults = React.useMemo(() => {
    if (!results?.length) return {};
    const grouped: Record<string, AutocompleteResult[]> = {};
    for (const hit of results) {
      let index = "other";
      if ("email" in hit) index = "users";
      else if ("content" in hit) index = "posts";
      else if ("teacherName" in hit) index = "courses";
      else if ("membersCount" in hit) index = "groups";
      if (!grouped[index]) grouped[index] = [];
      grouped[index].push(hit);
    }
    return grouped;
  }, [results]);

  const hasResults = results && results.length > 0;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={cn(
            "w-full h-10 pl-10 pr-10 rounded-xl",
            "bg-card border border-border",
            "text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
            "transition-all duration-200"
          )}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
        )}
        {query && !isLoading && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {isOpen && debouncedQuery && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
              <p className="text-sm">Searching...</p>
            </div>
          ) : hasResults ? (
            <div className="py-2">
              {Object.entries(groupedResults).map(([index, hits]) => (
                <div key={index}>
                  <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {INDEX_LABELS[index] || index}
                  </div>
                  {hits.map((hit) => (
                    <button
                      key={hit.id}
                      onClick={() => handleSelect(hit)}
                      className="w-full px-3 py-2 flex items-center gap-3 hover:bg-muted transition-colors text-left"
                    >
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        {INDEX_ICONS[index] || <Search className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {hit.name || hit.title || "Untitled"}
                        </p>
                        {hit.description && (
                          <p className="text-xs text-muted-foreground truncate">
                            {hit.description}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              <p className="text-sm">No results found for &quot;{debouncedQuery}&quot;</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
