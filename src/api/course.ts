import api from "./axios";
import { Course, CourseListResponse } from "@/models/course";

const BASE_URL = "/Course";

export const getAllCourses = async (): Promise<Course[]> => {
  const response = await api.get<CourseListResponse>(BASE_URL);
  return response.data.data;
};

export const getCourseById = async (id: number | string): Promise<Course> => {
  const response = await api.get<Course>(`${BASE_URL}/${id}`);
  return response.data;
};

export const createCourse = async (
  payload: Partial<Course>,
): Promise<{ id: number } | Course> => {
  const response = await api.post(`${BASE_URL}`, payload);
  return response.data;
};

export const updateCourse = async (
  id: number | string,
  payload: Partial<Course>,
): Promise<void> => {
  await api.put(`${BASE_URL}/${id}`, payload);
};
