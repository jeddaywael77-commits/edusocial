import type { CalendarEvent } from "@/shared/types";

export function isHomeworkEvent(event: CalendarEvent): boolean {
  return event.type === "HOMEWORK";
}

export function isExamEvent(event: CalendarEvent): boolean {
  return event.type === "EXAM";
}

export function isLiveClassEvent(event: CalendarEvent): boolean {
  return event.type === "LIVE_CLASS";
}

export function isGeneralEvent(event: CalendarEvent): boolean {
  return event.type === "EVENT";
}

export function getEventColor(event: CalendarEvent): string {
  if (event.color) return event.color;
  switch (event.type) {
    case "HOMEWORK":
      return "#3B82F6";
    case "EXAM":
      return "#EF4444";
    case "LIVE_CLASS":
      return "#8B5CF6";
    default:
      return "#06B6D4";
  }
}

export function isEventPast(event: CalendarEvent): boolean {
  const eventDate = new Date(event.date);
  const now = new Date();
  return eventDate < now;
}

export function isEventToday(event: CalendarEvent): boolean {
  const eventDate = new Date(event.date);
  const now = new Date();
  return eventDate.toDateString() === now.toDateString();
}

export function isEventUpcoming(event: CalendarEvent): boolean {
  const eventDate = new Date(event.date);
  const now = new Date();
  const diffMs = eventDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays > 0 && diffDays <= 7;
}

export function formatEventDate(event: CalendarEvent): string {
  const date = new Date(event.date);
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export function formatEventTime(event: CalendarEvent): string {
  return event.startTime || "";
}
