import { Test, TestingModule } from '@nestjs/testing';
import { GroupsService } from './groups.service';
import { PrismaService } from '../../database/prisma.service';

describe('GroupsService', () => {
  let service: GroupsService;
  let prisma: Record<string, any>;

  beforeEach(async () => {
    prisma = {
      group: {
        create: jest.fn().mockResolvedValue({
          id: 'g1',
          name: 'Test Group',
          adminId: 'admin1',
          type: 'CLUB',
        }),
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
        update: jest.fn().mockResolvedValue({}),
        delete: jest.fn().mockResolvedValue({}),
      },
      groupMember: {
        create: jest.fn().mockResolvedValue({}),
        deleteMany: jest.fn().mockResolvedValue({}),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<GroupsService>(GroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create group and add admin as member', async () => {
      const result = await service.create('admin1', { name: 'Test Group' });
      expect(prisma.group.create).toHaveBeenCalled();
      expect(prisma.groupMember.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            groupId: 'g1',
            userId: 'admin1',
            role: 'admin',
          }),
        }),
      );
      expect(result.id).toBe('g1');
    });
  });

  describe('findAll', () => {
    it('should return all groups', async () => {
      prisma.group.findMany.mockResolvedValue([
        {
          id: 'g1',
          name: 'Group 1',
          admin: { id: 'a1' },
          _count: { members: 5 },
        },
      ]);
      const result = await service.findAll();
      expect(result).toHaveLength(1);
      expect(prisma.group.findMany).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return group by id', async () => {
      prisma.group.findUnique.mockResolvedValue({
        id: 'g1',
        name: 'Test',
        admin: { id: 'a1' },
        members: [],
        _count: { members: 1, posts: 3 },
      });
      const result = await service.findById('g1');
      expect(result).not.toBeNull();
      expect(result!.id).toBe('g1');
    });
  });

  describe('update', () => {
    it('should update group when admin', async () => {
      prisma.group.findUnique.mockResolvedValue({
        id: 'g1',
        adminId: 'admin1',
      });
      prisma.group.update.mockResolvedValue({ id: 'g1', name: 'Updated' });
      await service.update('g1', 'admin1', { name: 'Updated' });
      expect(prisma.group.update).toHaveBeenCalled();
    });

    it('should throw when not admin', async () => {
      prisma.group.findUnique.mockResolvedValue({
        id: 'g1',
        adminId: 'admin1',
      });
      await expect(
        service.update('g1', 'user1', { name: 'Hacked' }),
      ).rejects.toThrow('Not authorized');
    });

    it('should throw when group not found', async () => {
      prisma.group.findUnique.mockResolvedValue(null);
      await expect(
        service.update('g1', 'admin1', { name: 'Updated' }),
      ).rejects.toThrow('Not authorized');
    });
  });

  describe('delete', () => {
    it('should delete group when admin', async () => {
      prisma.group.findUnique.mockResolvedValue({
        id: 'g1',
        adminId: 'admin1',
      });
      prisma.group.delete.mockResolvedValue({});
      await service.delete('g1', 'admin1');
      expect(prisma.group.delete).toHaveBeenCalled();
    });

    it('should throw when not admin', async () => {
      prisma.group.findUnique.mockResolvedValue({
        id: 'g1',
        adminId: 'admin1',
      });
      await expect(service.delete('g1', 'user1')).rejects.toThrow(
        'Not authorized',
      );
    });

    it('should throw when group not found', async () => {
      prisma.group.findUnique.mockResolvedValue(null);
      await expect(service.delete('g1', 'admin1')).rejects.toThrow(
        'Not authorized',
      );
    });
  });

  describe('join', () => {
    it('should create membership', async () => {
      prisma.groupMember.create.mockResolvedValue({});
      await service.join('g1', 'user1');
      expect(prisma.groupMember.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: { groupId: 'g1', userId: 'user1' } }),
      );
    });
  });

  describe('leave', () => {
    it('should remove membership', async () => {
      prisma.groupMember.deleteMany.mockResolvedValue({});
      await service.leave('g1', 'user1');
      expect(prisma.groupMember.deleteMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { groupId: 'g1', userId: 'user1' } }),
      );
    });
  });
});
