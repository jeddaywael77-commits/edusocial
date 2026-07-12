import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { PrismaService } from '../../database/prisma.service';
import { SocketGateway } from '../socket/socket.gateway';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('AdminService', () => {
  let service: AdminService;
  let prisma: Record<string, any>;
  let socket: Record<string, any>;

  beforeEach(async () => {
    prisma = {
      user: {
        count: jest.fn().mockResolvedValue(10),
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
        update: jest.fn().mockResolvedValue({}),
        delete: jest.fn().mockResolvedValue({}),
        groupBy: jest.fn().mockResolvedValue([]),
      },
      post: {
        count: jest.fn().mockResolvedValue(5),
        update: jest.fn().mockResolvedValue({}),
      },
      group: { count: jest.fn().mockResolvedValue(3) },
      course: { count: jest.fn().mockResolvedValue(2) },
      comment: { count: jest.fn().mockResolvedValue(8) },
      media: { count: jest.fn().mockResolvedValue(4) },
      postReport: {
        count: jest.fn().mockResolvedValue(1),
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
        update: jest.fn().mockResolvedValue({}),
      },
      commentReport: {
        count: jest.fn().mockResolvedValue(0),
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
        update: jest.fn().mockResolvedValue({}),
      },
      auditLog: {
        create: jest.fn().mockResolvedValue({}),
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0),
      },
    };

    socket = { broadcastToUser: jest.fn(), broadcastToAll: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: PrismaService, useValue: prisma },
        { provide: SocketGateway, useValue: socket },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDashboardStats', () => {
    it('should return dashboard stats', async () => {
      const result = await service.getDashboardStats();
      expect(result).toHaveProperty('users');
      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('reports');
    });
  });

  describe('getUsers', () => {
    it('should return paginated users', async () => {
      prisma.user.findMany.mockResolvedValue([
        { id: '1', name: 'Test', email: 'test@test.com', role: 'STUDENT' },
      ]);
      prisma.user.count.mockResolvedValue(1);
      const result = await service.getUsers({ page: 1, limit: 10 });
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.meta.total).toBe(1);
    });

    it('should filter by search', async () => {
      await service.getUsers({ search: 'test' });
      expect(prisma.user.findMany).toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('should throw NotFoundException for missing user', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.getUserById('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return user when found', async () => {
      const mockUser = { id: '1', name: 'Test', email: 'test@test.com' };
      prisma.user.findUnique.mockResolvedValue(mockUser);
      const result = await service.getUserById('1');
      expect(result.id).toBe('1');
    });
  });

  describe('updateUserRole', () => {
    it('should throw ForbiddenException when changing own role', async () => {
      await expect(
        service.updateUserRole('admin1', { role: 'ADMIN' as any }, 'admin1'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should update role successfully', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user1',
        role: 'STUDENT',
      });
      prisma.user.update.mockResolvedValue({
        id: 'user1',
        name: 'Test',
        role: 'ADMIN',
      });
      await service.updateUserRole('user1', { role: 'ADMIN' as any }, 'admin1');
      expect(prisma.user.update).toHaveBeenCalled();
      expect(prisma.auditLog.create).toHaveBeenCalled();
    });
  });

  describe('toggleUserActive', () => {
    it('should throw ForbiddenException when deactivating self', async () => {
      await expect(
        service.toggleUserActive('admin1', false, 'admin1'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should toggle active status', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user1', isActive: true });
      prisma.user.update.mockResolvedValue({ id: 'user1', isActive: false });
      await service.toggleUserActive('user1', false, 'admin1');
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { isActive: false } }),
      );
    });
  });

  describe('deleteUser', () => {
    it('should throw ForbiddenException when deleting self', async () => {
      await expect(service.deleteUser('admin1', 'admin1')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should delete user successfully', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user1',
        name: 'Test',
        email: 'test@test.com',
      });
      prisma.user.delete.mockResolvedValue({});
      await service.deleteUser('user1', 'admin1');
      expect(prisma.user.delete).toHaveBeenCalled();
    });
  });

  describe('getReports', () => {
    it('should return post reports', async () => {
      const result = await service.getReports({
        type: 'post',
        status: 'pending',
      });
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.type).toBe('post');
    });

    it('should return comment reports', async () => {
      const result = await service.getReports({
        type: 'comment',
        status: 'pending',
      });
      expect(result.type).toBe('comment');
    });
  });

  describe('resolvePostReport', () => {
    it('should throw NotFoundException for missing report', async () => {
      prisma.postReport.findUnique.mockResolvedValue(null);
      await expect(
        service.resolvePostReport(
          'nonexistent',
          { status: 'resolved' },
          'admin1',
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should resolve report', async () => {
      prisma.postReport.findUnique.mockResolvedValue({
        id: 'r1',
        postId: 'p1',
        status: 'pending',
      });
      prisma.postReport.update.mockResolvedValue({
        id: 'r1',
        status: 'resolved',
      });
      prisma.post.update.mockResolvedValue({});
      await service.resolvePostReport('r1', { status: 'resolved' }, 'admin1');
      expect(prisma.postReport.update).toHaveBeenCalled();
    });
  });

  describe('resolveCommentReport', () => {
    it('should throw NotFoundException for missing report', async () => {
      prisma.commentReport.findUnique.mockResolvedValue(null);
      await expect(
        service.resolveCommentReport(
          'nonexistent',
          { status: 'resolved' },
          'admin1',
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAuditLogs', () => {
    it('should return paginated audit logs', async () => {
      prisma.auditLog.findMany.mockResolvedValue([{ id: '1', action: 'TEST' }]);
      prisma.auditLog.count.mockResolvedValue(1);
      const result = await service.getAuditLogs({ page: 1, limit: 10 });
      expect(result).toHaveProperty('data');
      expect(result.meta.total).toBe(1);
    });
  });

  describe('logAudit', () => {
    it('should create audit log entry', async () => {
      await service.logAudit('user1', 'TEST_ACTION', 'Entity', 'eid1', null, {
        key: 'val',
      });
      expect(prisma.auditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'user1',
            action: 'TEST_ACTION',
            entity: 'Entity',
            entityId: 'eid1',
          }),
        }),
      );
    });
  });
});
