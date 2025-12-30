import { useState, useEffect } from 'react';
import { X, Calendar, User, Flag, AlertCircle } from 'lucide-react';
import { Task, TaskFormData, Priority, Status } from '@/types/task';
import { useTaskStore } from '@/store/taskStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { api } from '@/services/api';

interface TaskDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  mode: 'create' | 'edit';
}

const initialFormData: TaskFormData = {
  title: '',
  description: '',
  dueDate: new Date().toISOString().split('T')[0],
  priority: 'medium',
  status: 'pending',
  assigneeId: undefined,
};

export function TaskDrawer({ isOpen, onClose, task, mode }: TaskDrawerProps) {
  const { addTask, updateTask } = useTaskStore();
  const [formData, setFormData] = useState<TaskFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myTeam, setMyTeam] = useState<any[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(false);

  // Load my team members
  useEffect(() => {
    const loadTeam = async () => {
      setLoadingTeam(true);
      try {
        const team = await api.getMyTeam();
        setMyTeam(team);
      } catch (error) {
        console.error('Failed to load team:', error);
      }
      setLoadingTeam(false);
    };
    
    if (isOpen) {
      loadTeam();
    }
  }, [isOpen]);

  useEffect(() => {
    if (task && mode === 'edit') {
      setFormData({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        status: task.status,
        assigneeId: task.assignee?.id,
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [task, mode, isOpen]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TaskFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      if (mode === 'create') {
        await addTask(formData);
        toast.success('Task created');
      } else if (task) {
        await updateTask(task.id, formData);
        toast.success('Task updated');
      }
      onClose();
    } catch (error) {
      toast.error('Failed to save task');
    }

    setIsSubmitting(false);
  };

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
              <h2 className="text-base sm:text-lg font-medium">
                {mode === 'create' ? 'Create New Task' : 'Edit Task'}
              </h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-2">
                  Title
                  {errors.title && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.title}
                    </span>
                  )}
                </Label>
                <Input
                  id="title"
                  placeholder="Enter task title..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={cn(errors.title && "border-foreground/50")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2">
                  Description
                  {errors.description && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.description}
                    </span>
                  )}
                </Label>
                <Textarea
                  id="description"
                  placeholder="Enter task description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={cn("min-h-[120px] resize-none", errors.description && "border-foreground/50")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Due Date
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className={cn(errors.dueDate && "border-foreground/50")}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Flag className="h-4 w-4 text-muted-foreground" />
                  Priority
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: Priority) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-500" />
                        High
                      </span>
                    </SelectItem>
                    <SelectItem value="medium">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                        Medium
                      </span>
                    </SelectItem>
                    <SelectItem value="low">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Low
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: Status) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Assignee (from My Team)
                </Label>
                <Select
                  value={formData.assigneeId || 'none'}
                  onValueChange={(value) => setFormData({ ...formData, assigneeId: value === 'none' ? undefined : value })}
                  disabled={loadingTeam}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingTeam ? "Loading team..." : "Select from your team..."} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      <span className="text-muted-foreground">No assignee</span>
                    </SelectItem>
                    {myTeam.length === 0 && !loadingTeam ? (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        No team members yet. Add members in Team page.
                      </div>
                    ) : (
                      myTeam.map((user) => {
                        const userId = user.id || user._id;
                        return (
                          <SelectItem key={userId} value={userId}>
                            <span className="flex items-center gap-2">
                              <span className="h-5 w-5 rounded bg-muted flex items-center justify-center text-[10px] font-medium">
                                {user.name.split(' ').map((n: string) => n[0]).join('')}
                              </span>
                              {user.name}
                            </span>
                          </SelectItem>
                        );
                      })
                    )}
                  </SelectContent>
                </Select>
                {myTeam.length === 0 && !loadingTeam && (
                  <p className="text-xs text-muted-foreground">
                    Add team members in the Team page to assign tasks
                  </p>
                )}
              </div>
            </form>

            <div className="p-4 sm:p-6 border-t border-border flex gap-2 sm:gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : mode === 'create' ? (
                  'Create Task'
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
