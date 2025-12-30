import { create } from 'zustand';
import { Task, Priority, Status, User, TaskFormData } from '@/types/task';
import { api } from '@/services/api';

interface TaskStore {
  tasks: Task[];
  users: User[];
  isLoading: boolean;
  searchQuery: string;
  currentPage: number;
  tasksPerPage: number;
  selectedTask: Task | null;
  
  // Actions
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  setSelectedTask: (task: Task | null) => void;
  fetchTasks: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  addTask: (data: TaskFormData) => Promise<Task>;
  updateTask: (id: string, data: Partial<TaskFormData>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, status: Status) => Promise<void>;
  updateTaskPriority: (id: string, priority: Priority) => Promise<void>;
  
  // Computed
  getTasksByPriority: (priority: Priority) => Task[];
  getFilteredTasks: () => Task[];
  getTotalPages: () => number;
  getPaginatedTasks: () => Task[];
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  users: [],
  isLoading: false,
  searchQuery: '',
  currentPage: 1,
  tasksPerPage: 6,
  selectedTask: null,
  
  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setSelectedTask: (task) => set({ selectedTask: task }),
  
  fetchTasks: async () => {
    set({ isLoading: true });
    try {
      const tasks = await api.getTasks();
      set({ tasks, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },
  
  fetchUsers: async () => {
    try {
      const users = await api.getUsers();
      set({ users });
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  },
  
  addTask: async (data) => {
    const taskData = {
      ...data,
      assigneeId: data.assigneeId || null,
    };
    const newTask = await api.createTask(taskData);
    set((state) => ({ tasks: [newTask, ...state.tasks] }));
    return newTask;
  },
  
  updateTask: async (id, data) => {
    const updatedTask = await api.updateTask(id, {
      ...data,
      assigneeId: data.assigneeId,
    });
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? updatedTask : task)),
    }));
  },
  
  deleteTask: async (id) => {
    await api.deleteTask(id);
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
      selectedTask: state.selectedTask?.id === id ? null : state.selectedTask,
    }));
  },
  
  updateTaskStatus: async (id, status) => {
    const task = get().tasks.find((t) => t.id === id);
    if (task) {
      await api.updateTask(id, { status });
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t
        ),
      }));
    }
  },
  
  updateTaskPriority: async (id, priority) => {
    const task = get().tasks.find((t) => t.id === id);
    if (task) {
      await api.updateTask(id, { priority });
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id ? { ...t, priority, updatedAt: new Date().toISOString() } : t
        ),
      }));
    }
  },
  
  getTasksByPriority: (priority) => {
    const { tasks, searchQuery } = get();
    return tasks
      .filter((task) => task.priority === priority)
      .filter((task) =>
        searchQuery
          ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase())
          : true
      );
  },
  
  getFilteredTasks: () => {
    const { tasks, searchQuery } = get();
    return tasks.filter((task) =>
      searchQuery
        ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    );
  },
  
  getTotalPages: () => {
    const { getFilteredTasks, tasksPerPage } = get();
    return Math.ceil(getFilteredTasks().length / tasksPerPage);
  },
  
  getPaginatedTasks: () => {
    const { getFilteredTasks, currentPage, tasksPerPage } = get();
    const filtered = getFilteredTasks();
    const start = (currentPage - 1) * tasksPerPage;
    return filtered.slice(start, start + tasksPerPage);
  },
}));

// Export mock users for backward compatibility (will be replaced by API data)
export const mockUsers: User[] = [];
