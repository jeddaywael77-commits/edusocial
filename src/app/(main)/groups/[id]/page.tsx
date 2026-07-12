"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Settings,
  Crown,
  Bell,
  BellOff,
  UserPlus,
  FileText,
  Calendar,
  Image,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "@/components/feed/post-card";
import { CreatePost } from "@/components/feed/create-post";
import { mockGroups, mockPosts, mockUsers } from "@/lib/mock-data";
import { formatNumber, getInitials } from "@/lib/utils";

export default function GroupDetailPage() {
  const params = useParams();
  const groupId = params.id as string;
  const group = mockGroups.find((g) => g.id === groupId) || mockGroups[0];
  const [isJoined, setIsJoined] = useState(group.isJoined);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="relative h-32 sm:h-40 bg-gradient-to-br from-primary/50 via-secondary/50 to-accent/50">
          <Button variant="glass" size="icon-sm" className="absolute top-3 right-3">
            <Image className="h-4 w-4" />
          </Button>
        </div>

        <div className="px-4 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-3 -mt-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 border-4 border-card flex items-center justify-center text-primary">
              <Users className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{group.name}</h1>
              <p className="text-sm text-muted-foreground">{group.description}</p>
            </div>
            <div className="flex items-center gap-2">
              {isJoined ? (
                <>
                  <Button variant="outline" size="sm" onClick={() => setNotifications(!notifications)}>
                    {notifications ? <Bell className="h-4 w-4 mr-1" /> : <BellOff className="h-4 w-4 mr-1" />}
                    {notifications ? "Muted" : "Notifications"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setIsJoined(false)}>
                    Leave Group
                  </Button>
                </>
              ) : (
                <Button size="sm" onClick={() => setIsJoined(true)}>
                  <UserPlus className="h-4 w-4 mr-1" />
                  Join Group
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
            <Badge variant="outline" className="capitalize">{group.type}</Badge>
            <span>{formatNumber(group.membersCount)} members</span>
            <span>{group.postsCount} posts</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Tabs defaultValue="posts">
            <TabsList>
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="mt-4 space-y-4">
              {isJoined && <CreatePost />}
              {mockPosts.slice(0, 2).map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </TabsContent>

            <TabsContent value="members" className="mt-4">
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {mockUsers.slice(0, 10).map((member) => (
                    <Link
                      key={member.id}
                      href={`/profile/${member.id}`}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition-colors"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="text-xs bg-primary/20 text-primary">{getInitials(member.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-1">
                          <p className="text-sm font-medium">{member.name}</p>
                          {member.role === "teacher" && <Crown className="h-3 w-3 text-warning" />}
                        </div>
                        <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="files" className="mt-4">
              <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No files shared yet</p>
              </div>
            </TabsContent>

            <TabsContent value="events" className="mt-4">
              <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No upcoming events</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="hidden lg:block space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4">
            <h3 className="font-semibold mb-3">About</h3>
            <p className="text-sm text-muted-foreground">{group.description}</p>
            <div className="mt-3 text-xs text-muted-foreground">
              Created {new Date(group.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
