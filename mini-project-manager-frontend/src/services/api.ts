import axios from 'axios';
import { CreateProjectData, CreateTaskData, UpdateTaskData, Project, Task } from '../types';

const API_BASE_URL = 'http://localhost:5141/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (username: string, password: string) =>
    api.post('/auth/register', { username, password }),
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
};

export const projectsAPI = {
  getProjects: (): Promise<{ data: Project[] }> => api.get('/projects'),
  getProject: (id: number): Promise<{ data: Project }> => api.get(`/projects/${id}`),
  createProject: (data: CreateProjectData): Promise<{ data: Project }> =>
    api.post('/projects', data),
  deleteProject: (id: number) => api.delete(`/projects/${id}`),
};

export const tasksAPI = {
  createTask: (projectId: number, data: CreateTaskData): Promise<{ data: Task }> =>
    api.post(`/tasks/projects/${projectId}/tasks`, data),
  updateTask: (taskId: number, data: UpdateTaskData): Promise<{ data: Task }> =>
    api.put(`/tasks/${taskId}`, data),
  deleteTask: (taskId: number) => api.delete(`/tasks/${taskId}`),
};

export default api;