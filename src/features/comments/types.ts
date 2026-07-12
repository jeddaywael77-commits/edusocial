export interface CreateCommentData {
  content: string;
  parentId?: string;
  mentions?: string[];
}

export interface UpdateCommentData {
  content: string;
}

export interface CommentParams {
  postId: string;
  limit?: number;
}

export interface ReplyParams {
  postId: string;
  commentId: string;
  limit?: number;
}
