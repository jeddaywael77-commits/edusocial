import type { Post } from "@/shared/types";
import type { PostVisibility } from "@/shared/types/enums";

export function isTextPost(post: Post): boolean {
  return post.type === "TEXT";
}

export function isImagePost(post: Post): boolean {
  return post.type === "IMAGE";
}

export function isVideoPost(post: Post): boolean {
  return post.type === "VIDEO";
}

export function isPdfPost(post: Post): boolean {
  return post.type === "PDF";
}

export function isPollPost(post: Post): boolean {
  return post.type === "POLL";
}

export function hasImages(post: Post): boolean {
  return post.images.length > 0;
}

export function hasVideo(post: Post): boolean {
  return !!post.video;
}

export function hasPdf(post: Post): boolean {
  return !!post.pdfUrl;
}

export function getReactionCount(post: Post): number {
  return post._count?.reactions ?? 0;
}

export function getCommentCount(post: Post): number {
  return post._count?.comments ?? 0;
}

export function getShareCount(post: Post): number {
  return post._count?.shares ?? 0;
}

export function getSaveCount(post: Post): number {
  return post._count?.saves ?? 0;
}

export function isPostAuthor(post: Post, userId: string): boolean {
  return post.authorId === userId;
}

export function canEditPost(post: Post, userId: string): boolean {
  return post.authorId === userId;
}

export function canDeletePost(post: Post, userId: string, isAdmin: boolean): boolean {
  return post.authorId === userId || isAdmin;
}

export function getPostTimeAgo(createdAt: string): string {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now.getTime() - created.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);

  if (diffMonth > 0) return `${diffMonth}mo`;
  if (diffWeek > 0) return `${diffWeek}w`;
  if (diffDay > 0) return `${diffDay}d`;
  if (diffHr > 0) return `${diffHr}h`;
  if (diffMin > 0) return `${diffMin}m`;
  return "now";
}

export function extractHashtags(content: string): string[] {
  const regex = /#[\w\u0590-\u05FF]+/g;
  return content.match(regex) ?? [];
}

export function extractMentions(content: string): string[] {
  const regex = /@[\w.]+/g;
  return content.match(regex) ?? [];
}

export function formatContent(content: string): string {
  return content
    .replace(/#([\w\u0590-\u05FF]+)/g, '<span class="text-blue-400 font-semibold">#$1</span>')
    .replace(/@([\w.]+)/g, '<span class="text-blue-400 font-semibold">@$1</span>');
}

export function getVisibilityIcon(visibility: PostVisibility): string {
  switch (visibility) {
    case "PUBLIC":
      return "globe";
    case "FRIENDS":
      return "users";
    case "GROUP":
      return "user-check";
    case "COURSE":
      return "book-open";
    case "PRIVATE":
      return "lock";
    default:
      return "globe";
  }
}
