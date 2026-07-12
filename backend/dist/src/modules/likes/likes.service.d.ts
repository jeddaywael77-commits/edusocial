import { PrismaService } from '../../database/prisma.service';
import { ToggleReactionDto } from './dto/toggle-reaction.dto';
import { ReactionType } from '../../common/enums';
import { SocketGateway } from '../socket/socket.gateway';
export declare class LikesService {
    private prisma;
    private socketGateway;
    private readonly logger;
    constructor(prisma: PrismaService, socketGateway: SocketGateway);
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
        createdAt: Date;
        user: {
            id: string;
            name: string;
            avatar: string | null;
            level: number;
        };
        type: import("@prisma/client").$Enums.ReactionType;
    }[]>;
}
