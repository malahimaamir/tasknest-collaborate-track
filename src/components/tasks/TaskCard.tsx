import { format } from 'date-fns';
import { Calendar, Clock, Edit, MoreVertical, Trash2, CheckCircle, Circle, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Task, PRIORITY_COLORS, STATUS_COLORS } from '@/types/task';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Task['status']) => void;
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
  
  const getStatusIcon = () => {
    switch (task.status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'in-progress':
        return <PlayCircle className="h-4 w-4 text-warning" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPriorityDot = () => {
    const colors = {
      low: 'bg-success',
      medium: 'bg-warning', 
      high: 'bg-destructive'
    };
    return <div className={cn("w-2 h-2 rounded-full", colors[task.priority])} />;
  };

  return (
    <Card className={cn(
      "group transition-smooth hover:shadow-medium cursor-pointer animate-fade-in",
      task.status === 'completed' && "opacity-75",
      isOverdue && "border-destructive/50"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const nextStatus = task.status === 'completed' ? 'pending' : 
                    task.status === 'pending' ? 'in-progress' : 'completed';
                  onStatusChange(task.id, nextStatus);
                }}
                className="hover:scale-110 transition-transform"
              >
                {getStatusIcon()}
              </button>
              
              <h3 className={cn(
                "font-medium text-sm",
                task.status === 'completed' && "line-through text-muted-foreground"
              )}>
                {task.title}
              </h3>
              
              {getPriorityDot()}
            </div>

            {task.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="text-xs">
                {task.category}
              </Badge>
              
              <Badge 
                variant="outline" 
                className={cn("text-xs", STATUS_COLORS[task.status])}
              >
                {task.status.replace('-', ' ')}
              </Badge>

              {task.dueDate && (
                <div className={cn(
                  "flex items-center gap-1 text-xs",
                  isOverdue ? "text-destructive" : "text-muted-foreground"
                )}>
                  <Calendar className="h-3 w-3" />
                  {format(new Date(task.dueDate), 'MMM dd')}
                </div>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Task
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onStatusChange(task.id, 'pending')}
                disabled={task.status === 'pending'}
              >
                <Circle className="mr-2 h-4 w-4" />
                Mark as Pending
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onStatusChange(task.id, 'in-progress')}
                disabled={task.status === 'in-progress'}
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                Mark as In Progress
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onStatusChange(task.id, 'completed')}
                disabled={task.status === 'completed'}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Completed
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete(task.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}