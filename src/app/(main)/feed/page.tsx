"use client";

import React from "react";
import { CreatePost } from "@/components/feed/create-post";
import { Stories } from "@/components/feed/stories";
import { FeedList } from "@/components/feed/feed-list";
import { QuickActions } from "@/components/feed/quick-actions";

export default function FeedPage() {
  return (
    <div className="space-y-4">
      <Stories />
      <QuickActions />
      <CreatePost />
      <FeedList />
    </div>
  );
}
