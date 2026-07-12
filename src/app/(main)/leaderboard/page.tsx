"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Crown, TrendingUp, Star, Flame, Target, Award } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { mockLeaderboard, mockUsers } from "@/lib/mock-data";
import { formatNumber, getInitials } from "@/lib/utils";

export default function LeaderboardPage() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-4">
        <h1 className="text-xl font-bold flex items-center gap-2 mb-4">
          <Trophy className="h-5 w-5 text-warning" />
          Leaderboard
        </h1>

        {/* Top 3 Podium */}
        <div className="flex items-end justify-center gap-4 mb-8 pt-4">
          {[mockLeaderboard[1], mockLeaderboard[0], mockLeaderboard[2]].map((entry, i) => {
            const heights = ["h-28", "h-36", "h-24"];
            const medals = ["🥈", "🥇", "🥉"];
            return (
              <motion.div
                key={entry.user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="flex flex-col items-center"
              >
                <Avatar className={`h-16 w-16 ${i === 1 ? "ring-4 ring-warning" : "ring-2 ring-border"} mb-2`}>
                  <AvatarImage src={entry.user.avatar} />
                  <AvatarFallback className="bg-primary/20 text-primary font-bold">
                    {getInitials(entry.user.name)}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm font-semibold text-center">{entry.user.name}</p>
                <p className="text-xs text-muted-foreground mb-2">{formatNumber(entry.xp)} XP</p>
                <div className={`${heights[i]} w-24 rounded-t-xl ${
                  i === 1 ? "bg-gradient-to-t from-warning to-warning/50" :
                  i === 0 ? "bg-gradient-to-t from-muted-foreground to-muted-foreground/50" :
                  "bg-gradient-to-t from-orange-700 to-orange-700/50"
                } flex items-start justify-center pt-2`}>
                  <span className="text-2xl">{medals[i]}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <Tabs defaultValue="xp">
          <TabsList>
            <TabsTrigger value="xp">
              <TrendingUp className="h-3.5 w-3.5 mr-1" />
              XP Points
            </TabsTrigger>
            <TabsTrigger value="streak">
              <Flame className="h-3.5 w-3.5 mr-1" />
              Streak
            </TabsTrigger>
            <TabsTrigger value="badges">
              <Award className="h-3.5 w-3.5 mr-1" />
              Badges
            </TabsTrigger>
          </TabsList>

          <TabsContent value="xp" className="mt-4">
            <div className="space-y-1">
              {mockLeaderboard.map((entry, i) => (
                <motion.div
                  key={entry.user.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <span className={`w-8 text-center font-bold ${
                    i === 0 ? "text-warning text-lg" : i === 1 ? "text-muted-foreground" : i === 2 ? "text-orange-600" : "text-muted-foreground"
                  }`}>
                    {i + 1}
                  </span>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={entry.user.avatar} />
                    <AvatarFallback className="bg-primary/20 text-primary text-sm">{getInitials(entry.user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{entry.user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{entry.user.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">{formatNumber(entry.xp)} XP</p>
                    <p className="text-xs text-muted-foreground">Level {entry.user.level}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="streak" className="mt-4">
            <div className="space-y-1">
              {mockUsers.slice(0, 10).map((user, i) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <span className="w-8 text-center font-bold text-muted-foreground">{i + 1}</span>
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/20 text-primary text-sm">{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{user.name}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-bold">{Math.floor(Math.random() * 30) + 1} days</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="badges" className="mt-4">
            <div className="text-center py-12 text-muted-foreground">
              <Award className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Badge leaderboard coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
