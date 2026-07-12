export declare class QueryGroupMembersDto {
    search?: string;
    role?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export declare class UpdateMemberRoleDto {
    role: string;
}
export declare class TransferOwnershipDto {
    newAdminId: string;
}
