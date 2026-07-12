import { useAssignmentSubmissions as useApiAssignmentSubmissions } from "@/api/submissions";
export function useAssignmentSubmissions(assignmentId: string) { return useApiAssignmentSubmissions(assignmentId); }
