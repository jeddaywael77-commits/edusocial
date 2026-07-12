import { PostType, PostVisibility } from '../../../common/enums';
export declare class CreatePostDto {
    content: string;
    type?: PostType;
    visibility?: PostVisibility;
    images?: string[];
    video?: string;
    pdfUrl?: string;
    pdfName?: string;
    hashtags?: string[];
    mentions?: string[];
    groupId?: string;
    courseId?: string;
}
