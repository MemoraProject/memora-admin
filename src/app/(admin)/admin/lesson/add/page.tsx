"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createLesson } from "@/api/lesson";
import { LessonResourceType } from "@/models/lesson";
import { getChapterById } from "@/api/chapter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Sparkles, Trash2 } from "lucide-react";

function FileDropInput({
  value,
  onChange,
  inputName,
}: {
  value?: File;
  onChange: (file?: File) => void;
  inputName?: string;
}) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (value) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [value]);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    onChange(file || undefined);
  };

  return (
    <div
      className={
        "relative flex aspect-square min-h-64 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed p-6"
        // (isDragging ? "border-primary bg-primary/5" : "")
      }
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files || null);
      }}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        name={inputName}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        aria-label="Tải ảnh"
        title="Tải ảnh"
      />

      {previewUrl ? (
        <img
          src={previewUrl}
          alt="Preview"
          className="max-h-64 w-auto rounded-md object-contain"
        />
      ) : (
        <div className="text-center">
          <div className="text-lg font-semibold">Thêm hình ảnh</div>
        </div>
      )}
    </div>
  );
}

const cardSchema = z.object({
  word: z.string().min(1, "Bắt buộc"),
  meaning: z.string().min(1, "Bắt buộc"),
  pronounce: z.string().optional(),
  ranking: z.coerce.number().optional().nullable(),
  sinoVietnamese: z.string().optional(),
  type: z.string().optional(),
  meaningDescription: z.string().optional(),
  example: z.string().optional(),
  exampleMeaning: z.string().optional(),
  imgUrl: z.string().url().optional(),
});

const schema = z.object({
  title: z.string().min(1, "Tên bài học là bắt buộc"),
  description: z.string().optional(),
  studySet: z.object({
    name: z.string().min(1, "Bắt buộc"),
    keyword: z.string().optional(),
    isPublic: z.boolean().default(false),
    imgFile: z.any().optional(),
    cards: z.array(cardSchema).default([]),
  }),
});

type FormValues = z.infer<typeof schema>;

export default function AddLessonPage() {
  const params = useSearchParams();
  const router = useRouter();
  const chapterIdParam = params.get("chapterId");
  const chapterId = chapterIdParam ? Number(chapterIdParam) : undefined;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      studySet: {
        name: "",
        keyword: "",
        isPublic: false,
        imgFile: undefined,
        cards: [],
      },
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!chapterId) throw new Error("Thiếu chapterId");
      return createLesson({
        title: values.title,
        description: values.description || null,
        type: LessonResourceType.StudySet,
        chapterId,
        order: 1,
        studySet: {
          name: values.studySet.name,
          keyword: values.studySet.keyword,
          isPublic: values.studySet.isPublic,
          imgUrl: null,
          cards: values.studySet.cards.map((c, idx) => ({
            ...c,
            order: idx + 1,
          })),
        },
      });
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      const res = await mutateAsync(values);
      toast({ title: "Thành công", description: "Đã tạo bài học (Study set)" });
      router.replace(`/admin/lesson/${res.id}`);
    } catch (error: any) {
      toast({
        title: "Thất bại",
        description: error?.message || "Không thể tạo bài học",
        variant: "destructive",
      });
    }
  };

  const [chapterTitle, setChapterTitle] = React.useState<string>("");
  React.useEffect(() => {
    if (!chapterId) return;
    getChapterById(chapterId)
      .then((ch) => setChapterTitle(`${ch.order}. ${ch.title}`))
      .catch(() => setChapterTitle(""));
  }, [chapterId]);

  return (
    <div className="p-6">
      <div className="mx-auto max-w-6xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Thêm bài học</h1>
              {chapterId && (
                <p className="text-sm text-muted-foreground">
                  Đang thêm vào chương {chapterTitle || `#${chapterId}`}
                </p>
              )}
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Thông tin bài học</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên bài học</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên bài học..." {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Nhập mô tả..." {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Study set</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="studySet.imgFile"
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel>Ảnh</FormLabel>
                        <FormControl>
                          <FileDropInput
                            value={field.value as File | undefined}
                            onChange={(file) => field.onChange(file)}
                            inputName={field.name}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex w-full flex-col gap-2">
                    <FormField
                      control={form.control}
                      name="studySet.name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên</FormLabel>
                          <FormControl>
                            <Input placeholder="Tên study set" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="studySet.keyword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Từ khóa</FormLabel>
                          <FormControl>
                            <Input placeholder="Từ khóa" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="studySet.isPublic"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center">
                          <FormLabel className="pt-2">Công khai</FormLabel>
                          <FormControl>
                            <Checkbox
                              className="ml-2"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between rounded-md border bg-white px-6 py-4">
                <div className="text-lg font-medium">Thẻ</div>
                <div>
                  <Button variant="outline" size="sm">
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="rounded-md">
                <CardsEditor form={form} />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Đang tạo..." : "Tạo"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

type CardsEditorProps = {
  form: ReturnType<typeof useForm<FormValues>>;
};

function CardsEditor({ form }: CardsEditorProps) {
  const cards = form.watch("studySet.cards");

  const addCard = () => {
    const next = [...cards, { word: "", meaning: "" }];
    form.setValue("studySet.cards", next);
  };

  const removeCard = (index: number) => {
    const next = cards.filter((_, i) => i !== index);
    form.setValue("studySet.cards", next);
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {cards.map((card: any, index: number) => (
        <div key={index} className="col-span-1 rounded-md border bg-white p-4">
          <div className="mb-2 flex justify-between">
            <div className="text-sm font-medium">#{index + 1}</div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeCard(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name={`studySet.cards.${index}.imgUrl` as const}
              render={({ field }) => (
                <FormItem className="col-span-1 row-span-4">
                  <FormLabel>Ảnh</FormLabel>
                  <FormControl>
                    <FileDropInput
                      value={field.value as File | undefined}
                      onChange={(file) => field.onChange(file)}
                      inputName={field.name}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`studySet.cards.${index}.word` as const}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Từ</FormLabel>
                  <FormControl>
                    <Input placeholder="Từ" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`studySet.cards.${index}.meaning` as const}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nghĩa</FormLabel>
                  <FormControl>
                    <Input placeholder="Nghĩa" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`studySet.cards.${index}.pronounce` as const}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phiên âm</FormLabel>
                  <FormControl>
                    <Input placeholder="Phiên âm" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`studySet.cards.${index}.ranking` as const}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Xếp hạng</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value),
                        )
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`studySet.cards.${index}.sinoVietnamese` as const}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hán Việt</FormLabel>
                  <FormControl>
                    <Input placeholder="Hán Việt" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`studySet.cards.${index}.type` as const}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại từ</FormLabel>
                  <FormControl>
                    <Input placeholder="Loại từ" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`studySet.cards.${index}.meaningDescription` as const}
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Giải thích nghĩa</FormLabel>
                  <FormControl>
                    <Input placeholder="Giải thích" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`studySet.cards.${index}.example` as const}
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Ví dụ</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`studySet.cards.${index}.exampleMeaning` as const}
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Nghĩa của ví dụ</FormLabel>
                  <FormControl>
                    <Input placeholder="Nghĩa của ví dụ" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      ))}
      <Button variant="secondary" onClick={addCard}>
        Thêm thẻ
      </Button>
    </div>
  );
}
