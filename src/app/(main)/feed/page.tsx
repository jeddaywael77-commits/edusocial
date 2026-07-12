"use client";

import React from "react";
import { CreatePost } from "@/widgets/feed/create-post";
import { Stories } from "@/widgets/feed/stories";
import { FeedList } from "@/widgets/feed/feed-list";
import { QuickActions } from "@/widgets/feed/quick-actions";

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
