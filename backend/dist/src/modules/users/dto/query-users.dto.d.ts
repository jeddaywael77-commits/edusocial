import { UserRole } from '../../../common/enums';
export declare class QueryUsersDto {
    search?: string;
    role?: UserRole;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
