import { Test, TestingModule } from '@nestjs/testing';
import { GroupMembersService } from './group-members.service';
import { PrismaService } from '../../database/prisma.service';
import { SocketGateway } from '../socket/socket.gateway';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('GroupMembersService', () => {
  let service: GroupMembersService;
  let prisma: Record<string, any>;
  let socket: Record<string, any>;

  beforeEach(async () => {
    prisma = {
      group: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'g1',
          adminId: 'admin1',
          name: 'Test Group',
        }),
      },
      groupMember: {
        findUnique: jest.fn().mockResolvedValue(null),
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0),
        create: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockResolvedValue({}),
        delete: jest.fn().mockResolvedValue({}),
        groupBy: jest.fn().mockResolvedValue([]),
      },
      $transaction: jest.fn().mockImplementation((fns) => Promise.all(fns)),
    };

    socket = { broadcastToGroup: jest.fn(), broadcastToUser: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupMembersService,
        { provide: PrismaService, useValue: prisma },
        { provide: SocketGateway, useValue: socket },
      ],
    }).compile();

    service = module.get<GroupMembersService>(GroupMembersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMembers', () => {
    it('should throw NotFoundException for missing group', async () => {
      prisma.group.findUnique.mockResolvedValue(null);
      await expect(service.getMembers('nonexistent', {})).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return paginated members', async () => {
      prisma.groupMember.findMany.mockResolvedValue([
        { id: 'm1', role: 'member' },
      ]);
      prisma.groupMember.count.mockResolvedValue(1);
      const result = await service.getMembers('g1', { page: 1, limit: 10 });
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.meta.total).toBe(1);
    });
  });

  describe('getMember', () => {
    it('should throw NotFoundException for missing member', async () => {
      prisma.groupMember.findUnique.mockResolvedValue(null);
      await expect(service.getMember('g1', 'user1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return member when found', async () => {
      prisma.groupMember.findUnique.mockResolvedValue({
        id: 'm1',
        groupId: 'g1',
        userId: 'user1',
        role: 'member',
        user: { id: 'user1', name: 'Test' },
        group: { id: 'g1', name: 'Group', adminId: 'admin1' },
      });
      const result = await service.getMember('g1', 'user1');
      expect(result.userId).toBe('user1');
    });
  });

  describe('updateMemberRole', () => {
    it('should throw ForbiddenException if requester is not admin/mod', async () => {
      prisma.groupMember.findUnique.mockResolvedValue({ role: 'member' });
      await expect(
        service.updateMemberRole('g1', 'user1', 'moderator', 'requester1'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException when demoting self', async () => {
      prisma.groupMember.findUnique
        .mockResolvedValueOnce({ role: 'admin' })
        .mockResolvedValueOnce({ role: 'admin' });
      await expect(
        service.updateMemberRole('g1', 'requester1', 'member', 'requester1'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should update role successfully', async () => {
      prisma.groupMember.findUnique
        .mockResolvedValueOnce({ role: 'admin' })
        .mockResolvedValueOnce({ role: 'member' });
      prisma.groupMember.update.mockResolvedValue({ role: 'moderator' });
      await service.updateMemberRole('g1', 'user1', 'moderator', 'admin1');
      expect(prisma.groupMember.update).toHaveBeenCalled();
      expect(socket.broadcastToGroup).toHaveBeenCalled();
    });
  });

  describe('removeMember', () => {
    it('should throw ForbiddenException when removing group admin', async () => {
      await expect(
        service.removeMember('g1', 'admin1', 'admin1'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException when requester is not admin/mod', async () => {
      prisma.groupMember.findUnique.mockResolvedValue({ role: 'member' });
      await expect(
        service.removeMember('g1', 'user1', 'member1'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should remove member successfully', async () => {
      prisma.groupMember.findUnique
        .mockResolvedValueOnce({ role: 'admin' })
        .mockResolvedValueOnce({ role: 'member' });
      prisma.groupMember.delete.mockResolvedValue({});
      await service.removeMember('g1', 'user1', 'admin1');
      expect(prisma.groupMember.delete).toHaveBeenCalled();
      expect(socket.broadcastToGroup).toHaveBeenCalled();
    });
  });

  describe('transferOwnership', () => {
    it('should throw ForbiddenException if requester is not admin', async () => {
      prisma.group.findUnique.mockResolvedValue({
        id: 'g1',
        adminId: 'admin1',
      });
      await expect(
        service.transferOwnership('g1', 'user1', 'notadmin'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException when transferring to self', async () => {
      await expect(
        service.transferOwnership('g1', 'admin1', 'admin1'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should transfer ownership successfully', async () => {
      prisma.groupMember.findUnique.mockResolvedValue({ role: 'member' });
      prisma.$transaction.mockResolvedValue([]);
      await service.transferOwnership('g1', 'newadmin1', 'admin1');
      expect(prisma.$transaction).toHaveBeenCalled();
      expect(socket.broadcastToGroup).toHaveBeenCalled();
    });
  });

  describe('getMemberStats', () => {
    it('should throw NotFoundException for missing group', async () => {
      prisma.group.findUnique.mockResolvedValue(null);
      await expect(service.getMemberStats('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return stats', async () => {
      prisma.groupMember.count.mockResolvedValue(5);
      prisma.groupMember.groupBy.mockResolvedValue([
        { role: 'member', _count: { id: 4 } },
        { role: 'admin', _count: { id: 1 } },
      ]);
      const result = await service.getMemberStats('g1');
      expect(result.total).toBe(5);
      expect(result.byRole).toHaveLength(2);
    });
  });
});
