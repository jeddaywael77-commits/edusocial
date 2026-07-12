import { User, Post, Story, Conversation, Message, Group, Course, Notification, CalendarEvent, LeaderboardEntry, TrendingTopic } from "@/types";

const currentUser: User = {
  id: "1",
  name: "Ahmed Benali",
  email: "ahmed@example.com",
  avatar: "",
  coverPhoto: "",
  bio: "Computer Science Student | Passionate about AI and Web Development",
  role: "student",
  isOnline: true,
  lastSeen: new Date().toISOString(),
  school: "Ecole Superieure d'Informatique",
  department: "Computer Science",
  xp: 2450,
  level: 12,
  coins: 350,
  badges: [
    { id: "1", name: "Quick Learner", icon: "🎓", description: "Completed 10 lessons", color: "#3B82F6", earnedAt: "2024-01-15" },
    { id: "2", name: "Helpful", icon: "🤝", description: "Answered 20 questions", color: "#22C55E", earnedAt: "2024-02-10" },
    { id: "3", name: "Streak Master", icon: "🔥", description: "30 day streak", color: "#F59E0B", earnedAt: "2024-03-01" },
  ],
  followersCount: 156,
  followingCount: 89,
  postsCount: 45,
  friendsCount: 234,
  createdAt: "2023-09-01",
};

const mockUsers: User[] = [
  { ...currentUser, id: "2", name: "Sarah Alami", bio: "Mathematics Teacher | PhD in Applied Mathematics", role: "teacher", xp: 8900, level: 34, followersCount: 1243 },
  { ...currentUser, id: "3", name: "Youssef Idrissi", bio: "Physics enthusiast | Research assistant", role: "student", xp: 3200, level: 15 },
  { ...currentUser, id: "4", name: "Fatima Zahra", bio: "AI & Machine Learning | Teaching Assistant", role: "teacher", xp: 6700, level: 28 },
  ...Array.from({ length: 20 }, (_, i) => ({
    ...currentUser,
    id: `user-${i}`,
    name: ["Omar", "Salma", "Karim", "Nadia", "Hassan", "Leila", "Mehdi", "Amina"][i % 8] + " " + ["BenAli", "Tazi", "Chakir", "Idrissi"][i % 4],
    role: i % 3 === 0 ? "teacher" as const : "student" as const,
    bio: "Student at ESI",
    xp: Math.floor(Math.random() * 5000),
    level: Math.floor(Math.random() * 20) + 1,
  })),
];

const mockPosts: Post[] = [
  {
    id: "1",
    author: mockUsers[1],
    content: "Today we covered the fundamentals of Calculus III. The chain rule for multivariable functions is crucial for understanding gradient descent in machine learning. I've uploaded the lecture notes. Make sure to review sections 3.2 and 3.3 before next class! 📐",
    images: [],
    type: "lesson",
    likes: 45,
    comments: [],
    commentsCount: 12,
    shares: 8,
    isLiked: false,
    isSaved: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "2",
    author: mockUsers[2],
    content: "Can someone explain the difference between electromagnetic waves and mechanical waves? I'm confused about the propagation medium requirements.",
    images: [],
    type: "text",
    likes: 12,
    comments: [
      {
        id: "c1",
        author: mockUsers[3],
        content: "Great question! Electromagnetic waves (like light) don't need a medium to travel - they can move through vacuum. Mechanical waves (like sound) require a medium like air or water.",
        likes: 8,
        isLiked: true,
        replies: [],
        createdAt: new Date(Date.now() - 1800000).toISOString(),
      },
    ],
    commentsCount: 5,
    shares: 2,
    isLiked: true,
    isSaved: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "3",
    author: mockUsers[3],
    content: "New AI Workshop announced! We'll be building a complete neural network from scratch using Python. No frameworks - just math and code. Limited to 30 students. Sign up in the comments! 🤖",
    images: [],
    type: "text",
    likes: 67,
    comments: [],
    commentsCount: 23,
    shares: 15,
    isLiked: false,
    isSaved: true,
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: "4",
    author: mockUsers[1],
    content: "Homework Assignment #5: Solve problems 3.1 through 3.8 from the textbook. Due date: Friday, March 15th. Show all work for full credit.",
    images: [],
    type: "assignment",
    assignment: {
      id: "a1",
      title: "Calculus III - Problem Set #5",
      description: "Complete problems 3.1 through 3.8",
      dueDate: "2024-03-15",
      maxScore: 100,
      attachments: [],
    },
    likes: 8,
    comments: [],
    commentsCount: 3,
    shares: 4,
    isLiked: false,
    isSaved: false,
    createdAt: new Date(Date.now() - 28800000).toISOString(),
  },
  {
    id: "5",
    author: mockUsers[4],
    content: "Just published my research paper on Transformer architectures for natural language processing in low-resource languages. Check it out and let me know your thoughts! 🔬",
    images: [],
    type: "text",
    likes: 89,
    comments: [],
    commentsCount: 18,
    shares: 32,
    isLiked: true,
    isSaved: false,
    createdAt: new Date(Date.now() - 43200000).toISOString(),
  },
];

const mockStories: Story[] = mockUsers.slice(0, 8).map((user, i) => ({
  id: `story-${i}`,
  author: user,
  image: "",
  text: ["Math Lecture", "Physics Lab", "AI Project", "Study Group", "Campus Life", "New Course", "Quiz Time", "Team Work"][i],
  viewers: [],
  createdAt: new Date(Date.now() - i * 3600000).toISOString(),
}));

const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    type: "private",
    participants: [mockUsers[1]],
    lastMessage: { id: "m1", sender: mockUsers[1], content: "See you in class tomorrow!", type: "text", isRead: false, createdAt: new Date(Date.now() - 300000).toISOString() },
    unreadCount: 2,
    updatedAt: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: "conv-2",
    type: "private",
    participants: [mockUsers[2]],
    lastMessage: { id: "m2", sender: mockUsers[2], content: "Thanks for the help with the assignment!", type: "text", isRead: true, createdAt: new Date(Date.now() - 3600000).toISOString() },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "conv-3",
    type: "group",
    name: "AI Club",
    participants: mockUsers.slice(0, 5),
    lastMessage: { id: "m3", sender: mockUsers[3], content: "Meeting at 3pm in room 204", type: "text", isRead: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
    unreadCount: 5,
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "conv-4",
    type: "group",
    name: "Study Group - Calculus",
    participants: [currentUser, mockUsers[1], mockUsers[2]],
    lastMessage: { id: "m4", sender: currentUser, content: "I found a great YouTube video on integrals", type: "text", isRead: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const mockGroups: Group[] = [
  { id: "g1", name: "ESI Computer Science", description: "Official group for CS students", cover: "", type: "school", membersCount: 2450, postsCount: 340, isJoined: true, admin: mockUsers[1], createdAt: "2023-01-01" },
  { id: "g2", name: "Programming Club", description: "Learn, code, and compete", cover: "", type: "club", membersCount: 340, postsCount: 120, isJoined: true, admin: mockUsers[3], createdAt: "2023-02-15" },
  { id: "g3", name: "Mathematics Club", description: "For math enthusiasts", cover: "", type: "club", membersCount: 180, postsCount: 89, isJoined: false, admin: mockUsers[1], createdAt: "2023-03-10" },
  { id: "g4", name: "Physics Club", description: "Exploring the laws of nature", cover: "", type: "club", membersCount: 120, postsCount: 56, isJoined: false, admin: mockUsers[2], createdAt: "2023-04-05" },
  { id: "g5", name: "AI & ML Club", description: "Artificial Intelligence study group", cover: "", type: "club", membersCount: 280, postsCount: 145, isJoined: true, admin: mockUsers[3], createdAt: "2023-05-20" },
  { id: "g6", name: "Section A - CS3", description: "Classroom group for Section A", cover: "", type: "classroom", membersCount: 45, postsCount: 78, isJoined: true, admin: mockUsers[1], createdAt: "2023-09-01" },
];

const mockCourses: Course[] = [
  { id: "c1", title: "Calculus III", description: "Multivariable calculus, vector analysis, and applications", thumbnail: "", teacher: mockUsers[1], lessonsCount: 24, studentsCount: 156, rating: 4.8, category: "Mathematics", level: "intermediate", isEnrolled: true, progress: 65, createdAt: "2023-09-01" },
  { id: "c2", title: "Introduction to AI", description: "Fundamentals of artificial intelligence and machine learning", thumbnail: "", teacher: mockUsers[3], lessonsCount: 18, studentsCount: 234, rating: 4.9, category: "Computer Science", level: "beginner", isEnrolled: true, progress: 40, createdAt: "2023-09-01" },
  { id: "c3", title: "Quantum Mechanics", description: "Introduction to quantum theory and its applications", thumbnail: "", teacher: mockUsers[2], lessonsCount: 20, studentsCount: 89, rating: 4.7, category: "Physics", level: "advanced", isEnrolled: false, createdAt: "2023-09-01" },
  { id: "c4", title: "Data Structures", description: "Arrays, trees, graphs, and algorithm analysis", thumbnail: "", teacher: mockUsers[4], lessonsCount: 30, studentsCount: 198, rating: 4.6, category: "Computer Science", level: "intermediate", isEnrolled: false, createdAt: "2023-09-01" },
  { id: "c5", title: "Linear Algebra", description: "Vector spaces, matrices, and linear transformations", thumbnail: "", teacher: mockUsers[1], lessonsCount: 22, studentsCount: 167, rating: 4.5, category: "Mathematics", level: "intermediate", isEnrolled: true, progress: 80, createdAt: "2023-09-01" },
];

const mockNotifications: Notification[] = [
  { id: "n1", type: "friend_request", title: "New Friend Request", message: "Omar Tazi wants to be your friend", isRead: false, createdAt: new Date(Date.now() - 300000).toISOString() },
  { id: "n2", type: "comment", title: "New Comment", message: "Sarah Alami commented on your post", isRead: false, createdAt: new Date(Date.now() - 1800000).toISOString() },
  { id: "n3", type: "homework", title: "Homework Due Soon", message: "Calculus III Problem Set is due tomorrow", isRead: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "n4", type: "like", title: "New Like", message: "Youssef Idrissi liked your post", isRead: true, createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: "n5", type: "exam", title: "Exam Scheduled", message: "Midterm exam for Linear Algebra on March 20th", isRead: true, createdAt: new Date(Date.now() - 14400000).toISOString() },
  { id: "n6", type: "message", title: "New Message", message: "Fatima Zahra sent you a message", isRead: true, createdAt: new Date(Date.now() - 28800000).toISOString() },
];

const mockCalendarEvents: CalendarEvent[] = [
  { id: "e1", title: "Calculus III - Problem Set Due", description: "Submit problems 3.1-3.8", date: "2024-03-15", time: "23:59", type: "homework", color: "#3B82F6" },
  { id: "e2", title: "AI Workshop", description: "Neural Network from Scratch", date: "2024-03-16", time: "14:00", endTime: "17:00", type: "live_class", color: "#8B5CF6" },
  { id: "e3", title: "Linear Algebra Midterm", description: "Chapters 1-5", date: "2024-03-20", time: "09:00", endTime: "12:00", type: "exam", color: "#EF4444" },
  { id: "e4", title: "AI Club Meeting", description: "Weekly meeting", date: "2024-03-14", time: "15:00", type: "event", color: "#22C55E" },
  { id: "e5", title: "Physics Lab", description: "Optics experiment", date: "2024-03-17", time: "10:00", endTime: "12:00", type: "live_class", color: "#06B6D4" },
];

const mockLeaderboard: LeaderboardEntry[] = [
  { user: mockUsers[3], xp: 8900, rank: 1 },
  { user: mockUsers[1], xp: 7200, rank: 2 },
  { user: mockUsers[4], xp: 6800, rank: 3 },
  { user: { ...currentUser, id: "1" }, xp: 2450, rank: 4 },
  { user: mockUsers[2], xp: 2100, rank: 5 },
];

const mockTrending: TrendingTopic[] = [
  { id: "t1", title: "Calculus III - Midterm Prep", postsCount: 45, category: "Mathematics" },
  { id: "t2", title: "AI Workshop 2024", postsCount: 34, category: "Technology" },
  { id: "t3", title: "Physics Lab Report Tips", postsCount: 28, category: "Physics" },
  { id: "t4", title: "Python for Data Science", postsCount: 56, category: "Programming" },
  { id: "t5", title: "Study Group Formation", postsCount: 19, category: "General" },
];

export {
  currentUser,
  mockUsers,
  mockPosts,
  mockStories,
  mockConversations,
  mockGroups,
  mockCourses,
  mockNotifications,
  mockCalendarEvents,
  mockLeaderboard,
  mockTrending,
};
