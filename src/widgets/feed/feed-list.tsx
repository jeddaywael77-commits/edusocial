"use client";

import React, { useEffect } from "react";
import { useFeedStore } from "@/stores/feed-store";
import { mockPosts } from "@/lib/mock-data";
import { PostCard } from "./post-card";
import { useInfiniteScroll } from "@/shared/hooks/use-infinite-scroll";
import { Loader2 } from "lucide-react";

export function FeedList() {
  const { posts, setPosts, isLoading, hasMore, loadMore } = useFeedStore();

  useEffect(() => {
    if (posts.length === 0) {
      setPosts(mockPosts);
    }
  }, [posts.length, setPosts]);

  const loadMorePosts = () => {
    loadMore();
  };

  const lastPostRef = useInfiniteScroll(loadMorePosts, hasMore);

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

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}
