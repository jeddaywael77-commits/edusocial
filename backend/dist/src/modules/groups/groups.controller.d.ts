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
            name: string;
            id: string;
            avatar: string | null;
        };
    } & {
        type: import("@prisma/client").$Enums.GroupType;
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        cover: string | null;
        adminId: string;
        isPublic: boolean;
    }>;
    findAll(): Promise<({
        _count: {
            members: number;
        };
        admin: {
            name: string;
            id: string;
            avatar: string | null;
        };
    } & {
        type: import("@prisma/client").$Enums.GroupType;
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        cover: string | null;
        adminId: string;
        isPublic: boolean;
    })[]>;
    findById(id: string): Promise<({
        _count: {
            posts: number;
            members: number;
        };
        admin: {
            name: string;
            id: string;
            avatar: string | null;
        };
        members: ({
            user: {
                name: string;
                id: string;
                avatar: string | null;
                isOnline: boolean;
            };
        } & {
            role: string;
            id: string;
            userId: string;
            groupId: string;
            joinedAt: Date;
        })[];
    } & {
        type: import("@prisma/client").$Enums.GroupType;
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        cover: string | null;
        adminId: string;
        isPublic: boolean;
    }) | null>;
    update(id: string, userId: string, dto: UpdateGroupDto): Promise<{
        type: import("@prisma/client").$Enums.GroupType;
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        cover: string | null;
        adminId: string;
        isPublic: boolean;
    }>;
    delete(id: string, userId: string): Promise<{
        type: import("@prisma/client").$Enums.GroupType;
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        cover: string | null;
        adminId: string;
        isPublic: boolean;
    }>;
    join(id: string, userId: string): Promise<{
        role: string;
        id: string;
        userId: string;
        groupId: string;
        joinedAt: Date;
    }>;
    leave(id: string, userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
export {};
