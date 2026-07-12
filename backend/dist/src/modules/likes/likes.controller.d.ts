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
        user: {
            level: number;
            name: string;
            id: string;
            avatar: string | null;
        };
        type: import("@prisma/client").$Enums.ReactionType;
        createdAt: Date;
    }[]>;
    getCommentReactions(commentId: string): Promise<{
        total: number;
        breakdown: {
            type: import("@prisma/client").$Enums.ReactionType;
            count: number;
        }[];
    }>;
}
