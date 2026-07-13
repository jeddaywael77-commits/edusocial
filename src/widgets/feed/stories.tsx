"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { useStories } from "@/features/stories";
import { getInitials } from "@/shared/lib/utils";

const gradients = [
  "gradient-primary",
  "gradient-accent",
  "bg-gradient-to-br from-violet-500 to-fuchsia-500",
  "bg-gradient-to-br from-amber-500 to-rose-500",
  "bg-gradient-to-br from-cyan-500 to-blue-500",
  "bg-gradient-to-br from-emerald-500 to-teal-500",
];

export function Stories() {
  const { data: stories, isLoading } = useStories();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState(false);

  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -220 : 220,
      behavior: "smooth",
    });
  };

  const visibleStories = stories?.slice(0, 8);

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      {showArrows && (
        <>
          <button
            onClick={() => scroll("left")}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4 text-foreground" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors"
          >
            <ChevronRight className="h-4 w-4 text-foreground" />
          </button>
        </>
      )}

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-none snap-x snap-mandatory py-2 px-1"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="shrink-0 snap-start"
        >
          <div className="w-[100px] h-[160px] rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2.5 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/25 group-hover:scale-110 transition-transform duration-200">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <span className="text-xs text-muted-foreground font-medium text-center px-2">
              Create Story
            </span>
          </div>
        </motion.div>

        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="shrink-0 snap-start">
              <div className="w-[100px] h-[160px] rounded-2xl bg-muted overflow-hidden relative">
                <div className="absolute inset-0 skeleton-shimmer" />
              </div>
            </div>
          ))}

        {!isLoading &&
          visibleStories?.map((story, i) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 16, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: i * 0.06,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="shrink-0 snap-start"
            >
              <div className="w-[100px] h-[160px] rounded-2xl overflow-hidden relative cursor-pointer group">
                <div
                  className={`absolute inset-0 ${gradients[i % gradients.length]} opacity-80 group-hover:opacity-90 group-hover:scale-105 group-hover:brightness-110 transition-all duration-300`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <div className="absolute top-2.5 left-2.5">
                  <Avatar
                    className="h-9 w-9 ring-[2.5px] ring-primary ring-offset-1 ring-offset-transparent"
                  >
                    <AvatarImage src={story.author.avatar ?? undefined} />
                    <AvatarFallback className="text-[10px] bg-white/20 text-white font-semibold">
                      {getInitials(story.author.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <p className="text-[11px] text-white font-medium line-clamp-2 leading-tight drop-shadow-sm">
                    {story.text || story.author.name}
                  </p>
                </div>

                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-200" />
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  );
}
