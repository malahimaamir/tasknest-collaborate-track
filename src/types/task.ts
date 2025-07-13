export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  category: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
}

export interface TaskFormData {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate?: Date;
}

export type TaskFilter = 'all' | 'pending' | 'in-progress' | 'completed';

export const TASK_CATEGORIES = [
  'work',
  'personal',
  'health',
  'learning',
  'shopping',
  'other'
] as const;

export const PRIORITY_COLORS = {
  low: 'text-success',
  medium: 'text-warning',
  high: 'text-destructive'
} as const;

export const STATUS_COLORS = {
  pending: 'text-muted-foreground',
  'in-progress': 'text-warning',
  completed: 'text-success'
} as const;