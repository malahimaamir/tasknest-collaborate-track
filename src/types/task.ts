export interface Task {
  id: string; // 🟢 Add this
  title: string;
  description?: string; // 🟢 Should be optional if you’re not always sending it
  category: string;      // 🟢 Add this
  priority: 'low' | 'medium' | 'high'; // 🟢 Add this
  status: 'pending' | 'in-progress' | 'completed'; // You can adjust values as per your DB
  dueDate?: Date;        // 🟢 This should be a Date object in the frontend
  createdAt: Date;
  updatedAt: Date;
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