export interface CreateCourseData { title: string; description?: string; category: string; level?: string; thumbnail?: string; }
export interface UpdateCourseData { title?: string; description?: string; thumbnail?: string; isPublished?: boolean; }
