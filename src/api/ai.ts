import api from "./axios";

export type AutoFillRequestWord = {
  word: string;
};

export type AutoFillResponseItem = {
  word: string;
  meaning?: string;
  pronunciation?: string;
  sinoVietnamese?: string;
  type?: string;
  meaningDescription?: string;
  example?: string;
  exampleMeaning?: string;
};

export async function autoFillWords(words: AutoFillRequestWord[]) {
  const response = await api.post("/AI/auto-fill", {
    words,
  });

  const data = (response as any)?.data;
  // Some APIs wrap payload in { data: [...] }
  const result: AutoFillResponseItem[] = (data?.data ?? data ?? []) as any;
  return result;
}
