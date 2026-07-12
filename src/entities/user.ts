import type { User, UserPublic } from "@/shared/types";
import type { UserRole } from "@/shared/types/enums";

export function isTeacher(user: User | UserPublic): boolean {
  return user.role === "TEACHER";
}

export function isAdmin(user: User | UserPublic): boolean {
  return user.role === "ADMIN";
}

export function isModerator(user: User | UserPublic): boolean {
  return user.role === "MODERATOR";
}

export function isStudent(user: User | UserPublic): boolean {
  return user.role === "STUDENT";
}

export function getDisplayName(user: User | UserPublic): string {
  return user.name || "Anonymous";
}

export function getAvatarUrl(user: User | UserPublic): string {
  return user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3B82F6&color=fff`;
}

export function getRoleBadgeColor(role: UserRole): string {
  switch (role) {
    case "ADMIN":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    case "TEACHER":
      return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    case "MODERATOR":
      return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    default:
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
  }
}

export function getLevelTitle(level: number): string {
  if (level >= 50) return "Legend";
  if (level >= 40) return "Master";
  if (level >= 30) return "Expert";
  if (level >= 20) return "Advanced";
  if (level >= 10) return "Intermediate";
  return "Beginner";
}

export function getXpForNextLevel(currentXp: number, currentLevel: number): number {
  const baseXp = 100;
  const multiplier = 1.5;
  const nextLevelThreshold = Math.floor(baseXp * Math.pow(multiplier, currentLevel));
  return nextLevelThreshold - currentXp;
}

export function getLevelProgress(xp: number, level: number): number {
  const baseXp = 100;
  const multiplier = 1.5;
  const currentThreshold = Math.floor(baseXp * Math.pow(multiplier, level - 1));
  const nextThreshold = Math.floor(baseXp * Math.pow(multiplier, level));
  const xpInLevel = xp - currentThreshold;
  const xpNeeded = nextThreshold - currentThreshold;
  return Math.min(100, Math.max(0, (xpInLevel / xpNeeded) * 100));
}
