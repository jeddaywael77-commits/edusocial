"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Bell,
  MessageSquare,
  Home,
  BookOpen,
  Bot,
  Users,
  Video,
  Settings,
  LogOut,
  User,
  ChevronDown,
  Menu,
  X,
  Command,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useProfile, useLogout } from "@/features/auth";
import { useUnreadCount } from "@/features/notifications";
import { getInitials } from "@/shared/lib/utils";

const navItems = [
  { label: "Feed", href: "/feed", icon: Home },
  { label: "Courses", href: "/courses", icon: BookOpen },
  { label: "AI", href: "/ai", icon: Bot },
  { label: "Groups", href: "/groups", icon: Users },
  { label: "Live", href: "/live", icon: Video },
];

export function Header() {
  const pathname = usePathname();
  const { data: user } = useProfile();
  const logout = useLogout();
  const { data: unreadData } = useUnreadCount();
  const unreadCount = unreadData?.count ?? 0;
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-strong border-b border-border/50">
      <div className="max-w-[1920px] mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 shrink-0">
          <Link href="/feed" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/25">
              <span className="text-white font-bold text-base">E</span>
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block tracking-tight">
              EduSocial
            </span>
          </Link>

          <div className="relative hidden md:block ml-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search EduSocial..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-16 w-72 lg:w-80 h-9 bg-muted/50 border-border/50 focus:border-primary focus:bg-muted/80 transition-all duration-200"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-background/80 border border-border/50">
              <Command className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] font-medium text-muted-foreground">K</span>
            </div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-0.5 bg-muted/30 rounded-2xl p-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-4 py-2 rounded-xl transition-all duration-200"
              >
                <div className="flex flex-col items-center gap-1">
                  <item.icon
                    className={`h-5 w-5 transition-colors duration-200 ${
                      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  />
                  <span
                    className={`text-[11px] font-medium transition-colors duration-200 ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <Button asChild variant="ghost" size="icon" className="hidden sm:flex h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted/50">
            <Link href="/messages"><MessageSquare className="h-5 w-5" /></Link>
          </Button>

          <Button asChild variant="ghost" size="icon" className="hidden sm:flex relative h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted/50">
            <Link href="/notifications">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-0.5 -right-0.5 h-[18px] min-w-[18px] rounded-full bg-destructive text-[10px] font-semibold text-white flex items-center justify-center px-1">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </motion.span>
              )}
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 pl-1.5 pr-2 h-9 hover:bg-muted/50">
                <Avatar className="h-7 w-7 ring-2 ring-border/50">
                  <AvatarImage src={user?.avatar ?? undefined} />
                  <AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                    {getInitials(user?.name || "U")}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 bg-card border-border/50 shadow-xl shadow-black/5">
              <div className="px-3 py-2.5 border-b border-border/50">
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <DropdownMenuItem asChild>
                <Link href={`/profile/${user?.id}`} className="cursor-pointer">
                  <User className="h-4 w-4" />
                  My Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout.mutate()} className="text-destructive cursor-pointer">
                <LogOut className="h-4 w-4" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-border/50 bg-card/95 backdrop-blur-xl"
        >
          <div className="p-4 space-y-1.5">
            <div className="relative mb-4 md:hidden">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search EduSocial..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full h-10 bg-muted/50 border-border/50"
              />
            </div>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
            <div className="border-t border-border/50 pt-2 mt-2">
              {[
                { label: "Messages", href: "/messages", icon: MessageSquare, badge: null },
                { label: "Notifications", href: "/notifications", icon: Bell, badge: unreadCount },
              ].map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all duration-200">
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                  {item.badge != null && item.badge > 0 && (
                    <span className="ml-auto h-5 min-w-[20px] rounded-full bg-destructive text-[10px] font-semibold text-white flex items-center justify-center px-1.5">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}
