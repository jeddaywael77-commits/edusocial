"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Users,
  Bot,
  Calendar,
  Trophy,
  Flame,
  ChevronRight,
  BookOpen,
  Clock,
  Target,
  Zap,
  Star,
  FileText,
  MessageSquare,
  Lightbulb,
  BarChart3,
  Brain,
  GraduationCap,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { useLeaderboardXp } from "@/features/leaderboard";
import { useOnlineUsers } from "@/features/users";
import { useCalendarEvents } from "@/features/calendar";
import { formatNumber, getInitials } from "@/shared/lib/utils";

const mockTrending = [
  { id: "1", title: "Calculus III", category: "Math", postsCount: 128 },
  { id: "2", title: "Machine Learning", category: "CS", postsCount: 95 },
  { id: "3", title: "Quantum Physics", category: "Physics", postsCount: 72 },
  { id: "4", title: "Web Development", category: "CS", postsCount: 64 },
];

const mockSchedule = [
  { id: "1", time: "09:00", title: "Calculus III", course: "MATH 301", color: "#3B82F6" },
  { id: "2", time: "11:30", title: "Machine Learning", course: "CS 450", color: "#8B5CF6" },
  { id: "3", time: "14:00", title: "Physics Lab", course: "PHYS 202", color: "#10B981" },
  { id: "4", time: "16:30", title: "Study Group", course: "LIB 204", color: "#F59E0B" },
];

const mockAssignments = [
  { id: "1", title: "Linear Algebra Problem Set", course: "MATH 250", dueDate: "Tomorrow", progress: 65 },
  { id: "2", title: "ML Model Training Report", course: "CS 450", dueDate: "In 3 days", progress: 30 },
  { id: "3", title: "Physics Lab Write-up", course: "PHYS 202", dueDate: "In 5 days", progress: 10 },
];

const quickLinks = [
  { label: "Documents", icon: FileText, href: "/documents" },
  { label: "Calendar", icon: Calendar, href: "/calendar" },
  { label: "Badges", icon: Star, href: "/badges" },
  { label: "Marketplace", icon: BarChart3, href: "/marketplace" },
];

function CollapsibleCard({
  title,
  icon: Icon,
  iconColor,
  children,
  defaultOpen = true,
  action,
}: {
  title: string;
  icon: React.ElementType;
  iconColor?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  action?: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpen(!open); }}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${iconColor ?? "text-primary"}`} />
          <span className="text-sm font-semibold">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {action}
          {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function RightSidebar() {
  const { data: leaderboard } = useLeaderboardXp(5);
  const { data: onlineUsers } = useOnlineUsers();
  const { data: events } = useCalendarEvents();

  const onlineList = onlineUsers?.filter((u) => u.isOnline).slice(0, 8) ?? [];
  const onlineCount = onlineUsers?.filter((u) => u.isOnline).length ?? 0;
  const upcomingEvents = Array.isArray(events) ? events.slice(0, 4) : [];

  const [quickActionHover, setQuickActionHover] = useState<string | null>(null);

  return (
    <aside className="hidden xl:block w-80 shrink-0">
      <div className="sticky top-16 space-y-3 max-h-[calc(100vh-4rem)] overflow-y-auto pb-4 pl-2 scrollbar-thin">
        {/* AI Assistant */}
        <div className="rounded-2xl border border-transparent bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 p-[1px]">
          <div className="rounded-2xl bg-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold">AI Assistant</p>
                <p className="text-[10px] text-muted-foreground">Powered by EduSocial AI</p>
              </div>
            </div>
            <Link href="/ai">
              <div className="p-3 rounded-xl bg-muted/50 border border-border hover:border-primary/40 cursor-pointer transition-all group">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                    Ask AI anything...
                  </span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground ml-auto group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </Link>
            <div className="flex gap-2 mt-3">
              {["Summarize", "Quiz me", "Explain"].map((chip) => (
                <motion.div
                  key={chip}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => setQuickActionHover(chip)}
                  onHoverEnd={() => setQuickActionHover(null)}
                >
                  <Badge
                    variant="outline"
                    className={`cursor-pointer text-[11px] px-2.5 py-1 transition-all ${
                      quickActionHover === chip
                        ? "border-primary/50 bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    {chip === "Summarize" && <BookOpen className="h-3 w-3 mr-1" />}
                    {chip === "Quiz me" && <Zap className="h-3 w-3 mr-1" />}
                    {chip === "Explain" && <Lightbulb className="h-3 w-3 mr-1" />}
                    {chip}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Trending Topics */}
        <CollapsibleCard title="Trending Topics" icon={Flame} iconColor="text-orange-500">
          <div className="space-y-2">
            {mockTrending.map((topic, i) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-muted cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Flame className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">
                      {topic.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{topic.postsCount} posts</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] shrink-0 ml-2">
                  {topic.category}
                </Badge>
              </motion.div>
            ))}
          </div>
        </CollapsibleCard>

        {/* Online Friends */}
        <CollapsibleCard
          title="Online Friends"
          icon={Users}
          iconColor="text-emerald-500"
          defaultOpen={true}
          action={
            <span className="text-[11px] text-emerald-500 font-medium mr-1">
              {onlineCount} online
            </span>
          }
        >
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
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-card" />
                </div>
              </Link>
            ))}
          </div>
          <Link href="/friends">
            <Button variant="ghost" size="sm" className="w-full mt-3 text-xs h-8 text-muted-foreground hover:text-primary">
              View All Friends <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </CollapsibleCard>

        {/* Today's Schedule */}
        <CollapsibleCard title="Today's Schedule" icon={Calendar} iconColor="text-blue-500">
          <div className="space-y-2">
            {mockSchedule.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted cursor-pointer transition-colors"
              >
                <div
                  className="w-1 h-10 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                  <p className="text-[11px] text-muted-foreground">{item.course}</p>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground shrink-0">
                  <Clock className="h-3 w-3" />
                  <span className="text-[11px] font-medium">{item.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
          <Link href="/calendar">
            <Button variant="ghost" size="sm" className="w-full mt-3 text-xs h-8 text-muted-foreground hover:text-primary">
              View Calendar <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </CollapsibleCard>

        {/* Upcoming Assignments */}
        <CollapsibleCard title="Upcoming Assignments" icon={Target} iconColor="text-amber-500">
          <div className="space-y-2.5">
            {mockAssignments.map((assignment, i) => (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="p-2.5 rounded-xl hover:bg-muted cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between mb-1.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium line-clamp-1">{assignment.title}</p>
                    <p className="text-[11px] text-muted-foreground">{assignment.course}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[10px] shrink-0 ml-2 ${
                      assignment.dueDate === "Tomorrow"
                        ? "border-red-500/50 text-red-500"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {assignment.dueDate}
                  </Badge>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${assignment.progress}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                    className={`h-full rounded-full ${
                      assignment.progress >= 60
                        ? "bg-emerald-500"
                        : assignment.progress >= 30
                          ? "bg-amber-500"
                          : "bg-red-500"
                    }`}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">{assignment.progress}% complete</p>
              </motion.div>
            ))}
          </div>
          <Link href="/courses">
            <Button variant="ghost" size="sm" className="w-full mt-2 text-xs h-8 text-muted-foreground hover:text-primary">
              View Courses <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </CollapsibleCard>

        {/* Leaderboard */}
        <CollapsibleCard
          title="Leaderboard"
          icon={Trophy}
          iconColor="text-yellow-500"
          action={
            <Link href="/leaderboard">
              <Button variant="ghost" size="sm" className="text-[11px] h-6 px-2 text-muted-foreground hover:text-primary">
                View All
              </Button>
            </Link>
          }
        >
          <div className="space-y-1.5">
            {leaderboard?.map((entry, i) => (
              <div
                key={entry.id}
                className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-muted transition-colors cursor-pointer"
              >
                <span
                  className={`text-xs font-bold w-5 text-center shrink-0 ${
                    i === 0
                      ? "text-yellow-500"
                      : i === 1
                        ? "text-gray-400"
                        : i === 2
                          ? "text-orange-500"
                          : "text-muted-foreground"
                  }`}
                >
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                </span>
                <Avatar className="h-7 w-7">
                  <AvatarImage src={entry.avatar ?? undefined} />
                  <AvatarFallback className="text-[10px] bg-muted">
                    {getInitials(entry.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{entry.name}</p>
                </div>
                <span className="text-[11px] text-primary font-semibold font-mono">
                  {formatNumber(entry.xp)} XP
                </span>
              </div>
            ))}
          </div>
        </CollapsibleCard>

        {/* AI Suggestions */}
        <CollapsibleCard title="AI Suggestions" icon={Brain} iconColor="text-violet-500">
          <div className="space-y-2">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 border border-blue-500/20 hover:border-blue-500/40 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="h-3.5 w-3.5 text-blue-500" />
                <p className="text-sm font-medium">Review Calculus</p>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Based on your recent quiz scores, focus on integration techniques.
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 hover:border-emerald-500/40 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <GraduationCap className="h-3.5 w-3.5 text-emerald-500" />
                <p className="text-sm font-medium">Practice Physics</p>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Complete 5 more problems to unlock the Quantum Mechanics badge.
              </p>
            </motion.div>
          </div>
        </CollapsibleCard>

        {/* Quick Links */}
        <CollapsibleCard title="Quick Links" icon={Zap} iconColor="text-cyan-500" defaultOpen={true}>
          <div className="grid grid-cols-2 gap-2">
            {quickLinks.map((link) => (
              <Link key={link.label} href={link.href}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/50 hover:bg-muted cursor-pointer transition-colors text-center justify-center"
                >
                  <link.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium">{link.label}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </CollapsibleCard>
      </div>
    </aside>
  );
}
