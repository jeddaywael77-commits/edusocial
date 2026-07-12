import type { Course } from "@/shared/types";

export function isBeginnerCourse(course: Course): boolean {
  return course.level === "BEGINNER";
}

export function isIntermediateCourse(course: Course): boolean {
  return course.level === "INTERMEDIATE";
}

export function isAdvancedCourse(course: Course): boolean {
  return course.level === "ADVANCED";
}

export function isPublished(course: Course): boolean {
  return course.isPublished;
}

export function getLessonCount(course: Course): number {
  return course._count?.lessons ?? 0;
}

export function getEnrollmentCount(course: Course): number {
  return course._count?.enrollments ?? 0;
}

export function getCourseLevelColor(level: string): string {
  switch (level) {
    case "BEGINNER":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "INTERMEDIATE":
      return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case "ADVANCED":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
}
