"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import LessonForm from "../components/LessonForm";

export default function AddLessonPage() {
  const params = useSearchParams();
  const chapterIdParam = params.get("chapterId");
  const chapterId = chapterIdParam ? Number(chapterIdParam) : undefined;

  return <LessonForm mode="add" chapterId={chapterId} />;
}
