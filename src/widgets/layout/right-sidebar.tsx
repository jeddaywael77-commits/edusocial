"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  Bot,
  Calendar,
  Trophy,
  Flame,
  ChevronRight,
  Circle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { useLeaderboardXp } from "@/features/leaderboard";
import { useOnlineUsers } from "@/features/users";
import { useCalendarEvents } from "@/features/calendar";
import { formatNumber, getInitials, formatDate } from "@/shared/lib/utils";

const mockTrending = [
  { id: "1", title: "Calculus III", category: "Math", postsCount: 128 },
  { id: "2", title: "Machine Learning", category: "CS", postsCount: 95 },
  { id: "3", title: "Quantum Physics", category: "Physics", postsCount: 72 },
  { id: "4", title: "Web Development", category: "CS", postsCount: 64 },
];

export function RightSidebar() {
  const { data: leaderboard } = useLeaderboardXp(5);
  const { data: onlineUsers } = useOnlineUsers();
  const { data: events } = useCalendarEvents();

  const onlineList = onlineUsers?.filter((u) => u.isOnline).slice(0, 8) ?? [];
  const onlineCount = onlineUsers?.filter((u) => u.isOnline).length ?? 0;
  const upcomingEvents = events?.slice(0, 3) ?? [];

  return (
    <aside className="hidden xl:block w-80 shrink-0">
      <div className="sticky top-16 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto pb-4 pl-2">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Trending</span>
            </div>
          </div>
          <div className="space-y-2">
            {mockTrending.map((topic, i) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-muted cursor-pointer transition-colors"
              >
                <div>
                  <p className="text-sm font-medium line-clamp-1">{topic.title}</p>
                  <p className="text-xs text-muted-foreground">{topic.postsCount} posts</p>
                </div>
                <Badge variant="outline" className="text-[10px] shrink-0">
                  {topic.category}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-success" />
              <span className="text-sm font-medium">Online</span>
            </div>
            <span className="text-xs text-muted-foreground">{onlineCount} online</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {onlineList.map((u) => (
              <Link key={u.id} href={`/profile/${u.id}`}>
                <div className="relative group">
                  <Avatar className="h-9 w-9 ring-2 ring-transparent group-hover:ring-primary/50 transition-all">
                    <AvatarImage src={u.avatar ?? undefined} />
                    <AvatarFallback className="text-xs bg-muted">
                      {getInitials(u.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-success border-2 border-card" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium">AI Suggestions</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-gradient-to-r from-secondary/10 to-primary/10 border border-secondary/20 cursor-pointer hover:border-secondary/40 transition-colors">
              <p className="text-sm font-medium mb-1">Review Calculus III</p>
              <p className="text-xs text-muted-foreground">Based on your recent activity</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20 cursor-pointer hover:border-accent/40 transition-colors">
              <p className="text-sm font-medium mb-1">Practice Physics Problems</p>
              <p className="text-xs text-muted-foreground">Improve your weak areas</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Upcoming</span>
            </div>
          </div>
          <div className="space-y-2">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted cursor-pointer transition-colors">
                <div className="w-1 h-10 rounded-full" style={{ backgroundColor: event.color ?? "#3B82F6" }} />
                <div>
                  <p className="text-sm font-medium line-clamp-1">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.date} at {event.startTime}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-warning" />
              <span className="text-sm font-medium">Leaderboard</span>
            </div>
            <Link href="/leaderboard">
              <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                View All <ChevronRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
          <div className="space-y-2">
            {leaderboard?.map((entry, i) => (
              <div
                key={entry.id}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition-colors"
              >
                <span className={`text-sm font-bold w-5 text-center ${
                  i === 0 ? "text-warning" : i === 1 ? "text-muted-foreground" : i === 2 ? "text-orange-600" : "text-muted-foreground"
                }`}>
                  {i + 1}
                </span>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={entry.avatar ?? undefined} />
                  <AvatarFallback className="text-xs bg-muted">
                    {getInitials(entry.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{entry.name}</p>
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  {formatNumber(entry.xp)} XP
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
