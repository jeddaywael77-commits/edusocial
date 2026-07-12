import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { SocketGateway } from '../socket/socket.gateway';
import { QueryGroupMembersDto } from './dto/group-members.dto';
export declare class GroupMembersService {
    private prisma;
    private socketGateway;
    private readonly logger;
    constructor(prisma: PrismaService, socketGateway: SocketGateway);
    getMembers(groupId: string, query: QueryGroupMembersDto): Promise<{
        data: ({
            user: {
                id: string;
                email: string;
                name: string;
                avatar: string | null;
                xp: number;
                level: number;
                isOnline: boolean;
            };
        } & {
            id: string;
            role: string;
            groupId: string;
            userId: string;
            joinedAt: Date;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    getMember(groupId: string, userId: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            avatar: string | null;
            bio: string | null;
            xp: number;
            level: number;
            isOnline: boolean;
            lastSeen: Date;
        };
        group: {
            id: string;
            name: string;
            type: import("@prisma/client").$Enums.GroupType;
            adminId: string;
        };
    } & {
        id: string;
        role: string;
        groupId: string;
        userId: string;
        joinedAt: Date;
    }>;
    updateMemberRole(groupId: string, userId: string, newRole: string, requesterId: string): Promise<{
        user: {
            id: string;
            name: string;
            avatar: string | null;
        };
    } & {
        id: string;
        role: string;
        groupId: string;
        userId: string;
        joinedAt: Date;
    }>;
    removeMember(groupId: string, userId: string, requesterId: string): Promise<{
        success: boolean;
    }>;
    transferOwnership(groupId: string, newAdminId: string, currentAdminId: string): Promise<{
        success: boolean;
    }>;
    getMemberStats(groupId: string): Promise<{
        total: number;
        byRole: (Prisma.PickEnumerable<Prisma.GroupMemberGroupByOutputType, "role"[]> & {
            _count: {
                id: number;
            };
        })[];
    }>;
}
