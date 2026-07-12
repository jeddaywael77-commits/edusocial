export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
}

export enum PostType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  PDF = 'PDF',
  ASSIGNMENT = 'ASSIGNMENT',
  QUIZ = 'QUIZ',
  LESSON = 'LESSON',
  POLL = 'POLL',
}

export enum PostVisibility {
  PUBLIC = 'PUBLIC',
  FRIENDS = 'FRIENDS',
  GROUP = 'GROUP',
  COURSE = 'COURSE',
  PRIVATE = 'PRIVATE',
}

export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum ReactionType {
  LIKE = 'LIKE',
  LOVE = 'LOVE',
  CARE = 'CARE',
  HAHA = 'HAHA',
  WOW = 'WOW',
  SAD = 'SAD',
  ANGRY = 'ANGRY',
}

export enum FriendRequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}

export enum GroupType {
  SCHOOL = 'SCHOOL',
  CLASSROOM = 'CLASSROOM',
  CLUB = 'CLUB',
}

export enum CourseLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export enum SubmissionStatus {
  PENDING = 'PENDING',
  SUBMITTED = 'SUBMITTED',
  GRADED = 'GRADED',
  LATE = 'LATE',
}

export enum NotificationType {
  FRIEND_REQUEST = 'FRIEND_REQUEST',
  MESSAGE = 'MESSAGE',
  HOMEWORK = 'HOMEWORK',
  EXAM = 'EXAM',
  COMMENT = 'COMMENT',
  LIKE = 'LIKE',
  AI_TASK = 'AI_TASK',
  GROUP = 'GROUP',
  COURSE = 'COURSE',
}

export enum CalendarEventType {
  HOMEWORK = 'HOMEWORK',
  EXAM = 'EXAM',
  EVENT = 'EVENT',
  LIVE_CLASS = 'LIVE_CLASS',
}
