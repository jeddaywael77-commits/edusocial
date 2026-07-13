import { PrismaClient, UserRole, GroupType, CourseLevel, MediaCategory } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function main() {
  console.log('Seeding database...');

  const password = await hashPassword('Password123!');

  // Create users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@edusocial.com' },
    update: {},
    create: {
      email: 'admin@edusocial.com',
      password,
      name: 'Admin User',
      role: UserRole.ADMIN,
      school: 'EduSocial Academy',
      department: 'Administration',
      xp: 1000,
      level: 10,
      coins: 5000,
      emailVerified: true,
    },
  });

  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@edusocial.com' },
    update: {},
    create: {
      email: 'teacher@edusocial.com',
      password,
      name: 'Dr. Sarah Johnson',
      role: UserRole.TEACHER,
      school: 'EduSocial Academy',
      department: 'Computer Science',
      bio: 'Professor of Computer Science with 15 years of experience in AI and machine learning.',
      xp: 500,
      level: 5,
      coins: 2000,
      emailVerified: true,
    },
  });

  const student1 = await prisma.user.upsert({
    where: { email: 'student@edusocial.com' },
    update: {},
    create: {
      email: 'student@edusocial.com',
      password,
      name: 'Alex Chen',
      role: UserRole.STUDENT,
      school: 'EduSocial Academy',
      department: 'Computer Science',
      bio: 'Passionate about web development and open source.',
      xp: 200,
      level: 3,
      coins: 800,
      emailVerified: true,
    },
  });

  const student2 = await prisma.user.upsert({
    where: { email: 'student2@edusocial.com' },
    update: {},
    create: {
      email: 'student2@edusocial.com',
      password,
      name: 'Maria Garcia',
      role: UserRole.STUDENT,
      school: 'EduSocial Academy',
      department: 'Data Science',
      bio: 'Data science enthusiast learning Python and ML.',
      xp: 150,
      level: 2,
      coins: 600,
      emailVerified: true,
    },
  });

  const student3 = await prisma.user.upsert({
    where: { email: 'student3@edusocial.com' },
    update: {},
    create: {
      email: 'student3@edusocial.com',
      password,
      name: 'James Wilson',
      role: UserRole.STUDENT,
      school: 'EduSocial Academy',
      department: 'Mathematics',
      xp: 100,
      level: 1,
      coins: 50,
      emailVerified: true,
    },
  });

  console.log('Users created:', { admin: admin.id, teacher: teacher.id, student1: student1.id, student2: student2.id, student3: student3.id });

  // Create groups
  const csGroup = await prisma.group.create({
    data: {
      name: 'Computer Science Hub',
      description: 'A community for CS students to discuss algorithms, data structures, and programming challenges.',
      type: GroupType.CLUB,
      adminId: teacher.id,
      isPublic: true,
    },
  });

  await prisma.groupMember.createMany({
    data: [
      { groupId: csGroup.id, userId: teacher.id, role: 'admin' },
      { groupId: csGroup.id, userId: student1.id, role: 'member' },
      { groupId: csGroup.id, userId: student2.id, role: 'member' },
    ],
  });

  const studyGroup = await prisma.group.create({
    data: {
      name: 'Study Group Alpha',
      description: 'Weekly study sessions for midterm preparation.',
      type: GroupType.CLASSROOM,
      adminId: student1.id,
      isPublic: true,
    },
  });

  await prisma.groupMember.createMany({
    data: [
      { groupId: studyGroup.id, userId: student1.id, role: 'admin' },
      { groupId: studyGroup.id, userId: student2.id, role: 'member' },
      { groupId: studyGroup.id, userId: student3.id, role: 'member' },
    ],
  });

  console.log('Groups created:', { csGroup: csGroup.id, studyGroup: studyGroup.id });

  // Create courses
  const cs101 = await prisma.course.create({
    data: {
      title: 'Introduction to Computer Science',
      description: 'Fundamentals of computer science including algorithms, data structures, and basic programming concepts.',
      category: 'Computer Science',
      level: CourseLevel.BEGINNER,
      teacherId: teacher.id,
      isPublished: true,
    },
  });

  const mlCourse = await prisma.course.create({
    data: {
      title: 'Machine Learning Fundamentals',
      description: 'Introduction to machine learning algorithms, neural networks, and practical applications.',
      category: 'Artificial Intelligence',
      level: CourseLevel.INTERMEDIATE,
      teacherId: teacher.id,
      isPublished: true,
    },
  });

  // Enroll students
  await prisma.enrollment.createMany({
    data: [
      { courseId: cs101.id, userId: student1.id, progress: 65 },
      { courseId: cs101.id, userId: student2.id, progress: 40 },
      { courseId: mlCourse.id, userId: student1.id, progress: 20 },
      { courseId: mlCourse.id, userId: student2.id, progress: 15 },
    ],
  });

  // Create lessons
  await prisma.lesson.createMany({
    data: [
      { title: 'What is Computer Science?', content: 'An overview of the field of computer science.', order: 1, courseId: cs101.id, authorId: teacher.id, duration: 45, isPublished: true },
      { title: 'Binary and Data Representation', content: 'How computers represent and process data.', order: 2, courseId: cs101.id, authorId: teacher.id, duration: 60, isPublished: true },
      { title: 'Introduction to Algorithms', content: 'Basic algorithm concepts and complexity analysis.', order: 3, courseId: cs101.id, authorId: teacher.id, duration: 75, isPublished: true },
      { title: 'What is Machine Learning?', content: 'Introduction to ML concepts and types.', order: 1, courseId: mlCourse.id, authorId: teacher.id, duration: 50, isPublished: true },
      { title: 'Linear Regression', content: 'Understanding linear regression and gradient descent.', order: 2, courseId: mlCourse.id, authorId: teacher.id, duration: 60, isPublished: true },
    ],
  });

  // Create assignments
  const hw1 = await prisma.assignment.create({
    data: {
      title: 'Hello World Program',
      description: 'Write a program that prints "Hello, World!" in your preferred language.',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      maxScore: 100,
      courseId: cs101.id,
      authorId: teacher.id,
    },
  });

  await prisma.submission.create({
    data: {
      content: 'print("Hello, World!")',
      score: 95,
      feedback: 'Excellent work! Clean and simple solution.',
      status: 'GRADED',
      assignmentId: hw1.id,
      studentId: student1.id,
      gradedAt: new Date(),
    },
  });

  console.log('Courses and assignments created');

  // Create posts
  const post1 = await prisma.post.create({
    data: {
      content: 'Just finished implementing a binary search tree in Python! The recursive approach for insertion is so elegant. Anyone else working on data structures this week?',
      type: 'TEXT',
      authorId: student1.id,
      hashtags: ['coding', 'python', 'datastructures'],
    },
  });

  const post2 = await prisma.post.create({
    data: {
      content: 'Our study group is meeting this Saturday at 2 PM in the library. We will be reviewing algorithms for the midterm. All are welcome!',
      type: 'TEXT',
      authorId: student1.id,
      hashtags: ['studying', 'algorithms', 'midterm'],
    },
  });

  const post3 = await prisma.post.create({
    data: {
      content: 'Just published the new lecture notes for ML Fundamentals. Check out the section on gradient descent optimization!',
      type: 'TEXT',
      authorId: teacher.id,
      hashtags: ['machinelearning', 'education'],
      mentions: [student1.id, student2.id],
    },
  });

  // Add reactions
  await prisma.reaction.createMany({
    data: [
      { type: 'LIKE', userId: student2.id, postId: post1.id },
      { type: 'LOVE', userId: student3.id, postId: post1.id },
      { type: 'LIKE', userId: teacher.id, postId: post1.id },
      { type: 'LIKE', userId: student1.id, postId: post2.id },
      { type: 'LIKE', userId: student2.id, postId: post3.id },
    ],
  });

  // Add comments
  const comment1 = await prisma.comment.create({
    data: {
      content: 'Nice! I implemented mine using iterative approach first, then refactored to recursive. Both have their merits.',
      authorId: student2.id,
      postId: post1.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Recursive is definitely more readable. Have you tried balancing it with AVL rotations?',
      authorId: teacher.id,
      postId: post1.id,
      parentId: comment1.id,
      depth: 1,
    },
  });

  console.log('Posts and comments created');

  // Create badges
  await prisma.badge.createMany({
    data: [
      { name: 'First Post', icon: '📝', description: 'Created your first post', color: '#3B82F6', xpRequired: 0 },
      { name: 'Social Butterfly', icon: '🦋', description: 'Connected with 10 friends', color: '#8B5CF6', xpRequired: 100 },
      { name: 'Course Pioneer', icon: '🎓', description: 'Enrolled in first course', color: '#06B6D4', xpRequired: 50 },
      { name: 'Study Machine', icon: '📚', description: 'Completed 5 assignments', color: '#F59E0B', xpRequired: 200 },
      { name: 'AI Explorer', icon: '🤖', description: 'Used 5 different AI features', color: '#EF4444', xpRequired: 300 },
      { name: 'Group Leader', icon: '👥', description: 'Created a group', color: '#10B981', xpRequired: 150 },
    ],
  });

  // Award badges
  const firstPostBadge = await prisma.badge.findUnique({ where: { name: 'First Post' } });
  const coursePioneer = await prisma.badge.findUnique({ where: { name: 'Course Pioneer' } });

  if (firstPostBadge) {
    await prisma.userBadge.create({ data: { userId: student1.id, badgeId: firstPostBadge.id } });
  }
  if (coursePioneer) {
    await prisma.userBadge.create({ data: { userId: student1.id, badgeId: coursePioneer.id } });
  }

  console.log('Badges created');

  // Create notifications
  await prisma.notification.createMany({
    data: [
      { type: 'COMMENT', title: 'New Comment', message: 'Maria commented on your post', userId: student1.id, senderId: student2.id },
      { type: 'LIKE', title: 'Post Liked', message: 'Dr. Johnson liked your post', userId: student1.id, senderId: teacher.id },
      { type: 'COURSE', title: 'New Course Material', message: 'New lecture notes available for ML Fundamentals', userId: student1.id, senderId: teacher.id },
    ],
  });

  // Create calendar events
  await prisma.calendarEvent.createMany({
    data: [
      { title: 'CS101 Midterm', description: 'Midterm exam covering chapters 1-5', date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), startTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000), type: 'EXAM', color: '#EF4444', userId: student1.id, courseId: cs101.id },
      { title: 'Study Group Meeting', description: 'Weekly study session', date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000), endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000), type: 'EVENT', color: '#3B82F6', userId: student1.id },
      { title: 'ML Workshop', description: 'Hands-on workshop on neural networks', date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), startTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000), type: 'EVENT', color: '#8B5CF6', userId: student1.id },
    ],
  });

  console.log('Calendar events created');

  // Create friend relationships
  await prisma.friendRequest.create({
    data: {
      senderId: student1.id,
      receiverId: student2.id,
      status: 'ACCEPTED',
    },
  });

  await prisma.friendship.create({
    data: {
      userId: student1.id,
      friendId: student2.id,
    },
  });

  // Create followers
  await prisma.follower.createMany({
    data: [
      { userId: student1.id, followerId: student2.id },
      { userId: teacher.id, followerId: student1.id },
      { userId: teacher.id, followerId: student2.id },
    ],
  });

  console.log('Friend and follower relationships created');

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
