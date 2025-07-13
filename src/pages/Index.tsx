import { useState, useEffect } from 'react';
import { TaskDashboard } from '@/components/tasks/TaskDashboard';
import { Task, TaskFormData } from '@/types/task';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasknest-tasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        }));
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Failed to load tasks from localStorage:', error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasknest-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const handleCreateTask = (data: TaskFormData) => {
    const newTask: Task = {
      id: generateId(),
      ...data,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTasks(prev => [newTask, ...prev]);
    
    toast({
      title: "Task created!",
      description: `"${data.title}" has been added to your tasks.`,
    });
  };

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));

    const task = tasks.find(t => t.id === id);
    if (task && updates.status && updates.status !== task.status) {
      const statusMessages = {
        pending: 'moved to pending',
        'in-progress': 'started',
        completed: 'completed'
      };
      
      toast({
        title: "Task updated!",
        description: `"${task.title}" has been ${statusMessages[updates.status]}.`,
      });
    }
  };

  const handleDeleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(task => task.id !== id));
    
    if (task) {
      toast({
        title: "Task deleted",
        description: `"${task.title}" has been removed.`,
        variant: "destructive",
      });
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
