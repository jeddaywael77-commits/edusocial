import { useGroup as useApiGroup } from "@/api/groups";
export function useGroup(id: string) { return useApiGroup(id); }
