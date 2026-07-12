export interface CreateAssignmentData { title: string; dueDate: string; description?: string; maxScore?: number; courseId?: string; }
export interface UpdateAssignmentData { title?: string; description?: string; dueDate?: string; maxScore?: number; }
