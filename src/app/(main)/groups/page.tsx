"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Plus,
  Search,
  Settings,
  Crown,
  ChevronRight,
  BookOpen,
  Code,
  Atom,
  Brain,
  GraduationCap,
  Hash,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Badge } from "@/shared/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { mockGroups } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";

const groupTypeIcons: Record<string, React.ReactNode> = {
  school: <GraduationCap className="h-5 w-5" />,
  classroom: <BookOpen className="h-5 w-5" />,
  club: <Users className="h-5 w-5" />,
};

export default function GroupsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const myGroups = mockGroups.filter((g) => g.isJoined);
  const discoverGroups = mockGroups.filter((g) => !g.isJoined);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Groups
          </h1>
          <Button>
            <Plus className="h-4 w-4 mr-1" />
            Create Group
          </Button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs defaultValue="my">
          <TabsList>
            <TabsTrigger value="my">My Groups ({myGroups.length})</TabsTrigger>
            <TabsTrigger value="discover">Discover</TabsTrigger>
          </TabsList>

          <TabsContent value="my" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {myGroups
                .filter((g) => g.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((group, i) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/groups/${group.id}`} className="block p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors border border-transparent hover:border-primary/20">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        {groupTypeIcons[group.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{group.name}</p>
                          <Badge variant="outline" className="text-[10px] shrink-0 capitalize">{group.type}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{group.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span>{formatNumber(group.membersCount)} members</span>
                          <span>{group.postsCount} posts</span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="discover" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {discoverGroups.map((group, i) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 rounded-xl bg-muted/30 border border-border"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                      {groupTypeIcons[group.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{group.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{group.description}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-muted-foreground">{formatNumber(group.membersCount)} members</span>
                        <Button size="sm" variant="outline" className="h-7 text-xs">
                          <Plus className="h-3 w-3 mr-1" />
                          Join
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
