import type { Comment } from "@/shared/types";

export function isTopLevel(comment: Comment): boolean {
  return comment.parentId === null;
}

export function isReply(comment: Comment): boolean {
  return comment.parentId !== null;
}

export function isDeleted(comment: Comment): boolean {
  return comment.isDeleted;
}

export function canEditComment(comment: Comment, userId: string): boolean {
  return comment.authorId === userId && !comment.isDeleted;
}

export function canDeleteComment(comment: Comment, userId: string, isAdmin: boolean): boolean {
  return (comment.authorId === userId || isAdmin) && !comment.isDeleted;
}

export function getCommentDepth(comment: Comment): number {
  return comment.depth ?? 0;
}

export function getReplyCount(comment: Comment): number {
  return comment._count?.replies ?? 0;
}

export function formatCommentContent(content: string): string {
  return content
    .replace(/@([\w.]+)/g, '<span class="text-blue-400 font-semibold">@$1</span>');
}
