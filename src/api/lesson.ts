import api from "./axios";
import { LessonDetail } from "@/models/lesson";

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
