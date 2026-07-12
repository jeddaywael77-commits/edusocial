import { useCalendarRange as useApiCalendarRange } from "@/api/calendar";
export function useCalendarRange(start: string, end: string) { return useApiCalendarRange(start, end); }
