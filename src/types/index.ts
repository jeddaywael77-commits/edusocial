/**
 * @deprecated Use @/shared/types instead. These types use lowercase role strings
 * and will be replaced by backend-aligned types in Phase 3.
 * Keep until all pages migrate to @/shared/types.
 */
export type UserRole = "student" | "teacher" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  coverPhoto: string;
  bio: string;
  role: UserRole;
  isOnline: boolean;
  lastSeen: string;
  school: string;
  department: string;
  xp: number;
  level: number;
  coins: number;
  badges: Badge[];
  followersCount: number;
  followingCount: number;
  postsCount: number;
  friendsCount: number;
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  earnedAt: string;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  images: string[];
  video?: string;
  pdf?: { name: string; url: string; pages: number };
  type: "text" | "image" | "video" | "pdf" | "assignment" | "quiz" | "lesson";
  assignment?: Assignment;
  quiz?: Quiz;
  likes: number;
  comments: Comment[];
  commentsCount: number;
  shares: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  likes: number;
  isLiked: boolean;
  replies: Comment[];
  createdAt: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  attachments: Attachment[];
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  timeLimit: number;
  dueDate: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface Story {
  id: string;
  author: User;
  image: string;
  text?: string;
  viewers: string[];
  createdAt: string;
}

export interface Message {
  id: string;
  sender: User;
  content: string;
  type: "text" | "image" | "file" | "voice";
  fileUrl?: string;
  fileName?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  type: "private" | "group";
  name?: string;
  avatar?: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  cover: string;
  type: "school" | "classroom" | "club";
  membersCount: number;
  postsCount: number;
  isJoined: boolean;
  admin: User;
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  teacher: User;
  lessonsCount: number;
  studentsCount: number;
  rating: number;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  isEnrolled: boolean;
  progress?: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: "friend_request" | "message" | "homework" | "exam" | "comment" | "like" | "ai_task" | "group" | "course";
  title: string;
  message: string;
  avatar?: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface LeaderboardEntry {
  user: User;
  xp: number;
  rank: number;
}

export interface TrendingTopic {
  id: string;
  title: string;
  postsCount: number;
  category: string;
}

export interface AIChat {
  id: string;
  messages: AIMessage[];
  createdAt: string;
}

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnail?: string;
  tags: string[];
  uploadedBy: User;
  uploadedAt: string;
  version: number;
  versions: DocumentVersion[];
}

export interface DocumentVersion {
  id: string;
  version: number;
  uploadedBy: User;
  uploadedAt: string;
  size: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  endTime?: string;
  type: "homework" | "exam" | "event" | "live_class";
  color: string;
  courseId?: string;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  category: "books" | "electronics" | "courses";
  seller: User;
  condition: "new" | "used";
  createdAt: string;
}
