import { Calendar, MoreHorizontal, Check, Pencil, Trash2 } from 'lucide-react';
import { Task } from '@/types/task';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format, parseISO, isPast, isToday } from 'date-fns';

interface TaskCardProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task) => void;
  onClick: (task: Task) => void;
}

const statusStyles = {
  pending: 'bg-muted text-muted-foreground',
  'in-progress': 'bg-muted text-foreground/70',
  completed: 'bg-muted text-foreground',
};

const statusLabels = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  completed: 'Completed',
};

const priorityStyles = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
};

const priorityLabels = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export function TaskCard({ task, onEdit, onDelete, onStatusChange, onClick }: TaskCardProps) {
  const { user } = useAuthStore();
  const dueDate = parseISO(task.dueDate);
  const isOverdue = isPast(dueDate) && task.status !== 'completed';
  const isDueToday = isToday(dueDate);
  
  // Check if current user is the creator of this task
  const isCreator = (task as any).createdBy?._id === user?.id || (task as any).createdBy?.id === user?.id;

  return (
    <div
      className="task-card group cursor-pointer"
      onClick={() => onClick(task)}
    >
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <h3 className="font-medium text-sm text-foreground line-clamp-2 flex-1">
          {task.title}
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {isCreator && (
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(task); }}>
                <Pencil className="mr-2 h-3.5 w-3.5" />
                Edit
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onStatusChange(task); }}>
              <Check className="mr-2 h-3.5 w-3.5" />
              {task.status === 'completed' ? 'Mark Pending' : 'Mark Complete'}
            </DropdownMenuItem>
            {isCreator && (
              <DropdownMenuItem 
                onClick={(e) => { e.stopPropagation(); onDelete(task); }}
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className="text-xs text-muted-foreground line-clamp-2 mt-2">
        {task.description}
      </p>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
        <div className="flex items-center gap-2">
          <div className={cn(
            "flex items-center gap-1.5 text-xs",
            isOverdue && "text-foreground font-medium",
            isDueToday && !isOverdue && "text-muted-foreground"
          )}>
            <Calendar className="h-3.5 w-3.5" />
            <span>{format(dueDate, 'MMM d')}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={cn("status-badge", priorityStyles[task.priority])}>
            {priorityLabels[task.priority]}
          </span>
          <span className={cn("status-badge", statusStyles[task.status])}>
            {statusLabels[task.status]}
          </span>
          
          {task.assignee && (
            <div className="h-6 w-6 rounded-md bg-muted flex items-center justify-center border border-border">
              <span className="text-[10px] font-medium">
                {task.assignee.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
