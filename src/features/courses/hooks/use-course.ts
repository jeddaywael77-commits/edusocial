import { useCourse as useApiCourse } from "@/api/courses";
export function useCourse(id: string) { return useApiCourse(id); }
