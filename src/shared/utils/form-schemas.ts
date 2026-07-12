import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be at most 100 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be at most 128 characters"),
    confirmPassword: z.string(),
    role: z.enum(["STUDENT", "TEACHER"], {
      message: "Please select a role",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const createPostSchema = z.object({
  content: z
    .string()
    .min(1, "Post content is required")
    .max(10000, "Post content must be at most 10000 characters"),
  type: z.enum([
    "TEXT",
    "IMAGE",
    "VIDEO",
    "PDF",
    "ASSIGNMENT",
    "QUIZ",
    "LESSON",
    "POLL",
  ]),
  visibility: z.enum(["PUBLIC", "FRIENDS", "GROUP", "COURSE", "PRIVATE"]),
  hashtags: z.array(z.string()).optional(),
  mentions: z.array(z.string()).optional(),
  groupId: z.string().optional(),
  courseId: z.string().optional(),
});

export type CreatePostFormData = z.infer<typeof createPostSchema>;

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment is required")
    .max(2000, "Comment must be at most 2000 characters"),
  parentCommentId: z.string().optional(),
  mentions: z.array(z.string()).optional(),
});

export type CreateCommentFormData = z.infer<typeof createCommentSchema>;

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .optional(),
  bio: z
    .string()
    .max(500, "Bio must be at most 500 characters")
    .optional(),
  school: z
    .string()
    .max(200, "School must be at most 200 characters")
    .optional(),
  department: z
    .string()
    .max(200, "Department must be at most 200 characters")
    .optional(),
  avatar: z.string().optional(),
  coverPhoto: z.string().optional(),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

export const createGroupSchema = z.object({
  name: z.string().min(1, "Group name is required").max(100),
  description: z.string().max(500).optional(),
  type: z.enum(["SCHOOL", "CLASSROOM", "CLUB"]).optional(),
  cover: z.string().optional(),
});

export type CreateGroupFormData = z.infer<typeof createGroupSchema>;

export const createCourseSchema = z.object({
  title: z.string().min(1, "Course title is required").max(200),
  description: z.string().max(2000).optional(),
  category: z.string().min(1, "Category is required"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
  thumbnail: z.string().optional(),
});

export type CreateCourseFormData = z.infer<typeof createCourseSchema>;

export const createAssignmentSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional(),
  dueDate: z.string().min(1, "Due date is required"),
  maxScore: z.number().min(0).optional(),
  courseId: z.string().optional(),
});

export type CreateAssignmentFormData = z.infer<typeof createAssignmentSchema>;

export const sendMessageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty").max(5000),
  type: z.enum(["text", "image", "file", "voice"]).optional(),
  fileUrl: z.string().optional(),
  fileName: z.string().optional(),
});

export type SendMessageFormData = z.infer<typeof sendMessageSchema>;

export const createCalendarEventSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional(),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().optional(),
  type: z.enum(["HOMEWORK", "EXAM", "EVENT", "LIVE_CLASS"]).optional(),
  color: z.string().optional(),
  courseId: z.string().optional(),
});

export type CreateCalendarEventFormData = z.infer<
  typeof createCalendarEventSchema
>;

export const createMarketplaceItemSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional(),
  price: z.number().min(0, "Price must be positive"),
  category: z.string().min(1, "Category is required"),
  condition: z.enum(["NEW", "USED"]).optional(),
  currency: z.string().optional(),
  images: z.array(z.string()).optional(),
});

export type CreateMarketplaceItemFormData = z.infer<
  typeof createMarketplaceItemSchema
>;

export const reportSchema = z.object({
  reason: z
    .string()
    .min(3, "Reason must be at least 3 characters")
    .max(100, "Reason must be at most 100 characters"),
  details: z.string().max(500).optional(),
});

export type ReportFormData = z.infer<typeof reportSchema>;

export const createDocumentSchema = z.object({
  name: z.string().min(1, "Document name is required"),
  type: z.string().min(1, "Document type is required"),
  size: z.number().min(1),
  url: z.string().url("Valid URL is required"),
  thumbnail: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type CreateDocumentFormData = z.infer<typeof createDocumentSchema>;
