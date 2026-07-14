"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Clock, Users, Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { useEvents } from "@/features/events";
import { formatDate, getInitials } from "@/shared/lib/utils";

export default function EventsPage() {
  const { data, isLoading } = useEvents({ upcoming: true });

  const events = data?.data || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <CalendarDays className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Events</h1>
            <p className="text-sm text-muted-foreground">Upcoming events and activities</p>
          </div>
        </div>
        <Link href="/events/create">
          <Button>
            <Plus className="h-4 w-4 mr-1" />
            Create Event
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16">
          <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No upcoming events</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/events/${event.id}`}>
                <div className="rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/30 transition-all cursor-pointer group h-full">
                  {event.coverImage && (
                    <div className="h-32 bg-muted overflow-hidden">
                      <img src={event.coverImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={event.type === "academic" ? "default" : "secondary"} className="text-[10px]">
                        {event.type}
                      </Badge>
                      {event.isAttending && (
                        <Badge variant="success" className="text-[10px]">Going</Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-1">
                      {event.title}
                    </h3>
                    {event.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{event.description}</p>
                    )}
                    <div className="flex flex-col gap-1.5 mt-3">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(event.startTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          {event.location}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                      <div className="flex items-center gap-1.5">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={event.creator?.avatar ?? undefined} />
                          <AvatarFallback className="text-[8px]">{getInitials(event.creator?.name || "U")}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{event.creator?.name}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        {event._count?.attendees || 0}
                        {event.maxAttendees && <span>/{event.maxAttendees}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
