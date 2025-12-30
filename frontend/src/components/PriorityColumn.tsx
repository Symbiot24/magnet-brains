import { Task, Priority } from '@/types/task';
import { TaskCard } from './TaskCard';
import { cn } from '@/lib/utils';
import { Circle } from 'lucide-react';

interface PriorityColumnProps {
  priority: Priority;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onStatusChange: (task: Task) => void;
  onTaskClick: (task: Task) => void;
}

const priorityConfig = {
  high: {
    label: 'High Priority',
    icon: Circle,
    className: 'priority-high',
    iconColor: 'text-red-500',
    countBg: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
  medium: {
    label: 'Medium Priority',
    icon: Circle,
    className: 'priority-medium',
    iconColor: 'text-amber-500',
    countBg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  low: {
    label: 'Low Priority',
    icon: Circle,
    className: 'priority-low',
    iconColor: 'text-emerald-500',
    countBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
};

export function PriorityColumn({
  priority,
  tasks,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onTaskClick,
}: PriorityColumnProps) {
  const config = priorityConfig[priority];
  const Icon = config.icon;

  return (
    <div className={cn("priority-column flex flex-col min-h-[200px]", config.className)}>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Icon className={cn("h-3 w-3", config.iconColor)} />
          <h2 className="font-medium text-xs sm:text-sm">{config.label}</h2>
        </div>
        <span className={cn("text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded", config.countBg)}>
          {tasks.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 sm:space-y-3 pr-1 -mr-1">
        {tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            index={index}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onStatusChange={onStatusChange}
            onClick={onTaskClick}
          />
        ))}

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Icon className="h-6 w-6 mb-2 opacity-30" />
            <p className="text-sm">No tasks</p>
          </div>
        )}
      </div>
    </div>
  );
}
