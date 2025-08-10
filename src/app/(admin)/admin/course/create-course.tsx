"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { createCourse, updateCourse } from "@/api/course";
import { Course } from "@/models/course";

const formSchema = z.object({
  title: z.string().min(2, { message: "Tên khóa học phải có ít nhất 2 ký tự" }),
  description: z.string().optional(),
  difficultLevel: z.string().optional(),
  isPublic: z.boolean().default(false),
  price: z.preprocess(
    (v) => (v === "" || v === undefined || v === null ? 0 : Number(v)),
    z.number().min(0, { message: "Giá phải >= 0" }),
  ),
  identitfier: z.string().optional(),
  videoUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type Mode = "create" | "edit";

type ChapterDraft = {
  _key: string;
  id?: number;
  title: string;
  description?: string;
};

export default function CreateCourseForm({
  onSuccess,
  mode = "create",
  initialData,
  courseId,
}: {
  onSuccess: (id: number) => void;
  mode?: Mode;
  initialData?: Partial<Course>;
  courseId?: number | string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [chapters, setChapters] = useState<ChapterDraft[]>(
    (initialData?.chapters as any)?.map((c: any) => ({
      _key: `${c.id ?? Math.random()}`,
      id: c.id,
      title: c.title,
      description: c.description ?? "",
    })) || [],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      difficultLevel: (initialData?.difficultLevel as string) || "Beginner",
      isPublic: initialData?.isPublic || false,
      price: (initialData?.price as number) || 0,
      identitfier: initialData?.identitfier || "",
      videoUrl: (initialData as any)?.videoUrl || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const payload = {
        title: values.title,
        description: values.description ?? null,
        imgurl: null,
        videoUrl: values.videoUrl || null,
        difficultLevel: values.difficultLevel || null,
        price: values.price,
        isPublic: values.isPublic,
        identitfier: values.identitfier || undefined,
        chapters: chapters.map((c, idx) => ({
          id: c.id,
          title: c.title,
          description: c.description ?? "",
          order: idx + 1,
        })),
      } as any;
      if (mode === "create") {
        const res = await createCourse(payload);
        const newId = (res as any)?.id ?? (res as any)?.data?.id;
        toast({ title: "Success", description: "Tạo khóa học thành công." });
        if (newId) {
          onSuccess(Number(newId));
          router.push(`/admin/course/${newId}`);
        } else {
          onSuccess(0);
        }
        form.reset();
        setChapters([]);
      } else if (mode === "edit" && courseId) {
        await updateCourse(courseId, payload);
        toast({
          title: "Success",
          description: "Cập nhật khóa học thành công.",
        });
        onSuccess(Number(courseId));
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description:
          mode === "create"
            ? "Tạo khóa học thất bại."
            : "Cập nhật khóa học thất bại.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addChapter = () => {
    setChapters((prev) => [
      ...prev,
      { _key: `${Date.now()}-${Math.random()}`, title: "", description: "" },
    ]);
  };

  const removeChapter = (key: string) => {
    setChapters((prev) => prev.filter((c) => c._key !== key));
  };

  const updateChapter = (key: string, patch: Partial<ChapterDraft>) => {
    setChapters((prev) =>
      prev.map((c) => (c._key === key ? { ...c, ...patch } : c)),
    );
  };

  const moveChapter = (index: number, direction: -1 | 1) => {
    setChapters((prev) => {
      const next: ChapterDraft[] = [...prev];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= next.length) return next;
      const temp: ChapterDraft = next[index]!;
      next[index] = next[newIndex]!;
      next[newIndex] = temp;
      return next;
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Thông tin khóa học</h3>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên khóa học</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên khóa học..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="difficultLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chọn cấp độ</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn cấp độ" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="N5">N5</SelectItem>
                      <SelectItem value="N4">N4</SelectItem>
                      <SelectItem value="N3">N3</SelectItem>
                      <SelectItem value="N2">N2</SelectItem>
                      <SelectItem value="N1">N1</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả khóa học</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập mô tả..."
                      className="min-h-24"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="m-0">Công khai khóa học này</FormLabel>
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="1"
                      min="0"
                      placeholder="Nhập số tiền"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="identitfier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Định danh khóa học</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập định danh" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="videoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video URL</FormLabel>
                  <FormControl>
                    <Input type="file" onChange={() => {}} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Danh sách chương</h3>
            {mode === "create" && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addChapter}
              >
                Thêm chương
              </Button>
            )}
          </div>
          <div className="space-y-4">
            {chapters.map((ch, index) => (
              <div key={ch._key} className="rounded-lg border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-sm font-medium">Chương {index + 1}</div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => moveChapter(index, -1)}
                    >
                      ↑
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => moveChapter(index, 1)}
                    >
                      ↓
                    </Button>
                    {mode === "create" && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeChapter(ch._key)}
                      >
                        X
                      </Button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <Input
                    placeholder="Tên chương"
                    value={ch.title}
                    onChange={(e) =>
                      updateChapter(ch._key, { title: e.target.value })
                    }
                  />
                  <Textarea
                    placeholder="Mô tả chương"
                    value={ch.description || ""}
                    onChange={(e) =>
                      updateChapter(ch._key, { description: e.target.value })
                    }
                  />
                </div>
              </div>
            ))}
            {chapters.length === 0 && (
              <div className="text-sm text-muted-foreground">
                Bạn có thể thêm chương bây giờ hoặc sau này.
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? "Đang lưu..."
              : mode === "create"
                ? "Tạo khóa học"
                : "Lưu thay đổi"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
