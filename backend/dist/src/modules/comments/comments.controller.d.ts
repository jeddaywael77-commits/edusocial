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
            level: number;
            name: string;
            role: import("@prisma/client").$Enums.UserRole;
            id: string;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        mentions: string[];
        authorId: string;
        isDeleted: boolean;
        deletedAt: Date | null;
        postId: string;
        parentId: string | null;
        depth: number;
        isEdited: boolean;
    }>;
    findAll(postId: string, userId: string, cursor?: string, limit?: number): Promise<{
        data: ({
            reactions: {
                type: import("@prisma/client").$Enums.ReactionType;
            }[];
            _count: {
                reactions: number;
                replies: number;
            };
            author: {
                level: number;
                name: string;
                role: import("@prisma/client").$Enums.UserRole;
                id: string;
                avatar: string | null;
            };
            replies: ({
                reactions: {
                    type: import("@prisma/client").$Enums.ReactionType;
                }[];
                author: {
                    level: number;
                    name: string;
                    role: import("@prisma/client").$Enums.UserRole;
                    id: string;
                    avatar: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                content: string;
                mentions: string[];
                authorId: string;
                isDeleted: boolean;
                deletedAt: Date | null;
                postId: string;
                parentId: string | null;
                depth: number;
                isEdited: boolean;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            mentions: string[];
            authorId: string;
            isDeleted: boolean;
            deletedAt: Date | null;
            postId: string;
            parentId: string | null;
            depth: number;
            isEdited: boolean;
        })[];
        nextCursor: string | null;
        hasNext: boolean;
    }>;
    findReplies(commentId: string, userId: string, cursor?: string, limit?: number): Promise<{
        data: ({
            reactions: {
                type: import("@prisma/client").$Enums.ReactionType;
            }[];
            _count: {
                reactions: number;
            };
            author: {
                level: number;
                name: string;
                role: import("@prisma/client").$Enums.UserRole;
                id: string;
                avatar: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            mentions: string[];
            authorId: string;
            isDeleted: boolean;
            deletedAt: Date | null;
            postId: string;
            parentId: string | null;
            depth: number;
            isEdited: boolean;
        })[];
        nextCursor: string | null;
        hasNext: boolean;
    }>;
    update(commentId: string, userId: string, dto: UpdateCommentDto): Promise<{
        reactions: {
            type: import("@prisma/client").$Enums.ReactionType;
        }[];
        author: {
            level: number;
            name: string;
            role: import("@prisma/client").$Enums.UserRole;
            id: string;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        mentions: string[];
        authorId: string;
        isDeleted: boolean;
        deletedAt: Date | null;
        postId: string;
        parentId: string | null;
        depth: number;
        isEdited: boolean;
    }>;
    delete(commentId: string, userId: string, userRole: string): Promise<{
        message: string;
    }>;
}
