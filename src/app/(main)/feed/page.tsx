"use client";

import React from "react";
import { motion } from "framer-motion";
import { CreatePost } from "@/widgets/feed/create-post";
import { Stories } from "@/widgets/feed/stories";
import { FeedList } from "@/widgets/feed/feed-list";

export default function FeedPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <Stories />
      <CreatePost />
      <FeedList />
    </motion.div>
  );
}
