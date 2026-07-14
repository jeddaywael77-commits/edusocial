import { UserRole } from "./enums";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  coverPhoto: string | null;
  bio: string | null;
  role: UserRole;
  school: string | null;
  department: string | null;
  xp: number;
  level: number;
  coins: number;
  isOnline: boolean;
  lastSeen: string;
  createdAt: string;
  _count?: UserCounts;
}

export interface UserCounts {
  posts: number;
  followers: number;
  following: number;
  friendsA: number;
  friendsB: number;
}

export interface UserPublic {
  id: string;
  name: string;
  avatar: string | null;
  role: UserRole;
  isOnline: boolean;
  level: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string | null;
  color: string | null;
  xpRequired: number;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: string;
  badge: Badge;
}

export interface Post {
  id: string;
  content: string;
  type: string;
  visibility: string;
  status: string;
  images: string[];
  video: string | null;
  pdfUrl: string | null;
  pdfName: string | null;
  hashtags: string[];
  mentions: string[];
  isPinned: boolean;
  isReported: boolean;
  shareCount: number;
  reportCount: number;
  authorId: string;
  groupId: string | null;
  courseId: string | null;
  createdAt: string;
  updatedAt: string;
  author: UserPublic;
  _count: {
    comments: number;
    reactions: number;
    shares: number;
    saves: number;
  };
  reactions?: PostReactionStatus[];
  saves?: PostSaveStatus[];
}

export interface PostReactionStatus {
  type: string;
}

export interface PostSaveStatus {
  id: string;
}

export interface PostWithDetails extends Post {
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  parentId: string | null;
  depth: number;
  isDeleted: boolean;
  isEdited: boolean;
  mentions: string[];
  createdAt: string;
  updatedAt: string;
  author: UserPublic;
  replies?: Comment[];
  _count?: {
    replies: number;
    reactions: number;
  };
  reactions?: CommentReactionStatus[];
}

export interface CommentReactionStatus {
  type: string;
}

export interface Story {
  id: string;
  authorId: string;
  image: string;
  text: string | null;
  expiresAt: string;
  createdAt: string;
  author: UserPublic;
  _count?: {
    viewers: number;
  };
  viewers?: StoryViewer[];
}

export interface StoryViewer {
  id: string;
  userId: string;
  storyId: string;
  viewedAt: string;
  user: { id: string; name: string };
}

export interface Conversation {
  id: string;
  name: string | null;
  isGroup: boolean;
  createdAt: string;
  updatedAt: string;
  participants: ConversationParticipant[];
  lastMessage?: Message;
}

export interface ConversationParticipant {
  id: string;
  userId: string;
  conversationId: string;
  user: UserPublic;
}

export interface Message {
  id: string;
  content: string;
  type: string;
  fileUrl: string | null;
  fileName: string | null;
  isRead: boolean;
  senderId: string;
  conversationId: string;
  createdAt: string;
  sender: UserPublic;
}

export interface Group {
  id: string;
  name: string;
  description: string | null;
  cover: string | null;
  type: string;
  creatorId: string;
  createdAt: string;
  _count?: {
    members: number;
    posts: number;
  };
  members?: GroupMember[];
}

export interface GroupMember {
  id: string;
  userId: string;
  groupId: string;
  role: string;
  user: UserPublic;
}

export interface Course {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  category: string;
  level: string;
  isPublished: boolean;
  teacherId: string;
  createdAt: string;
  teacher: UserPublic;
  _count?: {
    lessons: number;
    enrollments: number;
  };
}

export interface Lesson {
  id: string;
  title: string;
  content: string | null;
  videoUrl: string | null;
  pdfUrl: string | null;
  duration: number | null;
  order: number;
  isPublished: boolean;
  courseId: string;
  createdAt: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string | null;
  dueDate: string;
  maxScore: number;
  courseId: string | null;
  authorId: string;
  createdAt: string;
}

export interface Submission {
  id: string;
  content: string | null;
  fileUrl: string | null;
  status: string;
  score: number | null;
  feedback: string | null;
  gradedAt: string | null;
  studentId: string;
  assignmentId: string;
  createdAt: string;
  student: UserPublic;
  assignment: { id: string; title: string };
}

export interface Exam {
  id: string;
  title: string;
  description: string | null;
  timeLimit: number;
  dueDate: string;
  questions: unknown;
  courseId: string;
  authorId: string;
  createdAt: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnail: string | null;
  tags: string[];
  userId: string;
  createdAt: string;
  user: UserPublic;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  receiverId: string;
  senderId: string | null;
  createdAt: string;
  sender?: UserPublic;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  date: string;
  startTime: string;
  endTime: string | null;
  type: string;
  color: string | null;
  courseId: string | null;
  userId: string;
  createdAt: string;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  images: string[];
  category: string;
  condition: string;
  isAvailable: boolean;
  sellerId: string;
  createdAt: string;
  seller: UserPublic;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string | null;
  xp: number;
  level: number;
  coins: number;
  badges: UserBadge[];
}

export interface GamificationStats {
  totalXp: number;
  level: number;
  coins: number;
  badgeCount: number;
  postCount: number;
}

export interface Media {
  id: string;
  ownerId: string;
  category: string;
  storageProvider: string;
  bucket: string | null;
  key: string;
  url: string;
  mimeType: string;
  extension: string;
  originalName: string | null;
  size: number;
  width: number | null;
  height: number | null;
  duration: number | null;
  checksum: string | null;
  thumbnailUrl: string | null;
  webpUrl: string | null;
  compressedUrl: string | null;
  pageCount: number | null;
  metadata: Record<string, any> | null;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  owner?: UserPublic;
}

export interface MediaUploadProgress {
  fileId: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "processing" | "complete" | "error";
  media?: Media;
  error?: string;
  xhr?: XMLHttpRequest;
}

// ─── News ────────────────────────────────────────────────────────────────────

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string | null;
  coverImage: string | null;
  category: string;
  isPublished: boolean;
  viewCount: number;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author?: UserPublic;
  _count?: { comments: number; likes: number };
  isLiked?: boolean;
}

export interface NewsComment {
  id: string;
  content: string;
  authorId: string;
  articleId: string;
  createdAt: string;
  author?: UserPublic;
}

// ─── Events ──────────────────────────────────────────────────────────────────

export interface Event {
  id: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  date: string;
  startTime: string;
  endTime: string | null;
  location: string | null;
  maxAttendees: number | null;
  isPublic: boolean;
  type: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  creator?: UserPublic;
  _count?: { attendees: number };
  isAttending?: boolean;
  attendanceStatus?: string | null;
}

export interface EventAttendee {
  id: string;
  eventId: string;
  userId: string;
  status: string;
  joinedAt: string;
  user?: UserPublic;
}

// ─── Study in Tunisia ────────────────────────────────────────────────────────

export interface Institution {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  coverImage: string | null;
  type: string;
  city: string;
  address: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  programs?: StudyProgram[];
  admissions?: AdmissionInfo[];
  scholarships?: Scholarship[];
  _count?: { programs: number; admissions: number; scholarships: number };
}

export interface StudyProgram {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  field: string;
  level: string;
  duration: string | null;
  language: string;
  tuitionFees: string | null;
  institutionId: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  institution?: Institution;
}

export interface StudyGuide {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string | null;
  coverImage: string | null;
  category: string;
  isPublished: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author?: UserPublic;
}

export interface AdmissionInfo {
  id: string;
  title: string;
  description: string | null;
  institutionId: string;
  deadline: string;
  requirements: string | null;
  isOpen: boolean;
  createdAt: string;
  updatedAt: string;
  institution?: Institution;
}

export interface Scholarship {
  id: string;
  title: string;
  description: string | null;
  institutionId: string | null;
  amount: string | null;
  deadline: string;
  requirements: string | null;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  institution?: Institution;
}

export interface StudyQuestion {
  id: string;
  title: string;
  content: string;
  authorId: string;
  tags: string[];
  viewCount: number;
  answerCount: number;
  createdAt: string;
  updatedAt: string;
  author?: UserPublic;
  answers?: StudyAnswer[];
  _count?: { answers: number };
}

export interface StudyAnswer {
  id: string;
  content: string;
  authorId: string;
  questionId: string;
  isAccepted: boolean;
  upvotes: number;
  createdAt: string;
  updatedAt: string;
  author?: UserPublic;
}
