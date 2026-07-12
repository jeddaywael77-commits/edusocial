import { useOnlineUsers as useApiOnlineUsers } from "@/api/users";

export function useOnlineUsers() {
  return useApiOnlineUsers();
}
