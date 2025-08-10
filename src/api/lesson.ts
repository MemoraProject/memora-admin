import api from "./axios";
import { LessonDetail, LessonResourceType } from "@/models/lesson";

const BASE_URL = "/Lesson";

export const getLessonById = async (
  id: number | string,
): Promise<LessonDetail> => {
  const response = await api.get<LessonDetail>(`${BASE_URL}`, {
    params: {
      lessonId: id,
    },
  });
  return response.data;
};

export type CreateLessonPayload = {
  title: string;
  description?: string | null;
  type: LessonResourceType;
  chapterId: number;
  order: number;
  studySet?: {
    keyword?: string;
    name: string;
    isPublic: boolean;
    imgUrl?: string | null;
    aiGeneratedId?: number | null;
    folderId?: number | null;
    userId?: string | null;
    cards?: Array<{
      word: string;
      pronounce?: string | null;
      ranking?: number | null;
      sinoVietnamese?: string | null;
      type?: string | null;
      meaningDescription?: string | null;
      example?: string | null;
      exampleMeaning?: string | null;
      meaning: string;
      imgUrl?: string | null;
      order?: number; // will be set by client as index+1
    }>;
  } | null;
  document?: {
    title: string;
    content: string;
  } | null;
};

export const createLesson = async (
  payload: CreateLessonPayload,
): Promise<{ id: number }> => {
  const response = await api.post(`${BASE_URL}`, payload);
  return response.data;
};

export type UpdateLessonPayload = {
  title: string;
  description?: string | null;
  type: LessonResourceType;
  chapterId: number;
  order: number;
  resourceId?: number | null;
  studySet?: {
    keyword?: string;
    name: string;
    isPublic: boolean;
    imgUrl?: string | null;
    aiGeneratedId?: number | null;
    folderId?: number | null;
    userId?: string | null;
    cards?: Array<{
      id?: number;
      word: string;
      pronounce?: string | null;
      ranking?: number | null;
      sinoVietnamese?: string | null;
      type?: string | null;
      meaningDescription?: string | null;
      example?: string | null;
      exampleMeaning?: string | null;
      meaning: string;
      imgUrl?: string | null;
      order?: number;
    }>;
  } | null;
  document?: {
    title: string;
    content: string;
  } | null;
};

export const updateLesson = async (
  id: number | string,
  payload: UpdateLessonPayload,
): Promise<void> => {
  await api.put(`${BASE_URL}/${id}`, payload);
};

export const deleteLesson = async (id: number | string): Promise<void> => {
  await api.delete(`${BASE_URL}/${id}`);
};
