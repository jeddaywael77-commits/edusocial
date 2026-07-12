"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin,
  Calendar,
  Users,
  BookOpen,
  Trophy,
  Edit3,
  Camera,
  MessageSquare,
  UserPlus,
  UserMinus,
  MoreHorizontal,
  Star,
  TrendingUp,
  Medal,
  Link as LinkIcon,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Card } from "@/shared/ui/card";
import { PostCard } from "@/widgets/feed/post-card";
import { CreatePost } from "@/widgets/feed/create-post";
import { useAuthStore } from "@/stores/auth-store";
import { mockUsers, mockPosts } from "@/lib/mock-data";
import { formatNumber, formatDate, getInitials } from "@/lib/utils";

export default function ProfilePage() {
  const params = useParams();
  const { user: currentUser } = useAuthStore();
  const [isFriend, setIsFriend] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const userId = params.id as string;
  const profileUser = userId === currentUser?.id ? currentUser : mockUsers.find((u) => u.id === userId) || mockUsers[0];
  const isOwnProfile = userId === currentUser?.id;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="relative h-48 sm:h-56 bg-gradient-to-br from-primary via-secondary to-accent">
          {isOwnProfile && (
            <Button variant="glass" size="sm" className="absolute top-3 right-3">
              <Camera className="h-4 w-4 mr-1" />
              Edit Cover
            </Button>
          )}
        </div>

        <div className="relative px-4 sm:px-6 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-16">
            <div className="relative">
              <Avatar className="h-24 w-24 sm:h-32 sm:w-32 ring-4 ring-card">
                <AvatarImage src={profileUser.avatar} />
                <AvatarFallback className="text-3xl bg-primary/20 text-primary font-bold">
                  {getInitials(profileUser.name)}
                </AvatarFallback>
              </Avatar>
              {profileUser.isOnline && (
                <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-success border-4 border-card" />
              )}
            </div>

            <div className="flex-1 sm:pb-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{profileUser.name}</h1>
                {profileUser.role === "teacher" && (
                  <Badge variant="secondary" className="text-xs">Teacher</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{profileUser.bio}</p>
            </div>

            <div className="flex items-center gap-2 sm:pb-2">
              {isOwnProfile ? (
                <Button variant="outline">
                  <Edit3 className="h-4 w-4 mr-1" />
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    variant={isFriend ? "outline" : "default"}
                    onClick={() => setIsFriend(!isFriend)}
                  >
                    {isFriend ? <UserMinus className="h-4 w-4 mr-1" /> : <UserPlus className="h-4 w-4 mr-1" />}
                    {isFriend ? "Remove Friend" : "Add Friend"}
                  </Button>
                  <Button variant="outline">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border">
            {profileUser.school && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                {profileUser.school}
              </div>
            )}
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {profileUser.department || "Not specified"}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Joined {formatDate(profileUser.createdAt)}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            <div className="text-center p-3 rounded-xl bg-muted/50">
              <p className="text-xl font-bold text-primary">{formatNumber(profileUser.postsCount)}</p>
              <p className="text-xs text-muted-foreground">Posts</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-muted/50">
              <p className="text-xl font-bold text-secondary">{formatNumber(profileUser.followersCount)}</p>
              <p className="text-xs text-muted-foreground">Followers</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-muted/50">
              <p className="text-xl font-bold text-accent">{formatNumber(profileUser.followingCount)}</p>
              <p className="text-xs text-muted-foreground">Following</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-muted/50">
              <p className="text-xl font-bold text-warning">Lv.{profileUser.level}</p>
              <p className="text-xs text-muted-foreground">{formatNumber(profileUser.xp)} XP</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              About
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Role</span>
                <span className="capitalize">{profileUser.role}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Level</span>
                <span>{profileUser.level}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">XP</span>
                <span>{formatNumber(profileUser.xp)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Coins</span>
                <span>🪙 {formatNumber(profileUser.coins)}</span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Medal className="h-4 w-4 text-warning" />
              Badges ({profileUser.badges.length})
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {profileUser.badges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <span className="text-[10px] text-center text-muted-foreground">{badge.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Tabs defaultValue="posts">
            <TabsList>
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="friends">Friends</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="mt-4 space-y-4">
              {isOwnProfile && <CreatePost />}
              {mockPosts.slice(0, 3).map((post) => (
                <PostCard key={post.id} post={{ ...post, author: profileUser }} />
              ))}
            </TabsContent>

            <TabsContent value="about" className="mt-4">
              <Card className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">About {profileUser.name}</h3>
                  <p className="text-muted-foreground">{profileUser.bio || "No bio yet."}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-muted-foreground">School: </span>{profileUser.school || "Not specified"}</div>
                    <div><span className="text-muted-foreground">Department: </span>{profileUser.department || "Not specified"}</div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="friends" className="mt-4">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Friends ({profileUser.friendsCount})</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {mockUsers.slice(0, 6).map((u) => (
                    <div key={u.id} className="flex items-center gap-2 p-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="text-xs bg-primary/20 text-primary">{getInitials(u.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium truncate">{u.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{u.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="courses" className="mt-4">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Enrolled Courses</h3>
                <p className="text-muted-foreground">Course information will appear here.</p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
