export interface SearchIndexConfig {
    name: string;
    primaryKey: string;
    searchableAttributes: string[];
    filterableAttributes: string[];
    sortableAttributes: string[];
    rankingRules: string[];
}
export declare const SEARCH_INDEXES: {
    readonly users: {
        readonly name: "users";
        readonly primaryKey: "id";
        readonly searchableAttributes: readonly ["name", "username", "email", "bio", "school"];
        readonly filterableAttributes: readonly ["role", "isVerified", "createdAt"];
        readonly sortableAttributes: readonly ["name", "createdAt", "followersCount"];
        readonly rankingRules: readonly ["words", "typo", "proximity", "attribute", "sort", "exactness"];
    };
    readonly posts: {
        readonly name: "posts";
        readonly primaryKey: "id";
        readonly searchableAttributes: readonly ["content", "authorName", "authorUsername"];
        readonly filterableAttributes: readonly ["authorId", "visibility", "hasMedia", "createdAt"];
        readonly sortableAttributes: readonly ["createdAt", "likesCount", "commentsCount"];
        readonly rankingRules: readonly ["words", "typo", "proximity", "attribute", "sort", "exactness"];
    };
    readonly courses: {
        readonly name: "courses";
        readonly primaryKey: "id";
        readonly searchableAttributes: readonly ["title", "description", "teacherName", "category", "tags"];
        readonly filterableAttributes: readonly ["teacherId", "category", "level", "isPublished", "createdAt"];
        readonly sortableAttributes: readonly ["createdAt", "enrolledCount", "rating"];
        readonly rankingRules: readonly ["words", "typo", "proximity", "attribute", "sort", "exactness"];
    };
    readonly groups: {
        readonly name: "groups";
        readonly primaryKey: "id";
        readonly searchableAttributes: readonly ["name", "description", "category"];
        readonly filterableAttributes: readonly ["creatorId", "category", "privacy", "createdAt"];
        readonly sortableAttributes: readonly ["createdAt", "membersCount"];
        readonly rankingRules: readonly ["words", "typo", "proximity", "attribute", "sort", "exactness"];
    };
    readonly marketplace: {
        readonly name: "marketplace";
        readonly primaryKey: "id";
        readonly searchableAttributes: readonly ["title", "description", "category", "tags"];
        readonly filterableAttributes: readonly ["sellerId", "category", "condition", "isAvailable", "createdAt"];
        readonly sortableAttributes: readonly ["createdAt", "price", "viewsCount"];
        readonly rankingRules: readonly ["words", "typo", "proximity", "attribute", "sort", "exactness"];
    };
    readonly documents: {
        readonly name: "documents";
        readonly primaryKey: "id";
        readonly searchableAttributes: readonly ["title", "description", "category", "tags"];
        readonly filterableAttributes: readonly ["ownerId", "category", "visibility", "createdAt"];
        readonly sortableAttributes: readonly ["createdAt", "downloadsCount", "viewsCount"];
        readonly rankingRules: readonly ["words", "typo", "proximity", "attribute", "sort", "exactness"];
    };
    readonly lessons: {
        readonly name: "lessons";
        readonly primaryKey: "id";
        readonly searchableAttributes: readonly ["title", "description", "content"];
        readonly filterableAttributes: readonly ["courseId", "createdAt"];
        readonly sortableAttributes: readonly ["createdAt", "order"];
        readonly rankingRules: readonly ["words", "typo", "proximity", "attribute", "sort", "exactness"];
    };
};
export type SearchIndexName = keyof typeof SEARCH_INDEXES;
