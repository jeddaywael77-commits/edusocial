export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const API_TIMEOUT = 15_000;
export const REFRESH_TIMEOUT = 10_000;
export const MAX_RETRIES = 2;
export const RETRY_DELAY_MS = 1_000;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "edusocial_access_token",
  REFRESH_TOKEN: "edusocial_refresh_token",
} as const;

export const QUERY_KEYS = {
  auth: {
    profile: ["auth", "profile"] as const,
  },
  users: {
    all: ["users"] as const,
    detail: (id: string) => ["users", id] as const,
    leaderboard: ["users", "leaderboard"] as const,
    online: ["users", "online"] as const,
  },
  posts: {
    all: ["posts"] as const,
    feed: ["posts", "feed"] as const,
    trending: ["posts", "trending"] as const,
    detail: (id: string) => ["posts", id] as const,
  },
  comments: {
    byPost: (postId: string) => ["posts", postId, "comments"] as const,
    replies: (commentId: string) => ["comments", commentId, "replies"] as const,
  },
  reactions: {
    byPost: (postId: string) => ["reactions", "post", postId] as const,
    byComment: (commentId: string) =>
      ["reactions", "comment", commentId] as const,
  },
  stories: {
    all: ["stories"] as const,
    detail: (id: string) => ["stories", id] as const,
  },
  friends: {
    all: ["friends"] as const,
    requests: ["friends", "requests"] as const,
  },
  followers: {
    byUser: (userId: string) => ["followers", userId] as const,
    following: (userId: string) => ["followers", userId, "following"] as const,
  },
  groups: {
    all: ["groups"] as const,
    detail: (id: string) => ["groups", id] as const,
  },
  courses: {
    all: ["courses"] as const,
    detail: (id: string) => ["courses", id] as const,
    enrollments: (id: string) => ["courses", id, "enrollments"] as const,
  },
  lessons: {
    all: ["lessons"] as const,
    byCourse: (courseId: string) => ["lessons", "course", courseId] as const,
    detail: (id: string) => ["lessons", id] as const,
  },
  assignments: {
    all: ["assignments"] as const,
    detail: (id: string) => ["assignments", id] as const,
  },
  submissions: {
    all: ["submissions"] as const,
    byAssignment: (id: string) =>
      ["submissions", "assignment", id] as const,
    detail: (id: string) => ["submissions", id] as const,
  },
  exams: {
    all: ["exams"] as const,
    byCourse: (courseId: string) => ["exams", "course", courseId] as const,
    detail: (id: string) => ["exams", id] as const,
  },
  documents: {
    all: ["documents"] as const,
    mine: ["documents", "mine"] as const,
    detail: (id: string) => ["documents", id] as const,
  },
  chat: {
    conversations: ["chat", "conversations"] as const,
    messages: (id: string) => ["chat", id, "messages"] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    unread: ["notifications", "unread"] as const,
    unreadCount: ["notifications", "unread", "count"] as const,
  },
  calendar: {
    all: ["calendar"] as const,
    range: (start: string, end: string) =>
      ["calendar", "range", start, end] as const,
    detail: (id: string) => ["calendar", id] as const,
  },
  leaderboard: {
    xp: ["leaderboard", "xp"] as const,
    level: ["leaderboard", "level"] as const,
    myRank: ["leaderboard", "my-rank"] as const,
  },
  gamification: {
    badges: ["gamification", "badges"] as const,
    myBadges: ["gamification", "my-badges"] as const,
    stats: ["gamification", "stats"] as const,
  },
  marketplace: {
    all: ["marketplace"] as const,
    detail: (id: string) => ["marketplace", id] as const,
    bySeller: (sellerId: string) =>
      ["marketplace", "seller", sellerId] as const,
  },
  search: {
    all: ["search"] as const,
    global: (q: string) => ["search", "global", q] as const,
    autocomplete: (q: string) => ["search", "autocomplete", q] as const,
    stats: ["search", "stats"] as const,
  },
  news: {
    all: ["news"] as const,
    latest: ["news", "latest"] as const,
    detail: (id: string) => ["news", id] as const,
    comments: (id: string) => ["news", id, "comments"] as const,
  },
  events: {
    all: ["events"] as const,
    detail: (id: string) => ["events", id] as const,
    attendees: (id: string) => ["events", id, "attendees"] as const,
  },
  studyTunisia: {
    institutions: ["study-tunisia", "institutions"] as const,
    institution: (id: string) => ["study-tunisia", "institutions", id] as const,
    programs: ["study-tunisia", "programs"] as const,
    program: (id: string) => ["study-tunisia", "programs", id] as const,
    guides: ["study-tunisia", "guides"] as const,
    guide: (id: string) => ["study-tunisia", "guides", id] as const,
    admissions: ["study-tunisia", "admissions"] as const,
    admission: (id: string) => ["study-tunisia", "admissions", id] as const,
    scholarships: ["study-tunisia", "scholarships"] as const,
    scholarship: (id: string) => ["study-tunisia", "scholarships", id] as const,
    questions: ["study-tunisia", "questions"] as const,
    question: (id: string) => ["study-tunisia", "questions", id] as const,
  },
} as const;
