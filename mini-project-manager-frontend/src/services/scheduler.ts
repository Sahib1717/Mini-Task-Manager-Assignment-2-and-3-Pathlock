import axios from 'axios';

const API_BASE = "http://localhost:5141/api"; // change port if different

export interface TaskInput {
  title: string;
  estimatedHours: number;
  dueDate?: string;
  dependencies: string[];
}

export async function getRecommendedOrder(projectId: number, tasks: TaskInput[]) {
  const response = await axios.post(`${API_BASE}/projects/${projectId}/schedule`, {
    projectId,
    tasks
  });
  return response.data.recommendedOrder as string[];
}
