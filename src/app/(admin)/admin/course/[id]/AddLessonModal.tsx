"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function AddLessonModal({
  chapterId,
}: {
  chapterId: number;
  nextOrder?: number; // ignored per requirement
}) {
  const router = useRouter();
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => router.push(`/admin/lesson/add?chapterId=${chapterId}`)}
      aria-label="Thêm bài học"
    >
      <Plus className="h-4 w-4" />
    </Button>
  );
}
