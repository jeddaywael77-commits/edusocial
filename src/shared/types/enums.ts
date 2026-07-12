export const UserRole = {
  STUDENT: "STUDENT",
  TEACHER: "TEACHER",
  ADMIN: "ADMIN",
  MODERATOR: "MODERATOR",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const PostType = {
  TEXT: "TEXT",
  IMAGE: "IMAGE",
  VIDEO: "VIDEO",
  PDF: "PDF",
  ASSIGNMENT: "ASSIGNMENT",
  QUIZ: "QUIZ",
  LESSON: "LESSON",
  POLL: "POLL",
} as const;

export type PostType = (typeof PostType)[keyof typeof PostType];

export const PostVisibility = {
  PUBLIC: "PUBLIC",
  FRIENDS: "FRIENDS",
  GROUP: "GROUP",
  COURSE: "COURSE",
  PRIVATE: "PRIVATE",
} as const;

export type PostVisibility =
  (typeof PostVisibility)[keyof typeof PostVisibility];

export const PostStatus = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
} as const;

export type PostStatus = (typeof PostStatus)[keyof typeof PostStatus];

export const ReactionType = {
  LIKE: "LIKE",
  LOVE: "LOVE",
  CARE: "CARE",
  HAHA: "HAHA",
  WOW: "WOW",
  SAD: "SAD",
  ANGRY: "ANGRY",
} as const;

export type ReactionType = (typeof ReactionType)[keyof typeof ReactionType];

export const FriendRequestStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  DECLINED: "DECLINED",
} as const;

export type FriendRequestStatus =
  (typeof FriendRequestStatus)[keyof typeof FriendRequestStatus];

export const GroupType = {
  SCHOOL: "SCHOOL",
  CLASSROOM: "CLASSROOM",
  CLUB: "CLUB",
} as const;

export type GroupType = (typeof GroupType)[keyof typeof GroupType];

export const CourseLevel = {
  BEGINNER: "BEGINNER",
  INTERMEDIATE: "INTERMEDIATE",
  ADVANCED: "ADVANCED",
} as const;

export type CourseLevel = (typeof CourseLevel)[keyof typeof CourseLevel];

export const SubmissionStatus = {
  PENDING: "PENDING",
  SUBMITTED: "SUBMITTED",
  GRADED: "GRADED",
  LATE: "LATE",
} as const;

export type SubmissionStatus =
  (typeof SubmissionStatus)[keyof typeof SubmissionStatus];

export const NotificationType = {
  FRIEND_REQUEST: "FRIEND_REQUEST",
  MESSAGE: "MESSAGE",
  HOMEWORK: "HOMEWORK",
  EXAM: "EXAM",
  COMMENT: "COMMENT",
  LIKE: "LIKE",
  AI_TASK: "AI_TASK",
  GROUP: "GROUP",
  COURSE: "COURSE",
} as const;

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

export const CalendarEventType = {
  HOMEWORK: "HOMEWORK",
  EXAM: "EXAM",
  EVENT: "EVENT",
  LIVE_CLASS: "LIVE_CLASS",
} as const;

export type CalendarEventType =
  (typeof CalendarEventType)[keyof typeof CalendarEventType];

export const MediaStatus = {
  UPLOADING: "UPLOADING",
  PROCESSING: "PROCESSING",
  READY: "READY",
  FAILED: "FAILED",
} as const;

export type MediaStatus = (typeof MediaStatus)[keyof typeof MediaStatus];

export const MediaCategory = {
  AVATAR: "AVATAR",
  COVER_PHOTO: "COVER_PHOTO",
  STORY_IMAGE: "STORY_IMAGE",
  STORY_VIDEO: "STORY_VIDEO",
  POST_IMAGE: "POST_IMAGE",
  POST_VIDEO: "POST_VIDEO",
  POST_PDF: "POST_PDF",
  POST_DOCUMENT: "POST_DOCUMENT",
  ASSIGNMENT_FILE: "ASSIGNMENT_FILE",
  HOMEWORK_FILE: "HOMEWORK_FILE",
  COURSE_MATERIAL: "COURSE_MATERIAL",
  COURSE_THUMBNAIL: "COURSE_THUMBNAIL",
  MARKETPLACE_IMAGE: "MARKETPLACE_IMAGE",
  AI_GENERATED: "AI_GENERATED",
  MESSAGE_ATTACHMENT: "MESSAGE_ATTACHMENT",
  CHAT_FILE: "CHAT_FILE",
} as const;

export type MediaCategory = (typeof MediaCategory)[keyof typeof MediaCategory];
