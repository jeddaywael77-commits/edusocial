"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  BookOpen,
  Users,
  FileText,
  Calendar,
  Trophy,
  Medal,
  BarChart3,
  ShoppingBag,
  Star,
  TrendingUp,
  Flame,
  Clock,
  Zap,
  Award,
  Coins,
  Newspaper,
  CalendarDays,
  Globe,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { useProfile } from "@/features/auth";
import { useGamificationStats } from "@/features/gamification";
import { getInitials, formatNumber } from "@/shared/lib/utils";

const menuItems = [
  { label: "My Profile", href: "/profile/", icon: User },
  { label: "My Courses", href: "/courses", icon: BookOpen },
  { label: "My Groups", href: "/groups", icon: Users },
  { label: "Documents", href: "/documents", icon: FileText },
  { label: "Calendar", href: "/calendar", icon: Calendar },
  { label: "News", href: "/news", icon: Newspaper },
  { label: "Events", href: "/events", icon: CalendarDays },
  { label: "Study Tunisia", href: "/study-tunisia", icon: Globe },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { label: "Badges", href: "/badges", icon: Medal },
  { label: "Results", href: "/results", icon: BarChart3 },
  { label: "Marketplace", href: "/marketplace", icon: ShoppingBag },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: user } = useProfile();
  const { data: stats } = useGamificationStats();

  const xpProgress = ((user?.xp || 0) % 1000) / 10;
  const friendCount = (user?._count?.friendsA ?? 0) + (user?._count?.friendsB ?? 0);

  return (
    <aside className="hidden lg:block w-72 shrink-0">
      <div className="sticky top-16 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto pb-4 pr-2 scrollbar-thin">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border border-border bg-card overflow-hidden"
        >
          <div className="h-16 bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20" />
          <div className="px-4 pb-4 -mt-8">
            <Link href={`/profile/${user?.id}`} className="group inline-block">
              <Avatar className="h-14 w-14 ring-4 ring-card">
                <AvatarImage src={user?.avatar ?? undefined} />
                <AvatarFallback className="bg-primary/20 text-primary font-bold text-lg">
                  {getInitials(user?.name || "U")}
                </AvatarFallback>
              </Avatar>
            </Link>

            <div className="mt-2 space-y-0.5">
              <Link
                href={`/profile/${user?.id}`}
                className="font-semibold text-foreground group-hover:text-primary transition-colors"
              >
                {user?.name}
              </Link>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {user?.role?.toLowerCase()}
                </Badge>
                {user?.department && (
                  <span className="text-[11px] text-muted-foreground truncate">
                    {user.department}
                  </span>
                )}
              </div>
              {user?.school && (
                <p className="text-[11px] text-muted-foreground">{user.school}</p>
              )}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="text-center p-2 rounded-xl bg-muted/50">
                <p className="text-sm font-bold text-primary">{formatNumber(friendCount)}</p>
                <p className="text-[10px] text-muted-foreground">Friends</p>
              </div>
              <div className="text-center p-2 rounded-xl bg-muted/50">
                <p className="text-sm font-bold text-secondary">{formatNumber(user?._count?.followers ?? 0)}</p>
                <p className="text-[10px] text-muted-foreground">Followers</p>
              </div>
              <div className="text-center p-2 rounded-xl bg-muted/50">
                <p className="text-sm font-bold text-accent">{formatNumber(user?._count?.posts ?? 0)}</p>
                <p className="text-[10px] text-muted-foreground">Posts</p>
              </div>
            </div>

            {/* XP Progress */}
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 text-warning" />
                  <span className="text-xs font-medium">Level {user?.level}</span>
                </div>
                <span className="text-[11px] text-muted-foreground">{formatNumber(user?.xp || 0)} XP</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full gradient-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Coins className="h-3.5 w-3.5 text-warning" />
                <span>{formatNumber(user?.coins || 0)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Award className="h-3.5 w-3.5 text-primary" />
                <span>{stats?.badgeCount ?? 0}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Menu */}
        <motion.nav
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="rounded-2xl border border-border bg-card p-2 space-y-0.5"
        >
          {menuItems.map((item) => {
            const href = item.label === "My Profile" ? `/profile/${user?.id ?? ""}` : item.href;
            const isActive = pathname === href || pathname?.startsWith(href + "/");
            return (
              <Link
                key={item.href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon
                  className={`h-5 w-5 shrink-0 transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  }`}
                />
                <span className="truncate">{item.label}</span>
                {item.label === "Calendar" && (
                  <Badge variant="warning" className="ml-auto text-[10px] px-1.5 shrink-0">
                    3
                  </Badge>
                )}
              </Link>
            );
          })}
        </motion.nav>

        {/* Study Stats Widget */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="rounded-2xl border border-border bg-card p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium">Study Stats</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/10">
              <div className="flex items-center gap-1.5 mb-1">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Streak</span>
              </div>
              <p className="text-lg font-bold text-orange-500">12 days</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/10">
              <div className="flex items-center gap-1.5 mb-1">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Hours</span>
              </div>
              <p className="text-lg font-bold text-blue-500">48.5h</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/10">
              <div className="flex items-center gap-1.5 mb-1">
                <Zap className="h-4 w-4 text-purple-500" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Tasks</span>
              </div>
              <p className="text-lg font-bold text-purple-500">87%</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/10">
              <div className="flex items-center gap-1.5 mb-1">
                <BookOpen className="h-4 w-4 text-emerald-500" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Courses</span>
              </div>
              <p className="text-lg font-bold text-emerald-500">5</p>
            </div>
          </div>
        </motion.div>
      </div>
    </aside>
  );
}
