"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, Trophy, Star, Flame, Target, Zap, BookOpen, Users, Code, Brain, GraduationCap, Medal } from "lucide-react";
import { Card } from "@/shared/ui/card";
import { Badge as BadgeComponent } from "@/shared/ui/badge";
import { useAuthStore } from "@/stores/auth-store";

const allBadges = [
  { id: "1", name: "Quick Learner", icon: "🎓", description: "Complete 10 lessons in a day", color: "#3B82F6", earned: true },
  { id: "2", name: "Helpful", icon: "🤝", description: "Answer 20 questions", color: "#22C55E", earned: true },
  { id: "3", name: "Streak Master", icon: "🔥", description: "30-day learning streak", color: "#F59E0B", earned: true },
  { id: "4", name: "First Post", icon: "📝", description: "Create your first post", color: "#8B5CF6", earned: true },
  { id: "5", name: "Math Wizard", icon: "🧮", description: "Complete all math courses", color: "#06B6D4", earned: false },
  { id: "6", name: "Code Ninja", icon: "💻", description: "Solve 100 coding challenges", color: "#EF4444", earned: false },
  { id: "7", name: "Social Butterfly", icon: "🦋", description: "Add 100 friends", color: "#EC4899", earned: false },
  { id: "8", name: "AI Explorer", icon: "🤖", description: "Use AI Tutor 50 times", color: "#8B5CF6", earned: false },
  { id: "9", name: "Bookworm", icon: "📚", description: "Read 20 documents", color: "#22C55E", earned: false },
  { id: "10", name: "Group Leader", icon: "👑", description: "Create and manage a group", color: "#F59E0B", earned: false },
  { id: "11", name: "Perfect Score", icon: "💯", description: "Get 100% on an exam", color: "#3B82F6", earned: false },
  { id: "12", name: "Community Star", icon: "⭐", description: "Get 100 likes on your posts", color: "#06B6D4", earned: false },
];

export default function BadgesPage() {
  const { user } = useAuthStore();
  const earnedBadges = allBadges.filter((b) => b.earned);
  const availableBadges = allBadges.filter((b) => !b.earned);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-4">
        <h1 className="text-xl font-bold flex items-center gap-2 mb-2">
          <Award className="h-5 w-5 text-warning" />
          Badges
        </h1>
        <p className="text-sm text-muted-foreground mb-4">
          {earnedBadges.length} of {allBadges.length} badges earned
        </p>

        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Star className="h-4 w-4 text-warning" />
          Earned ({earnedBadges.length})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
          {earnedBadges.map((badge, i) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="p-4 text-center hover:border-primary/30 transition-all cursor-pointer">
                <span className="text-4xl mb-2 block">{badge.icon}</span>
                <p className="text-sm font-semibold">{badge.name}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{badge.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Target className="h-4 w-4 text-muted-foreground" />
          Available ({availableBadges.length})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {availableBadges.map((badge, i) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="p-4 text-center opacity-60 hover:opacity-100 transition-all cursor-pointer">
                <span className="text-4xl mb-2 block grayscale">{badge.icon}</span>
                <p className="text-sm font-semibold">{badge.name}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{badge.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
