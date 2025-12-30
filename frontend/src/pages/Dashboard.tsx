import { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import { useTaskStore } from '@/store/taskStore';
import { useAuthStore } from '@/store/authStore';
import { DashboardLayout } from '@/components/DashboardLayout';
import { PriorityColumn } from '@/components/PriorityColumn';
import { TaskDrawer } from '@/components/TaskDrawer';
import { TaskDetailDrawer } from '@/components/TaskDetailDrawer';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { KanbanBoardSkeleton } from '@/components/Skeletons';
import { toast } from 'sonner';
import { BarChart3, CheckCircle2, Clock, ListTodo } from 'lucide-react';

export default function Dashboard() {
  const {
    tasks,
    isLoading,
    getTasksByPriority,
    updateTaskStatus,
    deleteTask,
    selectedTask,
    setSelectedTask,
    fetchTasks,
    fetchUsers,
  } = useTaskStore();

  const { user } = useAuthStore();

  const [taskDrawerOpen, setTaskDrawerOpen] = useState(false);
  const [taskDetailOpen, setTaskDetailOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, [fetchTasks, fetchUsers]);

  // Filter to show only tasks created by me (not assigned to me by others)
  const myCreatedTasks = tasks.filter((task: any) => {
    // Show if I created it, regardless of who it's assigned to
    return task.createdBy?._id === user?.id || task.createdBy?.id === user?.id;
  });

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

  const totalTasks = myCreatedTasks.length;
  const completedTasks = myCreatedTasks.filter((t) => t.status === 'completed').length;
  const inProgressTasks = myCreatedTasks.filter((t) => t.status === 'in-progress').length;
  const pendingTasks = myCreatedTasks.filter((t) => t.status === 'pending').length;

  const stats = [
    { label: 'Total Tasks', value: totalTasks, icon: ListTodo },
    { label: 'Completed', value: completedTasks, icon: CheckCircle2 },
    { label: 'In Progress', value: inProgressTasks, icon: BarChart3 },
    { label: 'Pending', value: pendingTasks, icon: Clock },
  ];

  return (
    <DashboardLayout onNewTask={handleNewTask}>
      <div className="p-4 md:p-6">
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl font-semibold mb-2">
            My Tasks Dashboard
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Tasks you created and assigned to others
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-card rounded-lg p-3 md:p-4 border border-border"
            >
              <div className="flex items-center gap-2 md:gap-3">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                  <stat.icon className="h-4 w-4 md:h-5 md:w-5" />
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-semibold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isLoading ? (
          <KanbanBoardSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <PriorityColumn
              priority="high"
              tasks={myCreatedTasks.filter(t => t.priority === 'high')}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onStatusChange={handleStatusChange}
              onTaskClick={handleTaskClick}
            />
            <PriorityColumn
              priority="medium"
              tasks={myCreatedTasks.filter(t => t.priority === 'medium')}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onStatusChange={handleStatusChange}
              onTaskClick={handleTaskClick}
            />
            <PriorityColumn
              priority="low"
              tasks={myCreatedTasks.filter(t => t.priority === 'low')}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onStatusChange={handleStatusChange}
              onTaskClick={handleTaskClick}
            />
          </div>
        )}
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
