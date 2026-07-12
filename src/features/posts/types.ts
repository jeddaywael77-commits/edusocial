import type { Post } from "@/shared/types";

export interface FeedParams {
  limit?: number;
}

export interface TrendingParams {
  limit?: number;
}

export interface CreatePostData {
  content: string;
  type?: string;
  visibility?: string;
  images?: string[];
  hashtags?: string[];
  groupId?: string;
  courseId?: string;
}

export interface UpdatePostData {
  content?: string;
  visibility?: string;
  images?: string[];
  hashtags?: string[];
}

export interface ReportPostData {
  reason: string;
}

export interface SharePostData {
  groupId?: string;
  courseId?: string;
}

export interface FeedPage {
  data: Post[];
  nextCursor: string | null;
}
