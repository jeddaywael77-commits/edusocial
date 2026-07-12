import { LikesService } from './likes.service';
import { ToggleReactionDto } from './dto/toggle-reaction.dto';
import { ReactionType } from '../../common/enums';
export declare class LikesController {
    private readonly likesService;
    constructor(likesService: LikesService);
    toggle(userId: string, dto: ToggleReactionDto): Promise<{
        action: string;
        type: null;
    } | {
        action: string;
        type: import("@prisma/client").$Enums.ReactionType;
    }>;
    getPostReactions(postId: string): Promise<{
        total: number;
        breakdown: {
            type: import("@prisma/client").$Enums.ReactionType;
            count: number;
        }[];
    }>;
    getPostReactors(postId: string, type?: ReactionType, limit?: number): Promise<{
        createdAt: Date;
        user: {
            id: string;
            name: string;
            avatar: string | null;
            level: number;
        };
        type: import("@prisma/client").$Enums.ReactionType;
    }[]>;
    getCommentReactions(commentId: string): Promise<{
        total: number;
        breakdown: {
            type: import("@prisma/client").$Enums.ReactionType;
            count: number;
        }[];
    }>;
}
