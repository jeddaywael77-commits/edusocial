"use client";

import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Video,
  Users,
  Plus,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { useCalendarEvents } from "@/features/calendar";
import type { CalendarEvent } from "@/shared/types";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { data: events = [], isLoading } = useCalendarEvents();
  
  const today = new Date();
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1));

  const eventIcon = (type: string) => {
    switch (type) {
      case "HOMEWORK": return <FileText className="h-3 w-3" />;
      case "EXAM": return <FileText className="h-3 w-3" />;
      case "LIVE_CLASS": return <Video className="h-3 w-3" />;
      case "EVENT": return <Users className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const getEventColor = (event: CalendarEvent) => {
    if (event.color) return event.color;
    switch (event.type) {
      case "HOMEWORK": return "#3B82F6";
      case "EXAM": return "#EF4444";
      case "LIVE_CLASS": return "#8B5CF6";
      case "EVENT": return "#22C55E";
      default: return "#6B7280";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-5 w-5 bg-muted rounded animate-pulse" />
            <div className="h-6 w-32 bg-muted rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-7 gap-px bg-border rounded-xl overflow-hidden">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="bg-card p-2 min-h-[60px] animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Calendar
          </h1>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Event
          </Button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{months[month]} {year}</h2>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-border rounded-xl overflow-hidden mb-4">
          {daysOfWeek.map((day) => (
            <div key={day} className="bg-muted p-2 text-center text-xs font-medium text-muted-foreground">
              {day}
            </div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-card p-2 min-h-[60px]" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const dayEvents = events.filter((e) => e.date === dateStr);
            const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

            return (
              <div key={day} className={`bg-card p-2 min-h-[60px] ${isToday ? "bg-primary/5" : ""}`}>
                <span className={`text-xs font-medium ${isToday ? "bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center" : ""}`}>
                  {day}
                </span>
                <div className="mt-1 space-y-0.5">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className="text-[10px] px-1 py-0.5 rounded truncate flex items-center gap-0.5"
                      style={{ backgroundColor: `${getEventColor(event)}20`, color: getEventColor(event) }}
                    >
                      {eventIcon(event.type)}
                      <span className="truncate">{event.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="font-semibold mb-3">Upcoming Events</h3>
        <div className="space-y-2">
          {events.sort((a, b) => a.date.localeCompare(b.date)).map((event) => (
            <div key={event.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
              <div className="w-1 h-10 rounded-full" style={{ backgroundColor: getEventColor(event) }} />
              <div className="flex-1">
                <p className="text-sm font-medium">{event.title}</p>
                {event.description && <p className="text-xs text-muted-foreground">{event.description}</p>}
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{event.date}</p>
                <p className="text-xs text-muted-foreground">{event.startTime}</p>
              </div>
              <Badge variant="outline" className="text-[10px] capitalize">{event.type.replace("_", " ").toLowerCase()}</Badge>
            </div>
          ))}
          {events.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No upcoming events</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
