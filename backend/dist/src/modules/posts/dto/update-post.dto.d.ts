import { PostType, PostVisibility, PostStatus } from '../../../common/enums';
export declare class UpdatePostDto {
    content?: string;
    type?: PostType;
    visibility?: PostVisibility;
    status?: PostStatus;
    images?: string[];
    video?: string;
    hashtags?: string[];
    mentions?: string[];
}
