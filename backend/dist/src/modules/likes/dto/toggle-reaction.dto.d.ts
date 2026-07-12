import { ReactionType } from '../../../common/enums';
export declare class ToggleReactionDto {
    type: ReactionType;
    postId?: string;
    commentId?: string;
}
