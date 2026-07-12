"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { useAuthStore } from "@/stores/auth-store";
import { mockStories } from "@/lib/mock-data";
import { getInitials } from "@/lib/utils";

export function Stories() {
  const { user } = useAuthStore();

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="shrink-0"
      >
        <div className="w-24 h-40 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-all group">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Plus className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xs text-muted-foreground text-center px-1">Create Story</span>
        </div>
      </motion.div>

      {mockStories.slice(0, 6).map((story, i) => (
        <motion.div
          key={story.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          className="shrink-0"
        >
          <div className="w-24 h-40 rounded-2xl overflow-hidden relative cursor-pointer group">
            <div className="absolute inset-0 gradient-primary opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute top-3 left-3">
              <div className="relative">
                <Avatar className="h-8 w-8 ring-2 ring-primary">
                  <AvatarImage src={story.author.avatar} />
                  <AvatarFallback className="text-xs bg-white/20 text-white">
                    {getInitials(story.author.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            <div className="absolute bottom-3 left-3 right-3">
              <p className="text-xs text-white font-medium line-clamp-2">
                {story.text || story.author.name}
              </p>
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
