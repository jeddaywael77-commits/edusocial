import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { CreateProgramDto } from './dto/create-program.dto';
import { CreateGuideDto } from './dto/create-guide.dto';
import { CreateAdmissionDto } from './dto/create-admission.dto';
import { CreateScholarshipDto } from './dto/create-scholarship.dto';
import { CreateQuestionDto, CreateAnswerDto } from './dto/create-question.dto';

@Injectable()
export class StudyTunisiaService {
  private readonly logger = new Logger(StudyTunisiaService.name);

  constructor(private prisma: PrismaService) {}

  // ─── Institutions ──────────────────────────────────────────────────────────

  async createInstitution(dto: CreateInstitutionDto) {
    const slug = this.slugify(dto.name);
    return this.prisma.institution.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        logo: dto.logo,
        coverImage: dto.coverImage,
        type: dto.type,
        city: dto.city,
        address: dto.address,
        website: dto.website,
        email: dto.email,
        phone: dto.phone,
      },
      include: {
        _count: { select: { programs: true, admissions: true, scholarships: true } },
      },
    });
  }

  async findAllInstitutions(query?: { type?: string; city?: string; search?: string; cursor?: string; limit?: number }) {
    const limit = Math.min(50, Math.max(1, query?.limit || 20));
    const where: Prisma.InstitutionWhereInput = {
      ...(query?.type && { type: query.type }),
      ...(query?.city && { city: query.city }),
      ...(query?.search && {
        OR: [
          { name: { contains: query.search, mode: 'insensitive' } },
          { city: { contains: query.search, mode: 'insensitive' } },
          { description: { contains: query.search, mode: 'insensitive' } },
        ],
      }),
    };

    const institutions = await this.prisma.institution.findMany({
      where,
      take: limit,
      ...(query?.cursor && { skip: 1, cursor: { id: query.cursor } }),
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { programs: true, admissions: true, scholarships: true } },
      },
    });

    return {
      data: institutions,
      nextCursor: institutions.length === limit ? institutions[institutions.length - 1].id : null,
    };
  }

  async findInstitutionById(id: string) {
    const institution = await this.prisma.institution.findUnique({
      where: { id },
      include: {
        programs: { where: { isPublished: true }, orderBy: { title: 'asc' } },
        admissions: { where: { isOpen: true }, orderBy: { deadline: 'asc' } },
        scholarships: { where: { isAvailable: true }, orderBy: { deadline: 'asc' } },
        _count: { select: { programs: true, admissions: true, scholarships: true } },
      },
    });

    if (!institution) throw new NotFoundException('Institution not found');
    return institution;
  }

  async updateInstitution(id: string, dto: Partial<CreateInstitutionDto>) {
    const institution = await this.prisma.institution.findUnique({ where: { id } });
    if (!institution) throw new NotFoundException('Institution not found');

    return this.prisma.institution.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.logo !== undefined && { logo: dto.logo }),
        ...(dto.coverImage !== undefined && { coverImage: dto.coverImage }),
        ...(dto.type && { type: dto.type }),
        ...(dto.city && { city: dto.city }),
        ...(dto.address !== undefined && { address: dto.address }),
        ...(dto.website !== undefined && { website: dto.website }),
        ...(dto.email !== undefined && { email: dto.email }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
      },
      include: {
        _count: { select: { programs: true, admissions: true, scholarships: true } },
      },
    });
  }

  async deleteInstitution(id: string) {
    const institution = await this.prisma.institution.findUnique({ where: { id } });
    if (!institution) throw new NotFoundException('Institution not found');
    await this.prisma.institution.delete({ where: { id } });
    return { message: 'Institution deleted' };
  }

  // ─── Programs ──────────────────────────────────────────────────────────────

  async createProgram(dto: CreateProgramDto) {
    const slug = this.slugify(dto.title);
    return this.prisma.studyProgram.create({
      data: {
        title: dto.title,
        slug,
        description: dto.description,
        field: dto.field,
        level: dto.level,
        duration: dto.duration,
        language: dto.language,
        tuitionFees: dto.tuitionFees,
        institutionId: dto.institutionId,
        isPublished: dto.isPublished ?? true,
      },
      include: {
        institution: { select: { id: true, name: true, city: true, logo: true } },
      },
    });
  }

  async findAllPrograms(query?: { field?: string; level?: string; institutionId?: string; search?: string; cursor?: string; limit?: number }) {
    const limit = Math.min(50, Math.max(1, query?.limit || 20));
    const where: Prisma.StudyProgramWhereInput = {
      isPublished: true,
      ...(query?.field && { field: query.field }),
      ...(query?.level && { level: query.level }),
      ...(query?.institutionId && { institutionId: query.institutionId }),
      ...(query?.search && {
        OR: [
          { title: { contains: query.search, mode: 'insensitive' } },
          { description: { contains: query.search, mode: 'insensitive' } },
        ],
      }),
    };

    const programs = await this.prisma.studyProgram.findMany({
      where,
      take: limit,
      ...(query?.cursor && { skip: 1, cursor: { id: query.cursor } }),
      orderBy: { title: 'asc' },
      include: {
        institution: { select: { id: true, name: true, city: true, logo: true } },
      },
    });

    return {
      data: programs,
      nextCursor: programs.length === limit ? programs[programs.length - 1].id : null,
    };
  }

  async findProgramById(id: string) {
    const program = await this.prisma.studyProgram.findUnique({
      where: { id },
      include: {
        institution: true,
      },
    });
    if (!program) throw new NotFoundException('Program not found');
    return program;
  }

  async updateProgram(id: string, dto: Partial<CreateProgramDto>) {
    const program = await this.prisma.studyProgram.findUnique({ where: { id } });
    if (!program) throw new NotFoundException('Program not found');

    return this.prisma.studyProgram.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.field && { field: dto.field }),
        ...(dto.level && { level: dto.level }),
        ...(dto.duration !== undefined && { duration: dto.duration }),
        ...(dto.language !== undefined && { language: dto.language }),
        ...(dto.tuitionFees !== undefined && { tuitionFees: dto.tuitionFees }),
        ...(dto.isPublished !== undefined && { isPublished: dto.isPublished }),
      },
      include: {
        institution: { select: { id: true, name: true, city: true } },
      },
    });
  }

  async deleteProgram(id: string) {
    const program = await this.prisma.studyProgram.findUnique({ where: { id } });
    if (!program) throw new NotFoundException('Program not found');
    await this.prisma.studyProgram.delete({ where: { id } });
    return { message: 'Program deleted' };
  }

  // ─── Guides ────────────────────────────────────────────────────────────────

  async createGuide(authorId: string, dto: CreateGuideDto) {
    const slug = this.slugify(dto.title);
    return this.prisma.studyGuide.create({
      data: {
        title: dto.title,
        slug,
        content: dto.content,
        summary: dto.summary,
        coverImage: dto.coverImage,
        category: dto.category || 'general',
        isPublished: dto.isPublished ?? true,
        authorId,
      },
      include: {
        author: { select: { id: true, name: true, avatar: true, role: true } },
      },
    });
  }

  async findAllGuides(query?: { category?: string; search?: string; cursor?: string; limit?: number }) {
    const limit = Math.min(50, Math.max(1, query?.limit || 20));
    const where: Prisma.StudyGuideWhereInput = {
      isPublished: true,
      ...(query?.category && { category: query.category }),
      ...(query?.search && {
        OR: [
          { title: { contains: query.search, mode: 'insensitive' } },
          { content: { contains: query.search, mode: 'insensitive' } },
        ],
      }),
    };

    const guides = await this.prisma.studyGuide.findMany({
      where,
      take: limit,
      ...(query?.cursor && { skip: 1, cursor: { id: query.cursor } }),
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, name: true, avatar: true, role: true } },
      },
    });

    return {
      data: guides,
      nextCursor: guides.length === limit ? guides[guides.length - 1].id : null,
    };
  }

  async findGuideById(id: string) {
    const guide = await this.prisma.studyGuide.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, avatar: true, role: true } },
      },
    });
    if (!guide) throw new NotFoundException('Guide not found');
    return guide;
  }

  async updateGuide(id: string, authorId: string, dto: Partial<CreateGuideDto>) {
    const guide = await this.prisma.studyGuide.findUnique({ where: { id } });
    if (!guide) throw new NotFoundException('Guide not found');
    if (guide.authorId !== authorId) throw new ForbiddenException('You can only edit your own guides');

    return this.prisma.studyGuide.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.content && { content: dto.content }),
        ...(dto.summary !== undefined && { summary: dto.summary }),
        ...(dto.coverImage !== undefined && { coverImage: dto.coverImage }),
        ...(dto.category && { category: dto.category }),
        ...(dto.isPublished !== undefined && { isPublished: dto.isPublished }),
      },
      include: {
        author: { select: { id: true, name: true, avatar: true, role: true } },
      },
    });
  }

  async deleteGuide(id: string, authorId: string) {
    const guide = await this.prisma.studyGuide.findUnique({ where: { id } });
    if (!guide) throw new NotFoundException('Guide not found');
    if (guide.authorId !== authorId) throw new ForbiddenException('You can only delete your own guides');
    await this.prisma.studyGuide.delete({ where: { id } });
    return { message: 'Guide deleted' };
  }

  // ─── Admissions ────────────────────────────────────────────────────────────

  async createAdmission(dto: CreateAdmissionDto) {
    return this.prisma.admissionInfo.create({
      data: {
        title: dto.title,
        description: dto.description,
        institutionId: dto.institutionId,
        deadline: new Date(dto.deadline),
        requirements: dto.requirements,
        isOpen: dto.isOpen ?? true,
      },
      include: {
        institution: { select: { id: true, name: true, city: true, logo: true } },
      },
    });
  }

  async findAllAdmissions(query?: { institutionId?: string; isOpen?: boolean; cursor?: string; limit?: number }) {
    const limit = Math.min(50, Math.max(1, query?.limit || 20));
    const where: Prisma.AdmissionInfoWhereInput = {
      ...(query?.institutionId && { institutionId: query.institutionId }),
      ...(query?.isOpen !== undefined && { isOpen: query.isOpen }),
    };

    const admissions = await this.prisma.admissionInfo.findMany({
      where,
      take: limit,
      ...(query?.cursor && { skip: 1, cursor: { id: query.cursor } }),
      orderBy: { deadline: 'asc' },
      include: {
        institution: { select: { id: true, name: true, city: true, logo: true } },
      },
    });

    return {
      data: admissions,
      nextCursor: admissions.length === limit ? admissions[admissions.length - 1].id : null,
    };
  }

  async findAdmissionById(id: string) {
    const admission = await this.prisma.admissionInfo.findUnique({
      where: { id },
      include: { institution: true },
    });
    if (!admission) throw new NotFoundException('Admission not found');
    return admission;
  }

  async updateAdmission(id: string, dto: Partial<CreateAdmissionDto>) {
    const admission = await this.prisma.admissionInfo.findUnique({ where: { id } });
    if (!admission) throw new NotFoundException('Admission not found');

    return this.prisma.admissionInfo.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.deadline && { deadline: new Date(dto.deadline) }),
        ...(dto.requirements !== undefined && { requirements: dto.requirements }),
        ...(dto.isOpen !== undefined && { isOpen: dto.isOpen }),
      },
      include: {
        institution: { select: { id: true, name: true, city: true } },
      },
    });
  }

  async deleteAdmission(id: string) {
    const admission = await this.prisma.admissionInfo.findUnique({ where: { id } });
    if (!admission) throw new NotFoundException('Admission not found');
    await this.prisma.admissionInfo.delete({ where: { id } });
    return { message: 'Admission deleted' };
  }

  // ─── Scholarships ──────────────────────────────────────────────────────────

  async createScholarship(dto: CreateScholarshipDto) {
    return this.prisma.scholarship.create({
      data: {
        title: dto.title,
        description: dto.description,
        institutionId: dto.institutionId || null,
        amount: dto.amount,
        deadline: new Date(dto.deadline),
        requirements: dto.requirements,
        isAvailable: dto.isAvailable ?? true,
      },
      include: {
        institution: { select: { id: true, name: true, city: true, logo: true } },
      },
    });
  }

  async findAllScholarships(query?: { institutionId?: string; isAvailable?: boolean; cursor?: string; limit?: number }) {
    const limit = Math.min(50, Math.max(1, query?.limit || 20));
    const where: Prisma.ScholarshipWhereInput = {
      ...(query?.institutionId && { institutionId: query.institutionId }),
      ...(query?.isAvailable !== undefined && { isAvailable: query.isAvailable }),
    };

    const scholarships = await this.prisma.scholarship.findMany({
      where,
      take: limit,
      ...(query?.cursor && { skip: 1, cursor: { id: query.cursor } }),
      orderBy: { deadline: 'asc' },
      include: {
        institution: { select: { id: true, name: true, city: true, logo: true } },
      },
    });

    return {
      data: scholarships,
      nextCursor: scholarships.length === limit ? scholarships[scholarships.length - 1].id : null,
    };
  }

  async findScholarshipById(id: string) {
    const scholarship = await this.prisma.scholarship.findUnique({
      where: { id },
      include: { institution: true },
    });
    if (!scholarship) throw new NotFoundException('Scholarship not found');
    return scholarship;
  }

  async updateScholarship(id: string, dto: Partial<CreateScholarshipDto>) {
    const scholarship = await this.prisma.scholarship.findUnique({ where: { id } });
    if (!scholarship) throw new NotFoundException('Scholarship not found');

    return this.prisma.scholarship.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.amount !== undefined && { amount: dto.amount }),
        ...(dto.deadline && { deadline: new Date(dto.deadline) }),
        ...(dto.requirements !== undefined && { requirements: dto.requirements }),
        ...(dto.isAvailable !== undefined && { isAvailable: dto.isAvailable }),
      },
      include: {
        institution: { select: { id: true, name: true, city: true } },
      },
    });
  }

  async deleteScholarship(id: string) {
    const scholarship = await this.prisma.scholarship.findUnique({ where: { id } });
    if (!scholarship) throw new NotFoundException('Scholarship not found');
    await this.prisma.scholarship.delete({ where: { id } });
    return { message: 'Scholarship deleted' };
  }

  // ─── Q&A ───────────────────────────────────────────────────────────────────

  async createQuestion(authorId: string, dto: CreateQuestionDto) {
    return this.prisma.studyQuestion.create({
      data: {
        title: dto.title,
        content: dto.content,
        tags: dto.tags || [],
        authorId,
      },
      include: {
        author: { select: { id: true, name: true, avatar: true, role: true } },
        _count: { select: { answers: true } },
      },
    });
  }

  async findAllQuestions(query?: { tag?: string; search?: string; cursor?: string; limit?: number }) {
    const limit = Math.min(50, Math.max(1, query?.limit || 20));
    const where: Prisma.StudyQuestionWhereInput = {
      ...(query?.tag && { tags: { has: query.tag } }),
      ...(query?.search && {
        OR: [
          { title: { contains: query.search, mode: 'insensitive' } },
          { content: { contains: query.search, mode: 'insensitive' } },
        ],
      }),
    };

    const questions = await this.prisma.studyQuestion.findMany({
      where,
      take: limit,
      ...(query?.cursor && { skip: 1, cursor: { id: query.cursor } }),
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, name: true, avatar: true, role: true } },
        _count: { select: { answers: true } },
      },
    });

    return {
      data: questions,
      nextCursor: questions.length === limit ? questions[questions.length - 1].id : null,
    };
  }

  async findQuestionById(id: string) {
    const question = await this.prisma.studyQuestion.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, avatar: true, role: true } },
        answers: {
          orderBy: [{ isAccepted: 'desc' }, { upvotes: 'desc' }, { createdAt: 'asc' }],
          include: {
            author: { select: { id: true, name: true, avatar: true, role: true } },
          },
        },
        _count: { select: { answers: true } },
      },
    });

    if (!question) throw new NotFoundException('Question not found');

    await this.prisma.studyQuestion.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return { ...question, viewCount: question.viewCount + 1 };
  }

  async createAnswer(authorId: string, questionId: string, dto: CreateAnswerDto) {
    const question = await this.prisma.studyQuestion.findUnique({ where: { id: questionId } });
    if (!question) throw new NotFoundException('Question not found');

    const answer = await this.prisma.studyAnswer.create({
      data: {
        content: dto.content,
        authorId,
        questionId,
      },
      include: {
        author: { select: { id: true, name: true, avatar: true, role: true } },
      },
    });

    await this.prisma.studyQuestion.update({
      where: { id: questionId },
      data: { answerCount: { increment: 1 } },
    });

    return answer;
  }

  async acceptAnswer(answerId: string, userId: string) {
    const answer = await this.prisma.studyAnswer.findUnique({
      where: { id: answerId },
      include: { question: true },
    });

    if (!answer) throw new NotFoundException('Answer not found');
    if (answer.question.authorId !== userId) {
      throw new ForbiddenException('Only the question author can accept an answer');
    }

    await this.prisma.studyAnswer.updateMany({
      where: { questionId: answer.questionId },
      data: { isAccepted: false },
    });

    await this.prisma.studyAnswer.update({
      where: { id: answerId },
      data: { isAccepted: true },
    });

    return { message: 'Answer accepted' };
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 100);
  }
}
