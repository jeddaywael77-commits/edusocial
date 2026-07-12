export interface SearchIndexConfig {
  name: string;
  primaryKey: string;
  searchableAttributes: string[];
  filterableAttributes: string[];
  sortableAttributes: string[];
  rankingRules: string[];
}

export const SEARCH_INDEXES = {
  users: {
    name: 'users',
    primaryKey: 'id',
    searchableAttributes: ['name', 'username', 'email', 'bio', 'school'],
    filterableAttributes: ['role', 'isVerified', 'createdAt'],
    sortableAttributes: ['name', 'createdAt', 'followersCount'],
    rankingRules: ['words', 'typo', 'proximity', 'attribute', 'sort', 'exactness'],
  },
  posts: {
    name: 'posts',
    primaryKey: 'id',
    searchableAttributes: ['content', 'authorName', 'authorUsername'],
    filterableAttributes: ['authorId', 'visibility', 'hasMedia', 'createdAt'],
    sortableAttributes: ['createdAt', 'likesCount', 'commentsCount'],
    rankingRules: ['words', 'typo', 'proximity', 'attribute', 'sort', 'exactness'],
  },
  courses: {
    name: 'courses',
    primaryKey: 'id',
    searchableAttributes: ['title', 'description', 'teacherName', 'category', 'tags'],
    filterableAttributes: ['teacherId', 'category', 'level', 'isPublished', 'createdAt'],
    sortableAttributes: ['createdAt', 'enrolledCount', 'rating'],
    rankingRules: ['words', 'typo', 'proximity', 'attribute', 'sort', 'exactness'],
  },
  groups: {
    name: 'groups',
    primaryKey: 'id',
    searchableAttributes: ['name', 'description', 'category'],
    filterableAttributes: ['creatorId', 'category', 'privacy', 'createdAt'],
    sortableAttributes: ['createdAt', 'membersCount'],
    rankingRules: ['words', 'typo', 'proximity', 'attribute', 'sort', 'exactness'],
  },
  marketplace: {
    name: 'marketplace',
    primaryKey: 'id',
    searchableAttributes: ['title', 'description', 'category', 'tags'],
    filterableAttributes: ['sellerId', 'category', 'condition', 'isAvailable', 'createdAt'],
    sortableAttributes: ['createdAt', 'price', 'viewsCount'],
    rankingRules: ['words', 'typo', 'proximity', 'attribute', 'sort', 'exactness'],
  },
  documents: {
    name: 'documents',
    primaryKey: 'id',
    searchableAttributes: ['title', 'description', 'category', 'tags'],
    filterableAttributes: ['ownerId', 'category', 'visibility', 'createdAt'],
    sortableAttributes: ['createdAt', 'downloadsCount', 'viewsCount'],
    rankingRules: ['words', 'typo', 'proximity', 'attribute', 'sort', 'exactness'],
  },
  lessons: {
    name: 'lessons',
    primaryKey: 'id',
    searchableAttributes: ['title', 'description', 'content'],
    filterableAttributes: ['courseId', 'createdAt'],
    sortableAttributes: ['createdAt', 'order'],
    rankingRules: ['words', 'typo', 'proximity', 'attribute', 'sort', 'exactness'],
  },
} as const;

export type SearchIndexName = keyof typeof SEARCH_INDEXES;
