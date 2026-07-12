"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, Star, Target } from "lucide-react";
import { Card } from "@/shared/ui/card";
import { useProfile } from "@/features/auth";

const allBadges = [
  { id: "1", name: "Quick Learner", icon: "\u{1F393}", description: "Complete 10 lessons in a day", color: "#3B82F6", xpRequired: 100 },
  { id: "2", name: "Helpful", icon: "\u{1F91D}", description: "Answer 20 questions", color: "#22C55E", xpRequired: 200 },
  { id: "3", name: "Streak Master", icon: "\u{1F525}", description: "30-day learning streak", color: "#F59E0B", xpRequired: 500 },
  { id: "4", name: "First Post", icon: "\u{1F4DD}", description: "Create your first post", color: "#8B5CF6", xpRequired: 50 },
  { id: "5", name: "Math Wizard", icon: "\u{1F9EE}", description: "Complete all math courses", color: "#06B6D4", xpRequired: 1000 },
  { id: "6", name: "Code Ninja", icon: "\u{1F4BB}", description: "Solve 100 coding challenges", color: "#EF4444", xpRequired: 800 },
  { id: "7", name: "Social Butterfly", icon: "\u{1F98B}", description: "Add 100 friends", color: "#EC4899", xpRequired: 300 },
  { id: "8", name: "AI Explorer", icon: "\u{1F916}", description: "Use AI Tutor 50 times", color: "#8B5CF6", xpRequired: 400 },
  { id: "9", name: "Bookworm", icon: "\u{1F4DA}", description: "Read 20 documents", color: "#22C55E", xpRequired: 250 },
  { id: "10", name: "Group Leader", icon: "\u{1F451}", description: "Create and manage a group", color: "#F59E0B", xpRequired: 600 },
  { id: "11", name: "Perfect Score", icon: "\u{1F4AF}", description: "Get 100% on an exam", color: "#3B82F6", xpRequired: 1500 },
  { id: "12", name: "Community Star", icon: "\u2B50", description: "Get 100 likes on your posts", color: "#06B6D4", xpRequired: 700 },
];

export default function BadgesPage() {
  const { data: user } = useProfile();
  const userXp = user?.xp ?? 0;
  const earnedBadges = allBadges.filter((b) => userXp >= b.xpRequired);
  const availableBadges = allBadges.filter((b) => userXp < b.xpRequired);

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
