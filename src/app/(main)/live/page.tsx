"use client";

import React from "react";
import { motion } from "framer-motion";
import { Video, Calendar, Play, Radio } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { useOnlineUsers } from "@/features/users";
import { getInitials } from "@/shared/lib/utils";

export default function LivePage() {
  const { data: onlineUsers = [] } = useOnlineUsers();
  const teachers = onlineUsers.filter((u) => u.role === "TEACHER").slice(0, 3);

  const liveClasses = teachers.map((teacher, i) => ({
    id: teacher.id,
    title: ["Calculus III - Review Session", "AI Workshop: Neural Networks", "Physics Lab: Optics"][i] || `Live Session with ${teacher.name}`,
    teacher,
    viewers: Math.floor(Math.random() * 100) + 10,
    isLive: i < 2,
    startTime: ["14:00", "15:00", "10:00"][i] || "12:00",
    subject: ["Mathematics", "AI", "Physics"][i] || "General",
    scheduledDate: i >= 2 ? "Tomorrow" : undefined,
  }));

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-4">
        <h1 className="text-xl font-bold flex items-center gap-2 mb-4">
          <Radio className="h-5 w-5 text-destructive" />
          Live Classes
        </h1>

        {liveClasses.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Radio className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No live classes at the moment</p>
          </div>
        ) : (
          <div className="space-y-4">
            {liveClasses
              .filter((c) => c.isLive)
              .map((liveClass, i) => (
              <motion.div
                key={liveClass.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-destructive/30 bg-destructive/5 overflow-hidden"
              >
                <div className="h-48 bg-gradient-to-br from-destructive/20 to-secondary/20 flex items-center justify-center relative">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-3 w-3 rounded-full bg-destructive animate-pulse" />
                    <span className="text-sm font-medium text-destructive">LIVE</span>
                  </div>
                  <Play className="h-16 w-16 text-white/30 absolute" />
                  <Badge className="absolute top-3 right-3" variant="destructive">
                    {liveClass.viewers} watching
                  </Badge>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={liveClass.teacher.avatar ?? undefined} />
                        <AvatarFallback className="bg-primary/20 text-primary text-sm">{getInitials(liveClass.teacher.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{liveClass.title}</h3>
                        <p className="text-xs text-muted-foreground">by {liveClass.teacher.name}</p>
                      </div>
                    </div>
                    <Button>
                      <Video className="h-4 w-4 mr-1" />
                      Join Now
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          Upcoming
        </h3>
        <div className="space-y-2">
          {liveClasses
            .filter((c) => !c.isLive)
            .map((liveClass, i) => (
            <div key={liveClass.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
              <Avatar className="h-10 w-10">
                <AvatarImage src={liveClass.teacher.avatar ?? undefined} />
                <AvatarFallback className="bg-primary/20 text-primary text-sm">{getInitials(liveClass.teacher.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">{liveClass.title}</p>
                <p className="text-xs text-muted-foreground">{liveClass.teacher.name} \u2022 {liveClass.scheduledDate || "Today"} at {liveClass.startTime}</p>
              </div>
              <Badge variant="outline">{liveClass.subject}</Badge>
            </div>
          ))}
          {liveClasses.filter((c) => !c.isLive).length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No upcoming classes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
