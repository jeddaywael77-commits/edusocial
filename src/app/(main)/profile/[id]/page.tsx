"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
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
  TrendingUp,
  Medal,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Card } from "@/shared/ui/card";
import { CreatePost } from "@/widgets/feed/create-post";
import { useProfile } from "@/features/auth";
import { useUser } from "@/features/users";
import { useFollow, useUnfollow, useFollowers, useFollowing } from "@/features/followers";
import { useSendFriendRequest } from "@/features/friends";
import { formatNumber, formatDate, getInitials } from "@/shared/lib/utils";
import { UserRole } from "@/shared/types/enums";

export default function ProfilePage() {
  const params = useParams();
  const { data: currentUser } = useProfile();
  const userId = params.id as string;
  const { data: profileUser, isLoading } = useUser(userId);
  const followMutation = useFollow();
  const unfollowMutation = useUnfollow();
  const sendFriendRequest = useSendFriendRequest();
  const { data: followers = [] } = useFollowers(userId);
  const { data: following = [] } = useFollowing(userId);

  const isOwnProfile = userId === currentUser?.id;

  const followersCount = Array.isArray(followers) ? followers.length : 0;
  const followingCount = Array.isArray(following) ? following.length : 0;
  const friendsCount = (profileUser?._count?.friendsA ?? 0) + (profileUser?._count?.friendsB ?? 0);
  const postsCount = profileUser?._count?.posts ?? 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse">
          <div className="h-56 bg-muted" />
          <div className="relative px-4 sm:px-6 pb-4 -mt-16 space-y-3">
            <div className="h-32 w-32 rounded-full bg-muted border-4 border-card" />
            <div className="h-6 w-48 bg-muted rounded" />
            <div className="h-4 w-32 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>User not found</p>
      </div>
    );
  }

  const handleFollow = () => {
    followMutation.mutate(userId);
  };

  const handleUnfollow = () => {
    unfollowMutation.mutate(userId);
  };

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
                <AvatarImage src={profileUser.avatar ?? undefined} />
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
                {profileUser.role === UserRole.TEACHER && (
                  <Badge variant="secondary" className="text-xs">Teacher</Badge>
                )}
              </div>
              {profileUser.bio && <p className="text-sm text-muted-foreground">{profileUser.bio}</p>}
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
                    variant="outline"
                    onClick={handleFollow}
                    disabled={followMutation.isPending || unfollowMutation.isPending}
                  >
                    {followers.some((f: any) => f.followerId === currentUser?.id) ? (
                      <>
                        <UserMinus className="h-4 w-4 mr-1" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-1" />
                        Follow
                      </>
                    )}
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
            {profileUser.department && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {profileUser.department}
              </div>
            )}
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Joined {formatDate(profileUser.createdAt)}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            <div className="text-center p-3 rounded-xl bg-muted/50">
              <p className="text-xl font-bold text-primary">{formatNumber(postsCount)}</p>
              <p className="text-xs text-muted-foreground">Posts</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-muted/50">
              <p className="text-xl font-bold text-secondary">{formatNumber(followersCount)}</p>
              <p className="text-xs text-muted-foreground">Followers</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-muted/50">
              <p className="text-xl font-bold text-accent">{formatNumber(followingCount)}</p>
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
                <span className="capitalize">{profileUser.role?.toLowerCase()}</span>
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
                <span>{formatNumber(profileUser.coins)}</span>
              </div>
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
              <div className="text-center py-8 text-muted-foreground">
                <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Posts will appear here</p>
              </div>
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
                <h3 className="text-lg font-semibold mb-4">Friends ({friendsCount})</h3>
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Friends list will appear here</p>
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
