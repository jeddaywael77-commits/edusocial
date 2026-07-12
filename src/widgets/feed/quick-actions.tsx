"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bot, FileText, Calendar, Trophy, ShoppingBag } from "lucide-react";

const actions = [
  { label: "AI Tutor", href: "/ai", icon: Bot, gradient: "from-secondary to-primary" },
  { label: "Documents", href: "/documents", icon: FileText, gradient: "from-accent to-primary" },
  { label: "Calendar", href: "/calendar", icon: Calendar, gradient: "from-primary to-secondary" },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy, gradient: "from-warning to-orange-500" },
  { label: "Marketplace", href: "/marketplace", icon: ShoppingBag, gradient: "from-success to-accent" },
];

export function QuickActions() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
      {actions.map((action, i) => (
        <motion.div
          key={action.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <Link
            href={action.href}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border hover:border-primary/30 transition-all whitespace-nowrap group"
          >
            <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center`}>
              <action.icon className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              {action.label}
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
