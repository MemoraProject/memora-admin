import api from "./axios";
import { Chapter } from "@/models/course";

const BASE_URL = "/Chapter";

export type CreateChapterPayload = {
  title: string;
  description?: string | null;
  order: number;
  isLock?: boolean;
  courseId: number;
  lessons?: Array<any>;
};

export const createChapter = async (
  payload: CreateChapterPayload,
): Promise<{ id: number }> => {
  const response = await api.post(`${BASE_URL}`, payload);
  return response.data;
};

export const getChapterById = async (id: number | string): Promise<Chapter> => {
  const response = await api.get<Chapter>(`${BASE_URL}/${id}`);
  return response.data;
};
