"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Plus,
  Search,
  ChevronRight,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Badge } from "@/shared/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { useGroups } from "@/features/groups";
import { formatNumber } from "@/shared/lib/utils";

const groupTypeIcons: Record<string, React.ReactNode> = {
  SCHOOL: <GraduationCap className="h-5 w-5" />,
  CLASSROOM: <BookOpen className="h-5 w-5" />,
  CLUB: <Users className="h-5 w-5" />,
};

export default function GroupsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: groups = [], isLoading } = useGroups();

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

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Groups ({groups.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-4 rounded-xl bg-muted/30 animate-pulse">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-muted" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-32 bg-muted rounded" />
                        <div className="h-3 w-48 bg-muted rounded" />
                        <div className="h-3 w-24 bg-muted rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {groups
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
                          {groupTypeIcons[group.type] || <Users className="h-5 w-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate">{group.name}</p>
                            <Badge variant="outline" className="text-[10px] shrink-0 capitalize">{group.type.toLowerCase()}</Badge>
                          </div>
                          {group.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{group.description}</p>
                          )}
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span>{formatNumber(group._count?.members ?? 0)} members</span>
                            <span>{group._count?.posts ?? 0} posts</span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
                {groups.filter((g) => g.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                  <div className="col-span-2 text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No groups found</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
