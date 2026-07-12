"use client";

import React from "react";
import { useFeed } from "@/features/posts";
import { PostCard } from "./post-card";
import { useInfiniteScroll } from "@/shared/hooks/use-infinite-scroll";
import { Loader2 } from "lucide-react";

export function FeedList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } = useFeed();
  const posts = data?.pages?.flatMap((page) => page.data) ?? [];

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const lastPostRef = useInfiniteScroll(loadMore, hasNextPage ?? false);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-4 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-muted" />
              <div className="space-y-2">
                <div className="h-3 w-24 rounded bg-muted" />
                <div className="h-2 w-16 rounded bg-muted" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-muted" />
              <div className="h-3 w-3/4 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground mb-2">Failed to load feed</p>
        <p className="text-xs text-muted-foreground">{error?.message || "Something went wrong"}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">No posts yet</p>
        <p className="text-xs text-muted-foreground mt-1">Be the first to share something!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post, i) => (
        <div
          key={post.id}
          ref={i === posts.length - 1 ? lastPostRef : undefined}
        >
          <PostCard post={post} />
        </div>
      ))}

      {isFetchingNextPage && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}
