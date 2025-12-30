import { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import { useTaskStore } from '@/store/taskStore';
import { DashboardLayout } from '@/components/DashboardLayout';
import { TaskCard } from '@/components/TaskCard';
import { TaskDrawer } from '@/components/TaskDrawer';
import { TaskDetailDrawer } from '@/components/TaskDetailDrawer';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { Pagination } from '@/components/Pagination';
import { TaskCardSkeleton } from '@/components/Skeletons';
import { toast } from 'sonner';
import { Filter, SortAsc } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function TasksPage() {
  const {
    isLoading,
    getPaginatedTasks,
    getTotalPages,
    currentPage,
    setCurrentPage,
    updateTaskStatus,
    deleteTask,
    selectedTask,
    setSelectedTask,
    fetchTasks,
    fetchUsers,
  } = useTaskStore();

  const [taskDrawerOpen, setTaskDrawerOpen] = useState(false);
  const [taskDetailOpen, setTaskDetailOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, [fetchTasks, fetchUsers]);

  const handleNewTask = () => {
    setTaskToEdit(null);
    setTaskDrawerOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setTaskDetailOpen(false);
    setTaskDrawerOpen(true);
  };

  const handleDeleteTask = (task: Task) => {
    setTaskToDelete(task);
    setTaskDetailOpen(false);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;

    setIsDeleting(true);
    try {
      await deleteTask(taskToDelete.id);
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    }

    setIsDeleting(false);
    setDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  const handleStatusChange = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await updateTaskStatus(task.id, newStatus);
      toast.success(
        newStatus === 'completed' ? 'Task completed' : 'Task reopened'
      );
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setTaskDetailOpen(true);
  };

  let tasks = getPaginatedTasks();
  
  if (statusFilter !== 'all') {
    tasks = tasks.filter((t) => t.status === statusFilter);
  }
  if (priorityFilter !== 'all') {
    tasks = tasks.filter((t) => t.priority === priorityFilter);
  }

  return (
    <DashboardLayout onNewTask={handleNewTask}>
      <div className="p-4 md:p-6">
        <div className="flex flex-col gap-4 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold mb-1">
              All Tasks
            </h1>
            <p className="text-sm text-muted-foreground">
              View and manage all your tasks
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SortAsc className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <TaskCardSkeleton key={i} />)
            : tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                  onClick={handleTaskClick}
                />
              ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={getTotalPages()}
          onPageChange={setCurrentPage}
        />
      </div>

      <TaskDrawer
        isOpen={taskDrawerOpen}
        onClose={() => {
          setTaskDrawerOpen(false);
          setTaskToEdit(null);
        }}
        task={taskToEdit}
        mode={taskToEdit ? 'edit' : 'create'}
      />

      <TaskDetailDrawer
        isOpen={taskDetailOpen}
        onClose={() => {
          setTaskDetailOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title={taskToDelete?.title || ''}
        isLoading={isDeleting}
      />
    </DashboardLayout>
  );
}
