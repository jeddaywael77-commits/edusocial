import { GroupsService } from './groups.service';
declare class CreateGroupDto {
    name: string;
    description?: string;
    type?: string;
    cover?: string;
}
declare class UpdateGroupDto {
    name?: string;
    description?: string;
    cover?: string;
}
export declare class GroupsController {
    private readonly groupsService;
    constructor(groupsService: GroupsService);
    create(userId: string, dto: CreateGroupDto): Promise<{
        admin: {
            id: string;
            name: string;
            avatar: string | null;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        cover: string | null;
        type: import("@prisma/client").$Enums.GroupType;
        isPublic: boolean;
        adminId: string;
    }>;
    findAll(): Promise<({
        admin: {
            id: string;
            name: string;
            avatar: string | null;
        };
        _count: {
            members: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        cover: string | null;
        type: import("@prisma/client").$Enums.GroupType;
        isPublic: boolean;
        adminId: string;
    })[]>;
    findById(id: string): Promise<({
        admin: {
            id: string;
            name: string;
            avatar: string | null;
        };
        members: ({
            user: {
                id: string;
                name: string;
                avatar: string | null;
                isOnline: boolean;
            };
        } & {
            id: string;
            role: string;
            groupId: string;
            userId: string;
            joinedAt: Date;
        })[];
        _count: {
            posts: number;
            members: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        cover: string | null;
        type: import("@prisma/client").$Enums.GroupType;
        isPublic: boolean;
        adminId: string;
    }) | null>;
    update(id: string, userId: string, dto: UpdateGroupDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        cover: string | null;
        type: import("@prisma/client").$Enums.GroupType;
        isPublic: boolean;
        adminId: string;
    }>;
    delete(id: string, userId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        cover: string | null;
        type: import("@prisma/client").$Enums.GroupType;
        isPublic: boolean;
        adminId: string;
    }>;
    join(id: string, userId: string): Promise<{
        id: string;
        role: string;
        groupId: string;
        userId: string;
        joinedAt: Date;
    }>;
    leave(id: string, userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
export {};
