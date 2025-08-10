"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import CreateCourseForm from "./create-course";

export function CreateCourseModal({
  onSuccess,
}: {
  onSuccess: (id: number) => void;
}) {
  const [open, setOpen] = React.useState(false);

  const handleSuccess = (id: number) => {
    setOpen(false);
    onSuccess(id);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" /> Tạo khóa học
      </Button>
      <DialogContent className="max-h-[85vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo khóa học</DialogTitle>
          <DialogDescription>
            Nhập thông tin khóa học, bạn có thể thêm chương sau.
          </DialogDescription>
        </DialogHeader>
        <CreateCourseForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}

export function EditCourseModal({
  course,
  onSuccess,
}: {
  course: any;
  onSuccess: (id: number) => void;
}) {
  const [open, setOpen] = React.useState(false);

  const handleSuccess = (id: number) => {
    setOpen(false);
    onSuccess(id);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Chỉnh sửa khóa học
      </Button>
      <DialogContent className="max-h-[85vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa khóa học</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin khóa học và danh sách chương.
          </DialogDescription>
        </DialogHeader>
        <CreateCourseForm
          onSuccess={handleSuccess}
          mode="edit"
          courseId={(course as any)?.id}
          initialData={course}
        />
      </DialogContent>
    </Dialog>
  );
}
