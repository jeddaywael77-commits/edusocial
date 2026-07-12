export interface CreateLessonData { title: string; courseId: string; content?: string; videoUrl?: string; pdfUrl?: string; duration?: number; order?: number; }
export interface UpdateLessonData { title?: string; content?: string; videoUrl?: string; pdfUrl?: string; duration?: number; order?: number; isPublished?: boolean; }
