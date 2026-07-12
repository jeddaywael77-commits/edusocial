import { PostVisibility, PostType } from '../../../common/enums';
export declare class QueryPostsDto {
    search?: string;
    authorId?: string;
    groupId?: string;
    courseId?: string;
    visibility?: PostVisibility;
    type?: PostType;
    hashtag?: string;
    cursor?: string;
    limit?: number;
}
