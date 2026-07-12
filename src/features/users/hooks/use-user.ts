import { useUser as useApiUser } from "@/api/users";

export function useUser(id: string) {
  return useApiUser(id);
}
