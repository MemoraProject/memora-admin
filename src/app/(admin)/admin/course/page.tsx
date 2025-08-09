"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import DataTableSkeleton from "@/components/dataTableSkelenton";
import { Course } from "@/models/course";
import { getAllCourses } from "@/api/course";
import { toast } from "@/hooks/use-toast";
import { CreateCourseModal } from "./create-course-modal";

function CourseTablePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const result = await getAllCourses();
      setCourses(result);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      toast({
        title: "Error",
        description: "Failed to fetch courses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Row click navigation is disabled for now; list-only per requirements

  return (
    <div className="bg-shade-1-100% text-shade-2-100% space-y-4 rounded-[8px] p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Course Management
          </h2>
          <p className="text-muted-foreground">
            Manage all courses in the system...
            <button
              onClick={fetchCourses}
              className="ml-2 text-blue-500 hover:underline"
            >
              refresh
            </button>
          </p>
        </div>
        <div>
          <CreateCourseModal onSuccess={() => fetchCourses()} />
        </div>
      </div>
      {isLoading ? (
        <DataTableSkeleton columns={columns.length} rows={10} />
      ) : (
        <DataTable columns={columns} data={courses} />
      )}
    </div>
  );
}

export default CourseTablePage;
