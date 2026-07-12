import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    create(postId: string, userId: string, dto: CreateCommentDto): Promise<{
        reactions: {
            type: import("@prisma/client").$Enums.ReactionType;
        }[];
        author: {
            id: string;
            name: string;
            avatar: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            level: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        authorId: string;
        content: string;
        mentions: string[];
        isDeleted: boolean;
        deletedAt: Date | null;
        depth: number;
        isEdited: boolean;
        postId: string;
        parentId: string | null;
    }>;
    findAll(postId: string, userId: string, cursor?: string, limit?: number): Promise<{
        data: ({
            reactions: {
                type: import("@prisma/client").$Enums.ReactionType;
            }[];
            author: {
                id: string;
                name: string;
                avatar: string | null;
                role: import("@prisma/client").$Enums.UserRole;
                level: number;
            };
            replies: ({
                reactions: {
                    type: import("@prisma/client").$Enums.ReactionType;
                }[];
                author: {
                    id: string;
                    name: string;
                    avatar: string | null;
                    role: import("@prisma/client").$Enums.UserRole;
                    level: number;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                authorId: string;
                content: string;
                mentions: string[];
                isDeleted: boolean;
                deletedAt: Date | null;
                depth: number;
                isEdited: boolean;
                postId: string;
                parentId: string | null;
            })[];
            _count: {
                reactions: number;
                replies: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            authorId: string;
            content: string;
            mentions: string[];
            isDeleted: boolean;
            deletedAt: Date | null;
            depth: number;
            isEdited: boolean;
            postId: string;
            parentId: string | null;
        })[];
        nextCursor: string | null;
        hasNext: boolean;
    }>;
    findReplies(commentId: string, userId: string, cursor?: string, limit?: number): Promise<{
        data: ({
            reactions: {
                type: import("@prisma/client").$Enums.ReactionType;
            }[];
            author: {
                id: string;
                name: string;
                avatar: string | null;
                role: import("@prisma/client").$Enums.UserRole;
                level: number;
            };
            _count: {
                reactions: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            authorId: string;
            content: string;
            mentions: string[];
            isDeleted: boolean;
            deletedAt: Date | null;
            depth: number;
            isEdited: boolean;
            postId: string;
            parentId: string | null;
        })[];
        nextCursor: string | null;
        hasNext: boolean;
    }>;
    update(commentId: string, userId: string, dto: UpdateCommentDto): Promise<{
        reactions: {
            type: import("@prisma/client").$Enums.ReactionType;
        }[];
        author: {
            id: string;
            name: string;
            avatar: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            level: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        authorId: string;
        content: string;
        mentions: string[];
        isDeleted: boolean;
        deletedAt: Date | null;
        depth: number;
        isEdited: boolean;
        postId: string;
        parentId: string | null;
    }>;
    delete(commentId: string, userId: string, userRole: string): Promise<{
        message: string;
    }>;
}
