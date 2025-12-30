import { X, Calendar, Flag, Clock, Pencil, Trash2 } from 'lucide-react';
import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

interface TaskDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const priorityLabels = {
  high: { label: 'High Priority', className: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' },
  medium: { label: 'Medium Priority', className: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' },
  low: { label: 'Low Priority', className: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' },
};

const statusLabels = {
  pending: { label: 'Pending', className: 'bg-muted text-muted-foreground' },
  'in-progress': { label: 'In Progress', className: 'bg-muted text-foreground/70' },
  completed: { label: 'Completed', className: 'bg-muted text-foreground' },
};

export function TaskDetailDrawer({ isOpen, onClose, task, onEdit, onDelete }: TaskDetailDrawerProps) {
  if (!task) return null;

  return (
    <>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          <div className="fixed right-0 top-0 h-full w-full sm:max-w-md bg-card border-l border-border z-50 flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
              <h2 className="text-base sm:text-lg font-medium">Task Details</h2>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(task)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(task)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="mb-6">
                <h1 className="text-lg sm:text-xl font-semibold mb-3">{task.title}</h1>
                <div className="flex flex-wrap gap-2">
                  <span className={cn(
                    "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border",
                    priorityLabels[task.priority].className
                  )}>
                    <Flag className="h-3 w-3 mr-1.5" />
                    {priorityLabels[task.priority].label}
                  </span>
                  <span className={cn(
                    "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium",
                    statusLabels[task.status].className
                  )}>
                    {statusLabels[task.status].label}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                <p className="text-sm leading-relaxed">{task.description}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-md bg-muted border border-border">
                  <div className="h-9 w-9 rounded-md bg-background flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Due Date</p>
                    <p className="text-sm font-medium">{format(parseISO(task.dueDate), 'MMMM d, yyyy')}</p>
                  </div>
                </div>

                {task.assignee && (
                  <div className="flex items-center gap-3 p-3 rounded-md bg-muted border border-border">
                    <div className="h-9 w-9 rounded-md bg-background flex items-center justify-center">
                      <span className="text-xs font-medium">
                        {task.assignee.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Assigned to</p>
                      <p className="text-sm font-medium">{task.assignee.name}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 rounded-md bg-muted border border-border">
                  <div className="h-9 w-9 rounded-md bg-background flex items-center justify-center">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="text-sm font-medium">
                      {format(parseISO(task.createdAt), 'MMM d, yyyy \'at\' h:mm a')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-md bg-muted border border-border">
                  <div className="h-9 w-9 rounded-md bg-background flex items-center justify-center">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Last Updated</p>
                    <p className="text-sm font-medium">
                      {format(parseISO(task.updatedAt), 'MMM d, yyyy \'at\' h:mm a')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-border">
              <Button className="w-full" onClick={() => onEdit(task)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Task
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
