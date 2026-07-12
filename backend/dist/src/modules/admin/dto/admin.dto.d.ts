import { UserRole } from '../../../common/enums';
export declare class QueryUsersDto {
    search?: string;
    role?: UserRole;
    isActive?: boolean;
    isOnline?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export declare class UpdateUserRoleDto {
    role: UserRole;
}
export declare class ToggleUserActiveDto {
    isActive: boolean;
}
export declare class QueryReportsDto {
    type?: 'post' | 'comment';
    status?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export declare class ResolveReportDto {
    status: 'resolved' | 'dismissed' | 'escalated';
    note?: string;
}
export declare class QueryAuditLogsDto {
    userId?: string;
    action?: string;
    entity?: string;
    page?: number;
    limit?: number;
}
