import { PrismaService } from '../../database/prisma.service';
export declare class GroupsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(adminId: string, data: {
        name: string;
        description?: string;
        type?: string;
        cover?: string;
    }): Promise<{
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
    update(id: string, userId: string, data: {
        name?: string;
        description?: string;
        cover?: string;
    }): Promise<{
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
    join(groupId: string, userId: string): Promise<{
        role: string;
        id: string;
        userId: string;
        groupId: string;
        joinedAt: Date;
    }>;
    leave(groupId: string, userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
