import { AdminService } from './admin.service';
import { QueryUsersDto, UpdateUserRoleDto, ToggleUserActiveDto, QueryReportsDto, ResolveReportDto, QueryAuditLogsDto } from './dto/admin.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboard(): Promise<{
        users: {
            total: number;
            active: number;
            online: number;
            newToday: number;
            byRole: (import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.UserGroupByOutputType, "role"[]> & {
                _count: {
                    id: number;
                };
            })[];
        };
        content: {
            posts: number;
            comments: number;
            groups: number;
            courses: number;
            media: number;
            newPostsToday: number;
        };
        reports: {
            pendingPostReports: number;
            pendingCommentReports: number;
            totalPending: number;
        };
    }>;
    getUsers(query: QueryUsersDto): Promise<{
        data: {
            id: string;
            email: string;
            name: string;
            avatar: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            school: string | null;
            department: string | null;
            xp: number;
            level: number;
            coins: number;
            isOnline: boolean;
            lastSeen: Date;
            isActive: boolean;
            emailVerified: boolean;
            createdAt: Date;
            _count: {
                comments: number;
                posts: number;
                groups: number;
                coursesEnrolled: number;
            };
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    getUserById(id: string): Promise<{
        id: string;
        email: string;
        name: string;
        avatar: string | null;
        coverPhoto: string | null;
        bio: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        school: string | null;
        department: string | null;
        xp: number;
        level: number;
        coins: number;
        isOnline: boolean;
        lastSeen: Date;
        isActive: boolean;
        emailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            comments: number;
            posts: number;
            reactions: number;
            groups: number;
            createdGroups: number;
            coursesEnrolled: number;
            taughtCourses: number;
            documents: number;
            media: number;
        };
    }>;
    updateRole(id: string, dto: UpdateUserRoleDto, adminId: string): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.UserRole;
    }>;
    toggleActive(id: string, dto: ToggleUserActiveDto, adminId: string): Promise<{
        id: string;
        email: string;
        name: string;
        isActive: boolean;
    }>;
    deleteUser(id: string, adminId: string): Promise<{
        success: boolean;
    }>;
    getReports(query: QueryReportsDto): Promise<{
        data: ({
            user: {
                id: string;
                name: string;
                avatar: string | null;
            };
            post: {
                id: string;
                type: import("@prisma/client").$Enums.PostType;
                author: {
                    id: string;
                    name: string;
                    avatar: string | null;
                };
                authorId: string;
                content: string;
                isDeleted: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            status: string;
            postId: string;
            userId: string;
            reason: string;
            details: string | null;
        })[];
        type: string;
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    } | {
        data: ({
            user: {
                id: string;
                name: string;
                avatar: string | null;
            };
            comment: {
                id: string;
                author: {
                    id: string;
                    name: string;
                    avatar: string | null;
                };
                authorId: string;
                content: string;
                isDeleted: boolean;
                postId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            status: string;
            userId: string;
            reason: string;
            details: string | null;
            commentId: string;
        })[];
        type: string;
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    resolvePostReport(id: string, dto: ResolveReportDto, adminId: string): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        postId: string;
        userId: string;
        reason: string;
        details: string | null;
    }>;
    resolveCommentReport(id: string, dto: ResolveReportDto, adminId: string): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        userId: string;
        reason: string;
        details: string | null;
        commentId: string;
    }>;
    getAuditLogs(query: QueryAuditLogsDto): Promise<{
        data: ({
            user: {
                id: string;
                email: string;
                name: string;
                avatar: string | null;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            userId: string | null;
            action: string;
            entity: string;
            entityId: string | null;
            oldData: import("@prisma/client/runtime/client").JsonValue | null;
            newData: import("@prisma/client/runtime/client").JsonValue | null;
            ip: string | null;
            userAgent: string | null;
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
}
