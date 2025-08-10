import api from "./axios";
import { StudySet } from "@/models/studyset";

const BASE_URL = "/StudySet";

export const getStudySetById = async (
  id: number | string,
): Promise<StudySet> => {
  const response = await api.get<StudySet>(`${BASE_URL}/${id}`);
  return response.data as any; // API may wrap; we align with sample which returns object directly
};
