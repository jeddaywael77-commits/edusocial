"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock, MapPin, Users, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { useEvent, useToggleEventAttendance, useEventAttendees } from "@/features/events";
import { formatDate, getInitials } from "@/shared/lib/utils";

export default function EventDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: event, isLoading } = useEvent(id);
  const { data: attendees } = useEventAttendees(id);
  const toggleAttendance = useToggleEventAttendance();

  if (isLoading) {
    return <div className="max-w-3xl mx-auto space-y-6"><div className="h-96 rounded-2xl bg-muted animate-pulse" /></div>;
  }

  if (!event) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <p className="text-muted-foreground">Event not found</p>
        <Link href="/events"><Button variant="ghost" className="mt-4">Back to Events</Button></Link>
      </div>
    );
  }

  const isFull = event.maxAttendees ? (event._count?.attendees || 0) >= event.maxAttendees : false;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/events" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Events
      </Link>

      {event.coverImage && (
        <div className="rounded-2xl overflow-hidden h-64">
          <img src={event.coverImage} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant={event.type === "academic" ? "default" : "secondary"}>{event.type}</Badge>
          {event.isAttending && <Badge variant="success">Going</Badge>}
        </div>

        <h1 className="text-3xl font-bold mb-4">{event.title}</h1>

        {event.description && (
          <p className="text-muted-foreground whitespace-pre-wrap mb-6">{event.description}</p>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-muted/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <CalendarDays className="h-4 w-4" />
              Date
            </div>
            <p className="font-medium">{formatDate(event.date)}</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Clock className="h-4 w-4" />
              Time
            </div>
            <p className="font-medium">
              {new Date(event.startTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
              {event.endTime && (
                <> - {new Date(event.endTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</>
              )}
            </p>
          </div>
          {event.location && (
            <div className="p-4 rounded-xl bg-muted/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <MapPin className="h-4 w-4" />
                Location
              </div>
              <p className="font-medium">{event.location}</p>
            </div>
          )}
          <div className="p-4 rounded-xl bg-muted/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Users className="h-4 w-4" />
              Attendees
            </div>
            <p className="font-medium">
              {event._count?.attendees || 0}
              {event.maxAttendees && <span className="text-muted-foreground"> / {event.maxAttendees}</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
          <Avatar>
            <AvatarImage src={event.creator?.avatar ?? undefined} />
            <AvatarFallback>{getInitials(event.creator?.name || "U")}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">Created by {event.creator?.name}</p>
          </div>
        </div>

        <Button
          onClick={() => toggleAttendance.mutate(id)}
          disabled={isFull && !event.isAttending}
          variant={event.isAttending ? "outline" : "default"}
          className="w-full"
          size="lg"
        >
          {event.isAttending ? (
            <>
              <XCircle className="h-4 w-4 mr-2" />
              Cancel Attendance
            </>
          ) : isFull ? (
            "Event is Full"
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Attend Event
            </>
          )}
        </Button>
      </div>

      {attendees && attendees.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Attendees ({attendees.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {attendees.map((a) => (
              <div key={a.id} className="flex items-center gap-2 p-2 rounded-xl bg-muted/50">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={a.user?.avatar ?? undefined} />
                  <AvatarFallback className="text-[10px]">{getInitials(a.user?.name || "U")}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{a.user?.name}</p>
                  <p className="text-[10px] text-muted-foreground">Level {a.user?.level}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
