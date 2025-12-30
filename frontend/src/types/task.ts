export type Priority = 'high' | 'medium' | 'low';
export type Status = 'pending' | 'in-progress' | 'completed';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: Status;
  assignee?: User;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: Status;
  assigneeId?: string;
}
