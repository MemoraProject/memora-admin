"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Course } from "@/models/course";
import { getCourseById } from "@/api/course";
import { toast } from "@/hooks/use-toast";
import { EditCourseModal } from "../create-course-modal";
import {
  Book,
  FileText,
  Film,
  HelpCircle,
  Lock,
  Unlock,
  Timer,
  VideoIcon,
  ArrowLeft,
} from "lucide-react";

function CourseDetailPage({ params }: { params: { id: string } }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCourse = async () => {
    setIsLoading(true);
    try {
      const data = await getCourseById(params.id);
      setCourse(data);
    } catch (error) {
      console.error("Failed to fetch course:", error);
      toast({
        title: "Error",
        description: "Failed to fetch course details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [params.id]);

  const totalLessons = useMemo(() => {
    if (!course?.chapters) return 0;
    return course.chapters.reduce(
      (sum, ch) => sum + (ch.totalLesson ?? ch.lessons?.length ?? 0),
      0,
    );
  }, [course]);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <HeaderSkeleton />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Skeleton className="h-96 w-full" />
          </div>
          <div>
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold">Course not found</h2>
        <p className="mt-2 text-muted-foreground">
          The course may not exist or has been deleted.
        </p>
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
      {/* Header Section */}
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-6 p-6 md:flex-row">
          <div className="flex-1">
            <div className="mb-3 inline-flex items-center gap-2">
              <Badge variant="secondary">
                {course.difficultLevel || "Beginner"}
              </Badge>
            </div>
            <h1 className="mb-2 text-2xl font-bold">{course.title}</h1>
            <p className="mb-4 text-sm text-muted-foreground">
              {course.description || "No description"}
            </p>

            <div className="mb-4 flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Book className="h-4 w-4" /> {course.totalChapter} chương
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" /> {totalLessons} bài học
              </div>
            </div>

            <div className="text-xl font-semibold">
              {new Intl.NumberFormat(undefined, {
                style: "currency",
                currency: "VND",
                maximumFractionDigits: 0,
              }).format(course.price)}
            </div>
          </div>
          <div className="flex w-full items-center justify-center md:w-80">
            <div className="flex h-40 w-64 items-center justify-center rounded-md bg-muted">
              <Film className="h-10 w-10" />
            </div>
          </div>
        </div>
        <div className="px-6 pb-4 text-right">
          <EditCourseModal course={course} onSuccess={() => fetchCourse()} />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Chapters and Lessons */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Chapters</CardTitle>
            </CardHeader>
            <CardContent>
              {course.chapters && course.chapters.length > 0 ? (
                <Accordion type="multiple" className="w-full">
                  {course.chapters
                    .sort((a, b) => a.order - b.order)
                    .map((chapter) => (
                      <AccordionItem
                        value={`chapter-${chapter.id}`}
                        key={chapter.id}
                      >
                        <AccordionTrigger>
                          <div className="flex w-full items-center justify-between">
                            <div className="font-medium">
                              {chapter.order}. {chapter.title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {chapter.totalLesson} bài học
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="divide-y">
                            {(chapter.lessons || []).map((lesson) => (
                              <div
                                key={lesson.id}
                                className="flex items-center gap-3 py-3"
                              >
                                {renderLessonIcon(lesson.type)}
                                <div className="flex-1">
                                  <div className="font-medium">
                                    <a
                                      href={`/admin/lesson/${lesson.id}`}
                                      className="hover:underline"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {lesson.title}
                                    </a>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  {lesson.video?.duration ? (
                                    <span className="inline-flex items-center gap-1">
                                      <VideoIcon className="h-3 w-3" />{" "}
                                      {lesson.video.duration}m
                                    </span>
                                  ) : null}
                                  {lesson.isLock ? (
                                    <Lock className="h-4 w-4" />
                                  ) : (
                                    <Unlock className="h-4 w-4" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No chapters available.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thống kê khóa học</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Tổng chương:</span>
                  <span>{course.totalChapter}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tổng bài học:</span>
                  <span>{totalLessons}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Trạng thái</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                {course.isPublic ? "Khóa học công khai" : "Khóa học riêng tư"}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function HeaderSkeleton() {
  return <Skeleton className="h-48 w-full" />;
}

function renderLessonIcon(type?: number) {
  switch (type) {
    case 0:
      return <Film className="h-4 w-4" />;
    case 1:
      return <Book className="h-4 w-4" />;
    case 2:
      return <HelpCircle className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
}

export default CourseDetailPage;
