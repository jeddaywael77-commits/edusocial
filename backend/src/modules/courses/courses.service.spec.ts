import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { PrismaService } from '../../database/prisma.service';
import { ForbiddenException } from '@nestjs/common';

describe('CoursesService', () => {
  let service: CoursesService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      course: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
      enrollment: {
        findMany: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [CoursesService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get(CoursesService);
  });

  describe('findAll', () => {
    it('should return paginated courses', async () => {
      prisma.course.findMany.mockResolvedValue([{ id: '1', title: 'Math' }]);
      prisma.course.count.mockResolvedValue(1);

      const result = await service.findAll(1, 20);

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
      expect(result.meta.totalPages).toBe(1);
    });

    it('should enforce max limit of 50', async () => {
      prisma.course.findMany.mockResolvedValue([]);
      prisma.course.count.mockResolvedValue(0);

      await service.findAll(1, 100);

      expect(prisma.course.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 50 }),
      );
    });
  });

  describe('update', () => {
    it('should throw ForbiddenException if not course owner', async () => {
      prisma.course.findUnique.mockResolvedValue({
        id: '1',
        teacherId: 'teacher-1',
      });

      await expect(
        service.update('1', 'other-user', { title: 'New Title' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should update course if owner', async () => {
      prisma.course.findUnique.mockResolvedValue({
        id: '1',
        teacherId: 'teacher-1',
      });
      prisma.course.update.mockResolvedValue({ id: '1', title: 'New Title' });

      const result = await service.update('1', 'teacher-1', {
        title: 'New Title',
      });
      expect(result.title).toBe('New Title');
    });
  });

  describe('getEnrollments', () => {
    it('should return paginated enrollments', async () => {
      prisma.enrollment.findMany.mockResolvedValue([{ id: '1', userId: 'u1' }]);
      prisma.enrollment.count.mockResolvedValue(1);

      const result = await service.getEnrollments('course-1', 1, 50);

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });
  });
});
