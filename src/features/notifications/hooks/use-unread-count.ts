import { useUnreadCount as useApiUnreadCount } from "@/api/notifications";
export function useUnreadCount() { return useApiUnreadCount(); }
