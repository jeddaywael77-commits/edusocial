"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPaginationArgs = buildPaginationArgs;
exports.buildPaginatedResponse = buildPaginatedResponse;
function buildPaginationArgs(query) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';
    return { page, limit, skip, sortBy, sortOrder };
}
function buildPaginatedResponse(data, total, page, limit) {
    const totalPages = Math.ceil(total / limit);
    return {
        data,
        meta: {
            total,
            page,
            limit,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
        },
    };
}
//# sourceMappingURL=prisma-helpers.js.map