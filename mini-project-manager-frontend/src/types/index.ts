export interface User {
  id: number;
  username: string;
}

export interface Project {
  id: number;
  title: string;
  description?: string;
  creationDate: string;
  userId: number;
  tasks: Task[];
}

export interface Task {
  id: number;
  title: string;
  dueDate?: string;
  isCompleted: boolean;
  projectId: number;
}

export interface CreateProjectData {
  title: string;
  description?: string;
}

export interface CreateTaskData {
  title: string;
  dueDate?: string;
}

export interface UpdateTaskData {
  title?: string;
  dueDate?: string;
  isCompleted?: boolean;
}