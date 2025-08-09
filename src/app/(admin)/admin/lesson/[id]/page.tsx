"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { LessonDetail, LessonResourceType } from "@/models/lesson";
import { getLessonById } from "@/api/lesson";
import { getStudySetById } from "@/api/studyset";
import { StudySet } from "@/models/studyset";
import { toast } from "@/hooks/use-toast";
import {
  Book,
  FileText,
  Film,
  HelpCircle,
  Timer,
  Volume2,
  ArrowLeft,
} from "lucide-react";

export default function LessonDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [studySet, setStudySet] = useState<StudySet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLesson = async () => {
    setIsLoading(true);
    try {
      const data = await getLessonById(params.id);
      setLesson(data);

      if (data.type === LessonResourceType.StudySet && data.resourceId) {
        try {
          const ss = await getStudySetById(data.resourceId);
          setStudySet(ss);
        } catch (err) {
          console.error("Failed to fetch study set:", err);
        }
      }
    } catch (error) {
      console.error("Failed to fetch lesson:", error);
      toast({
        title: "Error",
        description: "Failed to fetch lesson details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLesson();
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
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold">Lesson not found</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{lesson.title}</h1>
        <Badge variant="secondary">Order #{lesson.order}</Badge>
      </div>

      {lesson.type === LessonResourceType.Video && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Film className="h-5 w-5" /> Video
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="rounded-md bg-muted p-6 text-center">
                <div className="mb-2 text-sm text-muted-foreground">
                  Preview
                </div>
                <div className="inline-flex items-center gap-2 text-sm">
                  <Film className="h-4 w-4" /> {lesson.video?.url || "N/A"}
                  {lesson.video?.duration ? (
                    <span className="ml-2 inline-flex items-center gap-1 text-xs">
                      <Timer className="h-3 w-3" /> {lesson.video.duration}m
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {lesson.type === LessonResourceType.StudySet && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" />{" "}
              {studySet?.name ?? "Studyset này chưa có tên"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {studySet ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-4">
                  <Badge variant="secondary">{studySet.keyword}</Badge>
                  <div className="text-sm text-muted-foreground">
                    {studySet.totalCard} cards
                  </div>
                </div>
                <div className="">
                  <div className="grid grid-cols-2 gap-4 p-4">
                    {(studySet.cards || []).map((card) => (
                      <div key={card.id} className="rounded-xl border p-5">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-2xl font-bold">
                              {card.word}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {card.meaning || "-"}
                            </div>
                          </div>
                          {card.type ? (
                            <Badge variant="secondary">{card.type}</Badge>
                          ) : null}
                        </div>

                        <div className="mt-4">
                          <div className="mb-1 text-sm font-medium">
                            Phát âm
                          </div>
                          <div className="text-lg">{card.pronounce || "-"}</div>
                        </div>

                        <div className="mt-4">
                          <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                            Mô tả nghĩa
                            <div className="inline-flex items-center gap-1">
                              <Volume2 className="h-4 w-4" />
                            </div>
                          </div>
                          <div className="leading-7">
                            {card.meaningDescription || "-"}
                          </div>
                        </div>

                        <div className="mt-4 rounded-xl bg-muted p-4">
                          <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                            Ví dụ
                            <div className="inline-flex items-center gap-1">
                              <Volume2 className="h-4 w-4" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="leading-7">
                              {card.example || "-"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {card.exampleMeaning || ""}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                No study set details available.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {lesson.type === LessonResourceType.Quiz && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" /> Quiz
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Quiz details not implemented yet.
            </div>
          </CardContent>
        </Card>
      )}

      {lesson.type === LessonResourceType.Document && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" /> Document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <div className="text-sm text-muted-foreground">
                Document details not implemented yet.
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
