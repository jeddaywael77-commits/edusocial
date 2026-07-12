export interface CreateExamData { title: string; courseId: string; timeLimit: number; dueDate: string; description?: string; questions?: unknown; }
export interface UpdateExamData { title?: string; description?: string; timeLimit?: number; dueDate?: string; questions?: unknown; }
