import { DashboardLayout } from '@/components/DashboardLayout';
import { useTaskStore } from '@/store/taskStore';
import { useAuthStore } from '@/store/authStore';
import { TaskCard } from '@/components/TaskCard';
import { TaskDrawer } from '@/components/TaskDrawer';
import { TaskDetailDrawer } from '@/components/TaskDetailDrawer';
import { useState, useEffect } from 'react';
import { Task } from '@/types/task';

export default function AssignedTasksPage() {
  const { tasks, fetchTasks, deleteTask, updateTask } = useTaskStore();
  const { user } = useAuthStore();
  const [taskDrawerOpen, setTaskDrawerOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Filter tasks that are assigned to me (where someone else created it and assigned to me)
  const assignedToMe = tasks.filter((task: any) => {
    const assigneeId = task.assignee?.id || task.assignee?._id;
    const creatorId = task.createdBy?.id || task.createdBy?._id;
    // Show if assigned to me AND not created by me
    return assigneeId === user?.id && creatorId !== user?.id;
  });

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setDrawerMode('edit');
    setDetailDrawerOpen(false);
    setTaskDrawerOpen(true);
  };

  const handleDelete = async (task: Task) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(task.id);
    }
  };

  const handleStatusChange = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    await updateTask(task.id, { ...task, status: newStatus });
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setDetailDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setTaskDrawerOpen(false);
    setSelectedTask(null);
  };

  return (
    <DashboardLayout onNewTask={() => setTaskDrawerOpen(true)}>
      <div className="p-4 md:p-6">
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl font-semibold mb-2">
            Tasks Assigned to Me
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Tasks that others have assigned to you
          </p>
        </div>

        {assignedToMe.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tasks assigned to you yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {assignedToMe.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                onClick={handleTaskClick}
              />
            ))}
          </div>
        )}
      </div>

      <TaskDrawer
        isOpen={taskDrawerOpen}
        onClose={handleDrawerClose}
        mode={drawerMode}
        task={selectedTask || undefined}
      />

      <TaskDetailDrawer
        isOpen={detailDrawerOpen}
        onClose={() => {
          setDetailDrawerOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />
    </DashboardLayout>
  );
}
