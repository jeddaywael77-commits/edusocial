import { GroupMembersService } from './group-members.service';
import { QueryGroupMembersDto, UpdateMemberRoleDto, TransferOwnershipDto } from './dto/group-members.dto';
export declare class GroupMembersController {
    private readonly groupMembersService;
    constructor(groupMembersService: GroupMembersService);
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
    getMemberStats(groupId: string): Promise<{
        total: number;
        byRole: (import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.GroupMemberGroupByOutputType, "role"[]> & {
            _count: {
                id: number;
            };
        })[];
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
    updateRole(groupId: string, userId: string, dto: UpdateMemberRoleDto, requesterId: string): Promise<{
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
    transferOwnership(groupId: string, dto: TransferOwnershipDto, currentAdminId: string): Promise<{
        success: boolean;
    }>;
}
