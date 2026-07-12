"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  UserPlus,
  UserCheck,
  Search,
  UserMinus,
  MessageSquare,
  MoreHorizontal,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockUsers } from "@/lib/mock-data";
import { getInitials } from "@/lib/utils";

export default function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [friendRequests, setFriendRequests] = useState(
    mockUsers.slice(0, 3).map((u) => ({ ...u, requestStatus: "pending" as const }))
  );
  const [friends, setFriends] = useState(mockUsers.slice(0, 8));
  const [suggestions, setSuggestions] = useState(mockUsers.slice(8, 16));

  const handleAcceptRequest = (userId: string) => {
    const user = friendRequests.find((r) => r.id === userId);
    if (user) {
      setFriends((prev) => [user, ...prev]);
      setFriendRequests((prev) => prev.filter((r) => r.id !== userId));
    }
  };

  const handleDeclineRequest = (userId: string) => {
    setFriendRequests((prev) => prev.filter((r) => r.id !== userId));
  };

  const handleAddFriend = (userId: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== userId));
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Friends
          </h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">
              All Friends
              <Badge variant="outline" className="ml-1 text-[10px]">{friends.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="requests">
              Requests
              {friendRequests.length > 0 && (
                <Badge variant="destructive" className="ml-1 text-[10px]">{friendRequests.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {friends
                .filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((friend, i) => (
                <motion.div
                  key={friend.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <Link href={`/profile/${friend.id}`} className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={friend.avatar} />
                        <AvatarFallback className="bg-primary/20 text-primary">{getInitials(friend.name)}</AvatarFallback>
                      </Avatar>
                      {friend.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-success border-2 border-card" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{friend.name}</p>
                      <p className="text-xs text-muted-foreground">{friend.friendsCount} friends</p>
                    </div>
                  </Link>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon-sm">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="requests" className="mt-4">
            {friendRequests.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <UserCheck className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No pending friend requests</p>
              </div>
            ) : (
              <div className="space-y-2">
                {friendRequests.map((request, i) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/30"
                  >
                    <Link href={`/profile/${request.id}`} className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={request.avatar} />
                        <AvatarFallback className="bg-primary/20 text-primary">{getInitials(request.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{request.name}</p>
                        <p className="text-xs text-muted-foreground">Wants to be your friend</p>
                      </div>
                    </Link>
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={() => handleAcceptRequest(request.id)}>
                        Accept
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeclineRequest(request.id)}>
                        Decline
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="suggestions" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {suggestions.map((suggestion, i) => (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/30"
                >
                  <Link href={`/profile/${suggestion.id}`} className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={suggestion.avatar} />
                      <AvatarFallback className="bg-primary/20 text-primary">{getInitials(suggestion.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{suggestion.name}</p>
                      <p className="text-xs text-muted-foreground">{suggestion.friendsCount} mutual friends</p>
                    </div>
                  </Link>
                  <Button size="sm" onClick={() => handleAddFriend(suggestion.id)}>
                    <UserPlus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
