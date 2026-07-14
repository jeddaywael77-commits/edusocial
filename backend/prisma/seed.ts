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
  const csGroup = await prisma.group.upsert({
    where: { id: 'f247e38e-44f9-45fe-af00-90bb40ca5982' },
    update: {},
    create: {
      id: 'f247e38e-44f9-45fe-af00-90bb40ca5982',
      name: 'Computer Science Hub',
      description: 'A community for CS students to discuss algorithms, data structures, and programming challenges.',
      type: GroupType.CLUB,
      adminId: teacher.id,
      isPublic: true,
    },
  });

  await prisma.groupMember.createMany({
    skipDuplicates: true,
    data: [
      { groupId: csGroup.id, userId: teacher.id, role: 'admin' },
      { groupId: csGroup.id, userId: student1.id, role: 'member' },
      { groupId: csGroup.id, userId: student2.id, role: 'member' },
    ],
  });

  const studyGroup = await prisma.group.upsert({
    where: { id: '62711bad-c2d8-422b-8775-b0add313e27b' },
    update: {},
    create: {
      id: '62711bad-c2d8-422b-8775-b0add313e27b',
      name: 'Study Group Alpha',
      description: 'Weekly study sessions for midterm preparation.',
      type: GroupType.CLASSROOM,
      adminId: student1.id,
      isPublic: true,
    },
  });

  await prisma.groupMember.createMany({
    skipDuplicates: true,
    data: [
      { groupId: studyGroup.id, userId: student1.id, role: 'admin' },
      { groupId: studyGroup.id, userId: student2.id, role: 'member' },
      { groupId: studyGroup.id, userId: student3.id, role: 'member' },
    ],
  });

  console.log('Groups created:', { csGroup: csGroup.id, studyGroup: studyGroup.id });

  // Create courses
  const cs101 = await prisma.course.upsert({
    where: { id: 'cs101-id-placeholder' },
    update: {},
    create: {
      title: 'Introduction to Computer Science',
      description: 'Fundamentals of computer science including algorithms, data structures, and basic programming concepts.',
      category: 'Computer Science',
      level: CourseLevel.BEGINNER,
      teacherId: teacher.id,
      isPublished: true,
    },
  });

  const mlCourse = await prisma.course.upsert({
    where: { id: 'ml-course-id-placeholder' },
    update: {},
    create: {
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
    skipDuplicates: true,
    data: [
      { courseId: cs101.id, userId: student1.id, progress: 65 },
      { courseId: cs101.id, userId: student2.id, progress: 40 },
      { courseId: mlCourse.id, userId: student1.id, progress: 20 },
      { courseId: mlCourse.id, userId: student2.id, progress: 15 },
    ],
  });

  // Create lessons
  await prisma.lesson.createMany({
    skipDuplicates: true,
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

  await prisma.submission.upsert({
    where: { id: 'sub-hw1-student1' },
    update: {},
    create: {
      id: 'sub-hw1-student1',
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
  const post1 = await prisma.post.upsert({
    where: { id: 'post-1-id' },
    update: {},
    create: {
      id: 'post-1-id',
      content: 'Just finished implementing a binary search tree in Python! The recursive approach for insertion is so elegant. Anyone else working on data structures this week?',
      type: 'TEXT',
      authorId: student1.id,
      hashtags: ['coding', 'python', 'datastructures'],
    },
  });

  const post2 = await prisma.post.upsert({
    where: { id: 'post-2-id' },
    update: {},
    create: {
      id: 'post-2-id',
      content: 'Our study group is meeting this Saturday at 2 PM in the library. We will be reviewing algorithms for the midterm. All are welcome!',
      type: 'TEXT',
      authorId: student1.id,
      hashtags: ['studying', 'algorithms', 'midterm'],
    },
  });

  const post3 = await prisma.post.upsert({
    where: { id: 'post-3-id' },
    update: {},
    create: {
      id: 'post-3-id',
      content: 'Just published the new lecture notes for ML Fundamentals. Check out the section on gradient descent optimization!',
      type: 'TEXT',
      authorId: teacher.id,
      hashtags: ['machinelearning', 'education'],
      mentions: [student1.id, student2.id],
    },
  });

  // Add reactions
  await prisma.reaction.createMany({
    skipDuplicates: true,
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
    skipDuplicates: true,
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
    await prisma.userBadge.upsert({
      where: { userId_badgeId: { userId: student1.id, badgeId: firstPostBadge.id } },
      update: {},
      create: { userId: student1.id, badgeId: firstPostBadge.id },
    });
  }
  if (coursePioneer) {
    await prisma.userBadge.upsert({
      where: { userId_badgeId: { userId: student1.id, badgeId: coursePioneer.id } },
      update: {},
      create: { userId: student1.id, badgeId: coursePioneer.id },
    });
  }

  console.log('Badges created');

  // Create notifications
  await prisma.notification.createMany({
    skipDuplicates: true,
    data: [
      { type: 'COMMENT', title: 'New Comment', message: 'Maria commented on your post', userId: student1.id, senderId: student2.id },
      { type: 'LIKE', title: 'Post Liked', message: 'Dr. Johnson liked your post', userId: student1.id, senderId: teacher.id },
      { type: 'COURSE', title: 'New Course Material', message: 'New lecture notes available for ML Fundamentals', userId: student1.id, senderId: teacher.id },
    ],
  });

  // Create calendar events
  await prisma.calendarEvent.createMany({
    skipDuplicates: true,
    data: [
      { title: 'CS101 Midterm', description: 'Midterm exam covering chapters 1-5', date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), startTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000), type: 'EXAM', color: '#EF4444', userId: student1.id, courseId: cs101.id },
      { title: 'Study Group Meeting', description: 'Weekly study session', date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000), endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000), type: 'EVENT', color: '#3B82F6', userId: student1.id },
      { title: 'ML Workshop', description: 'Hands-on workshop on neural networks', date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), startTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000), type: 'EVENT', color: '#8B5CF6', userId: student1.id },
    ],
  });

  console.log('Calendar events created');

  // Create friend relationships
  await prisma.friendRequest.upsert({
    where: { senderId_receiverId: { senderId: student1.id, receiverId: student2.id } },
    update: {},
    create: {
      senderId: student1.id,
      receiverId: student2.id,
      status: 'ACCEPTED',
    },
  });

  await prisma.friendship.upsert({
    where: { userId_friendId: { userId: student1.id, friendId: student2.id } },
    update: {},
    create: {
      userId: student1.id,
      friendId: student2.id,
    },
  });

  // Create followers
  await prisma.follower.createMany({
    skipDuplicates: true,
    data: [
      { userId: student1.id, followerId: student2.id },
      { userId: teacher.id, followerId: student1.id },
      { userId: teacher.id, followerId: student2.id },
    ],
  });

  console.log('Friend and follower relationships created');

  // ═══════════════════════════════════════════════════════════════════════════
  // NEWS (l'akhbar) seed data - Tunisian content
  // ═══════════════════════════════════════════════════════════════════════════

  const newsArticle1 = await prisma.newsArticle.upsert({
    where: { slug: 'renovation-digitale-universites-tunisiennes' },
    update: {},
    create: {
      title: 'Révolution numérique dans les universités tunisiennes',
      slug: 'renovation-digitale-universites-tunisiennes',
      content: `Le Ministère de l'Enseignement Supérieur a annoncé un vaste programme de numérisation touchant 25 universités à travers la Tunisie. Ce programme, doté d'un budget de 120 millions de dinars, prévoit l'installation de plateformes d'e-learning dans toutes les facultés, la mise à place de bibliothèques numériques et l'équipement de laboratoires informatiques de dernière génération.\n\nL'Université de Tunis El Manar sera la première à bénéficier de cette transformation, avec l'ouverture prochaine d'un centre d'innovation numérique qui accueillera plus de 500 étudiants.\n\n"C'est un tournant historique pour l'enseignement supérieur tunisien", a déclaré le Ministre. "Nous voulons que nos étudiants puissent rivaliser au niveau international."`,
      summary: 'Le gouvernement tunisien lance un programme ambitieux de numérisation de 25 universités avec un budget de 120M dinars.',
      category: 'education',
      isPublished: true,
      viewCount: 1245,
      authorId: admin.id,
    },
  });

  const newsArticle2 = await prisma.newsArticle.upsert({
    where: { slug: 'forum-entrepreneuriat-etudiant-tunisien' },
    update: {},
    create: {
      title: 'Forum international de l\'entrepreneuriat étudiant à Tunis',
      slug: 'forum-entrepreneuriat-etudiant-tunisien',
      content: `Le Palais des Congrès de La Marsa accueillera du 15 au 17 mars le plus grand forum de l'entrepreneuriat étudiant du Maghreb. Plus de 200 startups fondées par des étudiants tunisiens y seront présentées, couvrant des secteurs aussi variés que la fintech, la santé numérique, l'agritech et l'énergie renouvelable.\n\nParmi les intervenants figuraient des entrepreneurs à succès comme Mohamed Bouazizi Digital et des investisseurs de Silicon Valley.\n\nCe forum est organisé en partenariat avec l'Université de Sfax et l'ENI (École Nationale d'Ingénieurs).`,
      summary: 'Plus de 200 startups étudiantes seront présentées au Palais des Congrès de La Marsa.',
      category: 'events',
      isPublished: true,
      viewCount: 892,
      authorId: admin.id,
    },
  });

  const newsArticle3 = await prisma.newsArticle.upsert({
    where: { slug: 'bourses-excellence-2026' },
    update: {},
    create: {
      title: 'Ouverture des candidatures pour les bourses d\'excellence 2026',
      slug: 'bourses-excellence-2026',
      content: `Le programme national de bourses d'excellence ouvre ses candidatures pour l'année universitaire 2026-2027. Cette année, 500 bourses sont disponibles pour les étudiants tunisiens souhaitant poursuivre leurs études dans les meilleures universités mondiales.\n\nLes domaines prioritaires incluent : l'intelligence artificielle, les énergies renouvelables, la biotechnologie et les sciences quantiques. Chaque bourse couvre les frais de scolarité, le logement et un allocation mensuelle de 800 dinars.\n\nLes candidatures sont ouvertes jusqu'au 30 avril sur le portail du Ministère.`,
      summary: '500 bourses d\'excellence disponibles pour les étudiants tunisiens dans les domaines de pointe.',
      category: 'education',
      isPublished: true,
      viewCount: 2341,
      authorId: admin.id,
    },
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // EVENTS (a7dath) seed data
  // ═══════════════════════════════════════════════════════════════════════════

  const event1 = await prisma.event.upsert({
    where: { id: 'event-tech-day-2026' },
    update: {},
    create: {
      id: 'event-tech-day-2026',
      title: 'Tech Day Tunis 2026',
      description: 'La plus grande journée technologique de Tunis réunit développeurs, designers et entrepreneurs. Ateliers pratiques, conférences et networking tout au long de la journée.',
      date: new Date('2026-03-20'),
      startTime: new Date('2026-03-20T09:00:00'),
      endTime: new Date('2026-03-20T18:00:00'),
      location: 'Centre des Sciences de La Marsa, Tunis',
      maxAttendees: 500,
      isPublic: true,
      type: 'technology',
      creatorId: admin.id,
    },
  });

  const event2 = await prisma.event.upsert({
    where: { id: 'event-hackathon-sfax' },
    update: {},
    create: {
      id: 'event-hackathon-sfax',
      title: 'Hackathon Sfax 2026 - Innovation Solidaire',
      description: 'Un hackathon de 48 heures pour résoudre des problèmes sociaux grâce à la technologie. Thème : solutions pour les communautés rurales.',
      date: new Date('2026-04-05'),
      startTime: new Date('2026-04-05T08:00:00'),
      endTime: new Date('2026-04-07T16:00:00'),
      location: 'ENI Sfax, Route de Soukra',
      maxAttendees: 150,
      isPublic: true,
      type: 'hackathon',
      creatorId: teacher.id,
    },
  });

  const event3 = await prisma.event.upsert({
    where: { id: 'event-meetup-ai-tunis' },
    update: {},
    create: {
      id: 'event-meetup-ai-tunis',
      title: 'AI Meetup Tunis - L\'avenir de l\'IA en Tunisie',
      description: 'Rencontre mensuelle des passionnés d\'intelligence artificielle. Presentation de projets open source et discussion sur les opportunités d\'IA en Afrique.',
      date: new Date('2026-02-28'),
      startTime: new Date('2026-02-28T18:30:00'),
      endTime: new Date('2026-02-28T21:00:00'),
      location: 'Technopark El Ghazala, Tunis',
      maxAttendees: 80,
      isPublic: true,
      type: 'meetup',
      creatorId: admin.id,
    },
  });

  // Event attendees
  await prisma.eventAttendee.createMany({
    skipDuplicates: true,
    data: [
      { eventId: event1.id, userId: student1.id, status: 'going' },
      { eventId: event1.id, userId: student2.id, status: 'going' },
      { eventId: event1.id, userId: teacher.id, status: 'going' },
      { eventId: event2.id, userId: student1.id, status: 'going' },
      { eventId: event2.id, userId: student3.id, status: 'interested' },
      { eventId: event3.id, userId: student2.id, status: 'going' },
      { eventId: event3.id, userId: admin.id, status: 'going' },
    ],
  });

  console.log('News and events created');

  // ═══════════════════════════════════════════════════════════════════════════
  // STUDY IN TUNISIA (tab3 tounes) seed data
  // ═══════════════════════════════════════════════════════════════════════════

  // Institutions
  const utm = await prisma.institution.upsert({
    where: { slug: 'universite-tunis-el-manar' },
    update: {},
    create: {
      name: 'Université de Tunis El Manar',
      slug: 'universite-tunis-el-manar',
      description: 'L\'une des plus grandes universités de Tunisie, fondée en 1960. Elle regroupe 15 facultés couvrant les sciences, les lettres, le droit et les technologies.',
      type: 'university',
      city: 'Tunis',
      address: 'Campus Universitaire El Manar, 1068 Tunis',
      website: 'https://www.utm.rnu.tn',
      email: 'contact@utm.rnu.tn',
      isVerified: true,
    },
  });

  const eni = await prisma.institution.upsert({
    where: { slug: 'eni-tunis' },
    update: {},
    create: {
      name: 'École Nationale d\'Ingénieurs de Tunis',
      slug: 'eni-tunis',
      description: 'Institut de formation d\'ingénieurs créé en 1952, reconnu pour ses programmes en génie informatique, télécommunications et électronique.',
      type: 'engineering_school',
      city: 'Tunis',
      address: 'Campus El Manar, 1068 Tunis',
      website: 'https://www.eni.rnu.tn',
      isVerified: true,
    },
  });

  const isamm = await prisma.institution.upsert({
    where: { slug: 'isamm' },
    update: {},
    create: {
      name: 'Institut Supérieur des Arts Multimédias de la Marsa',
      slug: 'isamm',
      description: 'Institut spécialisé dans les arts multimédias, le design graphique, l\'animation 3D et la production audiovisuelle.',
      type: 'arts_school',
      city: 'La Marsa',
      address: 'Avenue Habib Bourguiba, La Marsa',
      isVerified: true,
    },
  });

  const usfax = await prisma.institution.upsert({
    where: { slug: 'universite-sfax' },
    update: {},
    create: {
      name: 'Université de Sfax',
      slug: 'universite-sfax',
      description: 'Deuxième université de Tunisie par la taille, elle comprend 13 unités de recherche et forme plus de 45 000 étudiants.',
      type: 'university',
      city: 'Sfax',
      address: 'Route de l\'Aéroport, Km 10, Sfax 3038',
      website: 'https://www.usf.rnu.tn',
      isVerified: true,
    },
  });

  const insat = await prisma.institution.upsert({
    where: { slug: 'insat' },
    update: {},
    create: {
      name: 'Institut National des Sciences Appliquées et de Technologie',
      slug: 'insat',
      description: 'Institut d\'excellence en sciences appliquées, technologies de l\'information et génie industriel, rattaché à l\'Université de Tunis El Manar.',
      type: 'engineering_school',
      city: 'Tunis',
      address: 'Centre Urbain Nord, BP 37-1080 Tunis Cedex',
      website: 'https://www.insat.rnu.tn',
      isVerified: true,
    },
  });

  // Study Programs
  await prisma.studyProgram.createMany({
    skipDuplicates: true,
    data: [
      { title: 'Licence en Informatique', slug: 'licence-informatique-utm', field: 'Computer Science', level: 'bachelor', duration: '3 years', language: 'français', tuitionFees: 'Gratuit (public)', institutionId: utm.id, isPublished: true },
      { title: 'Master en Intelligence Artificielle', slug: 'master-ia-utm', field: 'Artificial Intelligence', level: 'master', duration: '2 years', language: 'français', tuitionFees: 'Gratuit (public)', institutionId: utm.id, isPublished: true },
      { title: 'Ingénieur en Génie Informatique', slug: 'ingenieur-genie-informatique-eni', field: 'Computer Engineering', level: 'bachelor', duration: '3 years', language: 'français', tuitionFees: 'Gratuit (public)', institutionId: eni.id, isPublished: true },
      { title: 'Ingénieur en Télécommunications', slug: 'ingenieur-telecom-eni', field: 'Telecommunications', level: 'bachelor', duration: '3 years', language: 'français', tuitionFees: 'Gratuit (public)', institutionId: eni.id, isPublished: true },
      { title: 'Licence en Design Graphique', slug: 'licence-design-graphique-isamm', field: 'Graphic Design', level: 'bachelor', duration: '3 years', language: 'français', tuitionFees: 'Gratuit (public)', institutionId: isamm.id, isPublished: true },
      { title: 'Master en Animation 3D', slug: 'master-animation-3d-isamm', field: '3D Animation', level: 'master', duration: '2 years', language: 'français', tuitionFees: 'Gratuit (public)', institutionId: isamm.id, isPublished: true },
      { title: 'Licence en Mathématiques Appliquées', slug: 'licence-maths-appliquees-usfax', field: 'Mathematics', level: 'bachelor', duration: '3 years', language: 'français', tuitionFees: 'Gratuit (public)', institutionId: usfax.id, isPublished: true },
      { title: 'Ingénieur en Génie Industriel', slug: 'ingenieur-genie-industriel-insat', field: 'Industrial Engineering', level: 'bachelor', duration: '3 years', language: 'français', tuitionFees: 'Gratuit (public)', institutionId: insat.id, isPublished: true },
      { title: 'Master en Réseaux et Sécurité', slug: 'master-reseaux-securite-insat', field: 'Networks & Security', level: 'master', duration: '2 years', language: 'français', tuitionFees: 'Gratuit (public)', institutionId: insat.id, isPublished: true },
      { title: 'Doctorat en Sciences de l\'Informatique', slug: 'doctorat-sciences-informatique-utm', field: 'Computer Science', level: 'phd', duration: '3-5 years', language: 'français', tuitionFees: 'Gratuit (public)', institutionId: utm.id, isPublished: true },
    ],
  });

  // Study Guides
  await prisma.studyGuide.createMany({
    skipDuplicates: true,
    data: [
      {
        title: 'Guide complet pour s\'inscrire en université tunisienne',
        slug: 'guide-inscription-universite-tunisienne',
        content: '## Comment s\'inscrire dans une université tunisienne\n\n### Étape 1 : Préparer les documents\n- Baccalauréat ou diplôme équivalent\n- Relevés de notes\n- Extraits de naissance\n- 4 photos d\'identité\n- Certificat médical\n\n### Étape 2 : Inscription en ligne\nRendez-vous sur le portail de la pré-inscription : www.pression.tn\nRemplissez le formulaire et téléchargez vos documents.\n\n### Étape 3 : Confirmation\nPrésentez-vous à l\'unité d\'accueil avec vos originaux pour finaliser l\'inscription.\n\n### Délais\nL\'inscription se fait généralement entre septembre et octobre.',
        summary: 'Étapes complètes pour s\'inscrire dans une université tunisienne, de la pré-inscription à la confirmation.',
        category: 'admissions',
        isPublished: true,
        authorId: admin.id,
        institutionId: utm.id,
      },
      {
        title: 'Vie d\'étudiant étranger en Tunisie',
        slug: 'vie-etudiant-etranger-tunisie',
        content: '## Bienvenue en Tunisie !\n\n### Logement\n- Crous : résidences universitaires à partir de 100 DT/mois\n- Colocation : entre 200 et 500 DT/mois selon la ville\n- Résidences privées : à partir de 400 DT/mois\n\n### Vie quotidienne\n- Transport : metro, louage, taxis. Carte étudiant pour tarif réduit\n- Restauration : restaurants universitaires à 1 DT le repas\n- Santé : couverture médicale obligatoire\n\n### Culture et loisirs\nLa Tunisie offre un mélange unique de méditerranéen et d\'afro-arabe. Profitez des plages, du Sahara et des médinas!',
        summary: 'Guide pratique pour les étudiants internationaux : logement, transport, vie quotidienne et culture en Tunisie.',
        category: 'life',
        isPublished: true,
        authorId: admin.id,
      },
      {
        title: 'Comment obtenir une bourse d\'étude en Tunisie',
        slug: 'obtenir-bourse-tunisie',
        content: '## Bourses disponibles\n\n### Bourses gouvernementales\n- Bourse d\'excellence : pour les meilleurs étudiants (note > 16/20)\n- Bourse sociale : basée sur les revenus familiaux\n- Bourse de recherche : pour les doctorants\n\n### Bourses internationales\n- Bourses Erasmus+ : pour les étudiants européens\n- Bourses COSME : pour les pays partenaires\n\n### Comment postuler\n1. Consulter les dates d\'ouverture sur le site du Ministère\n2. Préparer un dossier complet\n3. Soumettre en ligne\n4. Entretien si sélectionné',
        summary: 'Toutes les informations sur les bourses disponibles pour étudier en Tunisie.',
        category: 'financial',
        isPublished: true,
        authorId: admin.id,
      },
    ],
  });

  // Admissions
  await prisma.admissionInfo.createMany({
    skipDuplicates: true,
    data: [
      {
        title: 'Admissions L1 - Université de Tunis El Manar 2026',
        description: 'Inscriptions pour la première année de licence. Places limitées : 3000 pour les sciences, 2000 pour les lettres.',
        institutionId: utm.id,
        deadline: new Date('2026-10-15'),
        requirements: 'Baccalauréat général avec mention. Dossier complet requis.',
        isOpen: true,
      },
      {
        title: 'Concours d\'entrée ENI - Session 2026',
        description: 'Concours national d\'entrée à l\'ENI Tunis. 120 places pour le cycle ingénieur.',
        institutionId: eni.id,
        deadline: new Date('2026-07-01'),
        requirements: 'Baccalauréat en sciences expérimentales ou mathématiques. Concours écrit + oral.',
        isOpen: true,
      },
      {
        title: 'Admissions Master IA - UTM 2026',
        description: 'Admissions au Master en Intelligence Artificielle. 40 places disponibles.',
        institutionId: utm.id,
        deadline: new Date('2026-09-01'),
        requirements: 'Licence en informatique ou équivalent. Dossier + entretien.',
        isOpen: true,
      },
    ],
  });

  // Scholarships
  await prisma.scholarship.createMany({
    skipDuplicates: true,
    data: [
      {
        title: 'Bourse d\'excellence UTM 2026',
        description: 'Bourse couvrant les frais de logement et une allocation de 500 DT/mois pour les étudiants méritants.',
        institutionId: utm.id,
        amount: '500 DT/mois + logement',
        deadline: new Date('2026-06-30'),
        requirements: 'Moyenne générale supérieure à 16/20. Revenus familiaux inférieurs à 800 DT.',
        isAvailable: true,
      },
      {
        title: 'Bourse de recherche doctorale - ENI',
        description: 'Allocation de recherche pour les doctorants en sciences de l\'ingénieur.',
        institutionId: eni.id,
        amount: '800 DT/mois pendant 3 ans',
        deadline: new Date('2026-05-15'),
        requirements: 'Master avec mention Bien ou Très Bien. Projet de recherche validé.',
        isAvailable: true,
      },
      {
        title: 'Bourse Erasmus+ pour étudiants tunisiens',
        description: 'Mobilité universitaire vers une université européenne partenaire. Séjour de 6 à 12 mois.',
        institutionId: null,
        amount: '1200 EUR/mois + voyage',
        deadline: new Date('2026-03-31'),
        requirements: 'Licence 2 ou 3. Niveau B2 minimum en anglais ou langue du pays d\'accueil.',
        isAvailable: true,
      },
    ],
  });

  // Q&A
  const question1 = await prisma.studyQuestion.upsert({
    where: { id: 'q1-tunisia-study' },
    update: {},
    create: {
      id: 'q1-tunisia-study',
      title: 'Quelle est la meilleure université pour l\'informatique en Tunisie ?',
      content: 'Je suis bachelier et je souhaite étudier l\'informatique en Tunisie. Quelles sont les meilleures options ? L\'ENI, l\'INSAT ou la Faculté des Sciences de Tunis ?',
      authorId: student1.id,
      tags: ['informatique', 'université', 'choix'],
      viewCount: 342,
      answerCount: 2,
    },
  });

  const question2 = await prisma.studyQuestion.upsert({
    where: { id: 'q2-tunisia-visa' },
    update: {},
    create: {
      id: 'q2-tunisia-visa',
      title: 'Documents nécessaires pour un étudiant étranger en Tunisie ?',
      content: 'Je suis marocain et je veux intégrer une université tunisienne. Quels documents dois-je préparer pour le visa et l\'inscription ?',
      authorId: student2.id,
      tags: ['étranger', 'visa', 'inscription'],
      viewCount: 156,
      answerCount: 1,
    },
  });

  // Answers
  await prisma.studyAnswer.createMany({
    skipDuplicates: true,
    data: [
      {
        content: 'Les trois établissements sont excellents mais chacun a ses forces. L\'ENI est reconnu pour la rigueur de sa formation d\'ingénieur. L\'INSAT offre une approche plus pratique et technologique. La Faculté des Sciences de Tunis a un programme plus théorique mais très complet pour les maths et la recherche.',
        authorId: teacher.id,
        questionId: question1.id,
        isAccepted: true,
        upvotes: 15,
      },
      {
        content: 'J\'étudie à l\'INSAT et je recommande vivement. Le lien avec l\'industrie est fort et les stages sont très formatateurs. De plus, le campus est bien équipé.',
        authorId: student2.id,
        questionId: question1.id,
        isAccepted: false,
        upvotes: 8,
      },
      {
        content: 'Pour un étudiant marocain en Tunisie, vous aurez besoin de : passeport en cours de validité, attestation d\'inscription, certificat médical, photos d\'identité, et une demande de visa long séjour. L\'ambassade de Tunisie au Maroc traite les demandes en 2-3 semaines.',
        authorId: admin.id,
        questionId: question2.id,
        isAccepted: true,
        upvotes: 12,
      },
    ],
  });

  console.log('Study in Tunisia seed data created');
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
