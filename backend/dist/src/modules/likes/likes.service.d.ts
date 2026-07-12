import { PrismaService } from '../../database/prisma.service';
import { ToggleReactionDto } from './dto/toggle-reaction.dto';
import { ReactionType } from '../../common/enums';
export declare class LikesService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    toggle(userId: string, dto: ToggleReactionDto): Promise<{
        action: string;
        type: null;
    } | {
        action: string;
        type: import("@prisma/client").$Enums.ReactionType;
    }>;
    private togglePostReaction;
    private toggleCommentReaction;
    getPostReactions(postId: string): Promise<{
        total: number;
        breakdown: {
            type: import("@prisma/client").$Enums.ReactionType;
            count: number;
        }[];
    }>;
    getCommentReactions(commentId: string): Promise<{
        total: number;
        breakdown: {
            type: import("@prisma/client").$Enums.ReactionType;
            count: number;
        }[];
    }>;
    getPostReactors(postId: string, type?: ReactionType, limit?: number): Promise<{
        user: {
            level: number;
            name: string;
            id: string;
            avatar: string | null;
        };
        type: import("@prisma/client").$Enums.ReactionType;
        createdAt: Date;
    }[]>;
}
