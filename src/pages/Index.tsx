import { useState, useEffect } from 'react';
import { TaskDashboard } from '@/components/tasks/TaskDashboard';
import { Task, TaskFormData } from '@/types/task';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/axios';

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  type TaskRaw = {
    _id: string;
    title: string;
    description?: string;
    category: string;
    priority: 'low' | 'medium' | 'high';
    status: string;
    dueDate?: string;
    createdAt: string;
    updatedAt: string;
  };

  // ✅ Load tasks on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<TaskRaw[]>('/tasks');
        const tasks: Task[] = res.data.map(t => ({
          id: t._id,
          title: t.title,
          description: t.description,
          category: t.category,
          priority: t.priority,
          status: t.status as Task['status'],
          dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
          createdAt: new Date(t.createdAt),
          updatedAt: new Date(t.updatedAt),
        }));
        setTasks(tasks);
      } catch (error) {
        console.error("Failed to load tasks:", error);
      }
    })();
  }, []);

  // ✅ Create task
  const handleCreateTask = async (data: TaskFormData) => {
    try {
      const newTask = {
        ...data,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const res = await api.post('/tasks', newTask);
      const createdTask = {
        ...res.data,
        id: res.data._id, // normalize
      };
      setTasks(prev => [createdTask, ...prev]);

      toast({
        title: 'Task created!',
        description: `"${data.title}" has been added.`,
      });
    } catch (error) {
      console.error('Create task failed:', error);
    }
  };

  // ✅ Update task
  const handleUpdateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const res = await api.put(`/tasks/${id}`, {
        ...updates,
        updatedAt: new Date(),
      });

      const updatedTask = {
        ...res.data,
        id: res.data._id,
      };

      setTasks(prev => prev.map(task => (task.id === id ? updatedTask : task)));

      if (updates.status) {
        const statusMessages = {
          pending: 'moved to pending',
          'in-progress': 'started',
          completed: 'completed',
        };

        toast({
          title: 'Task updated!',
          description: `"${updatedTask.title}" has been ${statusMessages[updates.status]}.`,
        });
      }
    } catch (error) {
      console.error('Update task failed:', error);
    }
  };

  // ✅ Delete task
  const handleDeleteTask = async (id: string) => {
    try {
      const taskToDelete = tasks.find(t => t.id === id);
      await api.delete(`/tasks/${id}`);

      setTasks(prev => prev.filter(t => t.id !== id));

      if (taskToDelete) {
        toast({
          title: 'Task deleted',
          description: `"${taskToDelete.title}" has been removed.`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <TaskDashboard
      tasks={tasks}
      onCreateTask={handleCreateTask}
      onUpdateTask={handleUpdateTask}
      onDeleteTask={handleDeleteTask}
    />
  );
};

export default Index;
