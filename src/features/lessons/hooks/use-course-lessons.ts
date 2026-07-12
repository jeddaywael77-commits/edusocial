import { useCourseLessons as useApiCourseLessons } from "@/api/lessons";
export function useCourseLessons(courseId: string) { return useApiCourseLessons(courseId); }
