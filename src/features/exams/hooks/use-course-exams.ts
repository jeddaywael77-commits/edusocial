import { useCourseExams as useApiCourseExams } from "@/api/exams";
export function useCourseExams(courseId: string) { return useApiCourseExams(courseId); }
