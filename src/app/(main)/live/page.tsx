"use client";

import React from "react";
import { motion } from "framer-motion";
import { Video, Users, Clock, Calendar, Play, Radio, MonitorPlay } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockUsers } from "@/lib/mock-data";
import { getInitials } from "@/lib/utils";

const liveClasses = [
  { id: "1", title: "Calculus III - Review Session", teacher: mockUsers[1], viewers: 45, isLive: true, startTime: "14:00", subject: "Mathematics" },
  { id: "2", title: "AI Workshop: Neural Networks", teacher: mockUsers[3], viewers: 120, isLive: true, startTime: "15:00", subject: "AI" },
  { id: "3", title: "Physics Lab: Optics", teacher: mockUsers[2], viewers: 0, isLive: false, startTime: "10:00", scheduledDate: "Tomorrow", subject: "Physics" },
];

export default function LivePage() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-4">
        <h1 className="text-xl font-bold flex items-center gap-2 mb-4">
          <Radio className="h-5 w-5 text-destructive" />
          Live Classes
        </h1>

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
                      <AvatarImage src={liveClass.teacher.avatar} />
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
                <AvatarImage src={liveClass.teacher.avatar} />
                <AvatarFallback className="bg-primary/20 text-primary text-sm">{getInitials(liveClass.teacher.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">{liveClass.title}</p>
                <p className="text-xs text-muted-foreground">{liveClass.teacher.name} • {liveClass.scheduledDate || "Today"} at {liveClass.startTime}</p>
              </div>
              <Badge variant="outline">{liveClass.subject}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
