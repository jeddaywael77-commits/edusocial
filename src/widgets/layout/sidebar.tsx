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
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { useAuthStore } from "@/stores/auth-store";
import { getInitials, formatNumber } from "@/lib/utils";

const menuItems = [
  { label: "My Profile", href: "/profile/1", icon: User },
  { label: "My Courses", href: "/courses", icon: BookOpen },
  { label: "My Groups", href: "/groups", icon: Users },
  { label: "Documents", href: "/documents", icon: FileText },
  { label: "Calendar", href: "/calendar", icon: Calendar },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { label: "Badges", href: "/badges", icon: Medal },
  { label: "Results", href: "/results", icon: BarChart3 },
  { label: "Marketplace", href: "/marketplace", icon: ShoppingBag },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  return (
    <aside className="hidden lg:block w-72 shrink-0">
      <div className="sticky top-16 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto pb-4 pr-2">
        <div className="rounded-2xl border border-border bg-card p-4">
          <Link href={`/profile/${user?.id}`} className="flex items-center gap-3 mb-4 group">
            <Avatar className="h-12 w-12 ring-2 ring-primary/20">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                {getInitials(user?.name || "U")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold group-hover:text-primary transition-colors">
                {user?.name}
              </p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
          </Link>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center p-2 rounded-xl bg-muted/50">
              <p className="text-sm font-bold text-primary">{user?.friendsCount || 0}</p>
              <p className="text-[10px] text-muted-foreground">Friends</p>
            </div>
            <div className="text-center p-2 rounded-xl bg-muted/50">
              <p className="text-sm font-bold text-secondary">{user?.followersCount || 0}</p>
              <p className="text-[10px] text-muted-foreground">Followers</p>
            </div>
            <div className="text-center p-2 rounded-xl bg-muted/50">
              <p className="text-sm font-bold text-accent">{user?.postsCount || 0}</p>
              <p className="text-[10px] text-muted-foreground">Posts</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-warning" />
                <span className="text-muted-foreground">Level {user?.level}</span>
              </div>
              <span className="text-xs text-muted-foreground">{formatNumber(user?.xp || 0)} XP</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full gradient-primary transition-all duration-500"
                style={{ width: `${((user?.xp || 0) % 1000) / 10}%` }}
              />
            </div>
          </div>
        </div>

        <nav className="rounded-2xl border border-border bg-card p-2 space-y-0.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon
                  className={`h-5 w-5 transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  }`}
                />
                {item.label}
                {item.label === "Calendar" && (
                  <Badge variant="warning" className="ml-auto text-[10px] px-1.5">
                    3
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium">Quick Stats</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Coins</span>
              <Badge variant="warning" className="text-xs">
                🪙 {formatNumber(user?.coins || 0)}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Badges</span>
              <span className="text-xs">{user?.badges?.length || 0} earned</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
