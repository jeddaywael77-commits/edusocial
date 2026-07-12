import type { Group } from "@/shared/types";

export function isSchoolGroup(group: Group): boolean {
  return group.type === "SCHOOL";
}

export function isClassroomGroup(group: Group): boolean {
  return group.type === "CLASSROOM";
}

export function isClubGroup(group: Group): boolean {
  return group.type === "CLUB";
}

export function getMemberCount(group: Group): number {
  return group._count?.members ?? 0;
}

export function getPostCount(group: Group): number {
  return group._count?.posts ?? 0;
}

export function isGroupMember(group: Group, userId: string): boolean {
  return group.members?.some((m) => m.userId === userId) ?? false;
}

export function isGroupCreator(group: Group, userId: string): boolean {
  return group.creatorId === userId;
}

export function isGroupAdmin(group: Group, userId: string): boolean {
  return group.members?.some((m) => m.userId === userId && m.role === "ADMIN") ?? false;
}

export function getGroupTypeIcon(type: string): string {
  switch (type) {
    case "SCHOOL":
      return "school";
    case "CLASSROOM":
      return "book-open";
    case "CLUB":
      return "users";
    default:
      return "users";
  }
}
