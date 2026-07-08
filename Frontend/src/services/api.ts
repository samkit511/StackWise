import axios from 'axios';
import type { Project, QuestionnaireInput, Recommendation } from '../types/api';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api'
});

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export async function submitQuestionnaire(payload: QuestionnaireInput) {
  const { data } = await client.post<ApiResponse<{ project: Project; recommendation: Recommendation }>>('/questionnaire', payload);
  return data.data;
}

export async function getRecommendation(projectId: string) {
  const { data } = await client.get<ApiResponse<Recommendation>>(`/recommendations/${projectId}`);
  return data.data;
}

export async function getProjects() {
  const { data } = await client.get<ApiResponse<Project[]>>('/projects');
  return data.data;
}

export async function getTechnologies(search = '', category = '') {
  const { data } = await client.get<ApiResponse<unknown[]>>('/technologies', { params: { search, category } });
  return data.data;
}

export function reportUrl(projectId: string) {
  return `${client.defaults.baseURL}/reports/${projectId}`;
}
