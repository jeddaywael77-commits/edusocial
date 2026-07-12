import { useAssignment as useApiAssignment } from "@/api/assignments";
export function useAssignment(id: string) { return useApiAssignment(id); }
