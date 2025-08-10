import api from "./axios";

export type DocumentDetail = {
  id: number;
  title: string;
  content: string;
  dateCreated?: string;
  dateModified?: string;
};

const BASE_URL = "/Document";

export async function getDocumentById(
  id: number | string,
): Promise<DocumentDetail> {
  const res = await api.get(`${BASE_URL}/${id}`);
  // Some endpoints return { data: {...} }
  const data = res.data && res.data.data ? res.data.data : res.data;
  return data as DocumentDetail;
}
