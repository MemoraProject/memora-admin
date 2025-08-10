"use client";

import React, { useEffect, useState } from "react";
import LessonForm from "../../components/LessonForm";
import { getLessonById } from "@/api/lesson";
import { getStudySetById } from "@/api/studyset";
import { getDocumentById } from "@/api/document";
import { LessonDetail, LessonResourceType } from "@/models/lesson";
import { StudySet } from "@/models/studyset";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

export default function EditLessonPage({ params }: { params: { id: string } }) {
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [studySet, setStudySet] = useState<StudySet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [documentHtml, setDocumentHtml] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await getLessonById(params.id);
        if (!mounted) return;
        setLesson(data);
        if (data.type === LessonResourceType.StudySet && data.resourceId) {
          try {
            const ss = await getStudySetById(data.resourceId);
            if (!mounted) return;
            setStudySet(ss);
          } catch (err) {
            // Allow editing of lesson info even if study set fetch fails
          }
        } else if (
          data.type === LessonResourceType.Document &&
          data.resourceId
        ) {
          try {
            const doc = await getDocumentById(data.resourceId);
            if (!mounted) return;
            setDocumentHtml(doc.content || "");
          } catch (err) {
            // ignore
          }
        }
      } catch (e) {
        toast({
          title: "Lỗi",
          description: "Không tải được dữ liệu bài học",
          variant: "destructive",
        });
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-20 w-1/2" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!lesson) {
    return <div className="p-6">Không tìm thấy bài học</div>;
  }

  return (
    <LessonForm
      mode="edit"
      initialLesson={lesson}
      initialStudySet={studySet}
      initialDocumentContent={documentHtml}
    />
  );
}
