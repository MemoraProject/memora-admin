"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createLesson, updateLesson } from "@/api/lesson";
import { LessonDetail, LessonResourceType } from "@/models/lesson";
import { StudyCard, StudySet } from "@/models/studyset";
import { getChapterById } from "@/api/chapter";
import { useUpload } from "@/hooks/useUpload";
import { toast } from "@/hooks/use-toast";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, Trash2 } from "lucide-react";
import { autoFillWords } from "@/api/ai";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import LessonDocumentEditor from "@/components/tiptap/LessonDocumentEditor";

type LessonFormMode = "add" | "edit";

function FileDropInput({
  value,
  onChange,
  inputName,
  existingUrl,
}: {
  value?: File;
  onChange: (file?: File) => void;
  inputName?: string;
  existingUrl?: string | null;
}) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
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

  const showUrl = previewUrl || existingUrl || null;

  return (
    <div
      className={
        "relative flex aspect-square min-h-64 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed p-6"
      }
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={(e) => {
        e.preventDefault();
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

      {showUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={showUrl}
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
  id: z.number().optional(),
  word: z.string().min(1, "Bắt buộc"),
  meaning: z
    .string()
    .min(1, "Bắt buộc")
    .or(z.literal(""))
    .transform((v) => (v === "" ? "" : v)),
  pronounce: z.string().optional(),
  ranking: z.coerce.number().optional().nullable(),
  sinoVietnamese: z.string().optional(),
  type: z.string().optional(),
  meaningDescription: z.string().optional(),
  example: z.string().optional(),
  exampleMeaning: z.string().optional(),
  imgFile: z.any().optional(),
  imgUrl: z.string().nullable().optional(),
});

const schema = z.object({
  title: z.string().optional().default(""),
  description: z.string().optional().nullable(),
  studySet: z
    .object({
      name: z.string().min(1, "Bắt buộc"),
      keyword: z.string().optional().nullable(),
      isPublic: z.boolean().default(false),
      imgFile: z.any().optional(),
      imgUrl: z.string().nullable().optional(),
      cards: z.array(cardSchema).default([]),
    })
    .optional()
    .nullable(),
  document: z
    .object({
      title: z.string().optional(),
      content: z.string().default(""),
    })
    .optional()
    .nullable(),
});

export type LessonFormValues = z.infer<typeof schema>;

type LessonFormProps = {
  mode: LessonFormMode;
  chapterId?: number; // required in add mode
  initialLesson?: LessonDetail | null;
  initialStudySet?: StudySet | null;
  initialDocumentContent?: string;
};

export default function LessonForm({
  mode,
  chapterId,
  initialLesson,
  initialStudySet,
  initialDocumentContent,
}: LessonFormProps) {
  const router = useRouter();
  const [bulkOpen, setBulkOpen] = React.useState(false);
  const [bulkWordsInput, setBulkWordsInput] = React.useState("");
  const [bulkMode, setBulkMode] = React.useState<"add" | "override">("add");
  const [isBulkLoading, setIsBulkLoading] = React.useState(false);

  const studysetUploader = useUpload({
    prefix: "images/studysets",
    allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    maxBytes: 10 * 1024 * 1024,
  });
  const cardUploader = useUpload({
    prefix: "images/cards",
    allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    maxBytes: 10 * 1024 * 1024,
  });

  const [lessonType, setLessonType] = React.useState<LessonResourceType>(
    mode === "edit" && initialLesson
      ? initialLesson.type
      : LessonResourceType.StudySet,
  );

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(schema),
    defaultValues:
      mode === "edit" &&
      initialLesson &&
      lessonType === LessonResourceType.StudySet &&
      initialStudySet
        ? {
            title: initialLesson.title,
            description: initialLesson.description ?? "",
            studySet: {
              name: initialStudySet.name,
              keyword: initialStudySet.keyword ?? "",
              isPublic: initialStudySet.isPublic,
              imgFile: undefined,
              imgUrl: initialStudySet.imgUrl ?? null,
              cards: (initialStudySet.cards ?? []).map((c: StudyCard) => ({
                id: c.id,
                word: c.word,
                meaning: c.meaning ?? "",
                pronounce: c.pronounce ?? "",
                ranking: c.ranking ?? undefined,
                sinoVietnamese: c.sinoVietnamese ?? "",
                type: c.type ?? "",
                meaningDescription: c.meaningDescription ?? "",
                example: c.example ?? "",
                exampleMeaning: c.exampleMeaning ?? "",
                imgFile: undefined,
                imgUrl: c.imgUrl ?? null,
              })),
            },
            document: null,
          }
        : mode === "edit" &&
            initialLesson &&
            lessonType === LessonResourceType.Document
          ? {
              title: initialLesson.title,
              description: initialLesson.description ?? "",
              studySet: null,
              document: {
                title: initialLesson.document?.title ?? initialLesson.title,
                content: initialDocumentContent ?? "",
              },
            }
          : {
              title: "",
              description: "",
              studySet:
                lessonType === LessonResourceType.StudySet
                  ? {
                      name: "",
                      keyword: "",
                      isPublic: false,
                      imgFile: undefined,
                      imgUrl: null,
                      cards: [],
                    }
                  : null,
              document:
                lessonType === LessonResourceType.Document
                  ? { title: "", content: "" }
                  : null,
            },
  });

  const [chapterTitle, setChapterTitle] = React.useState<string>("");
  React.useEffect(() => {
    if (mode !== "add" || !chapterId) return;
    getChapterById(chapterId)
      .then((ch) => setChapterTitle(`${ch.order}. ${ch.title}`))
      .catch(() => setChapterTitle(""));
  }, [mode, chapterId]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: LessonFormValues) => {
      const safeTitle = (values.title ?? "").trim() || "Tài liệu mới";
      if (mode === "add") {
        if (!chapterId) throw new Error("Thiếu chapterId");

        if (lessonType === LessonResourceType.Document) {
          return createLesson({
            title: safeTitle,
            description: values.description || null,
            type: LessonResourceType.Document,
            chapterId,
            order: 1,
            document: {
              title: values.document?.title || safeTitle,
              content: values.document?.content || "",
            },
            studySet: null,
          });
        }

        // Study set path
        const studySetImgUrl = values.studySet?.imgFile
          ? (await studysetUploader.upload(values.studySet.imgFile as File))
              .publicUrl
          : null;

        const cardsWithUrls = await Promise.all(
          (values.studySet?.cards || []).map(async (c, idx) => {
            const file = (c as any).imgFile as File | undefined;
            const uploadedUrl = file
              ? (await cardUploader.upload(file)).publicUrl
              : undefined;
            const { imgFile, imgUrl: _ignored, ...rest } = c as any;
            return {
              ...rest,
              imgUrl: uploadedUrl ?? null,
              order: idx + 1,
            };
          }),
        );

        return createLesson({
          title: safeTitle,
          description: values.description || null,
          type: LessonResourceType.StudySet,
          chapterId,
          order: 1,
          studySet: {
            name: values.studySet?.name || "",
            keyword: values.studySet?.keyword || undefined,
            isPublic: !!values.studySet?.isPublic,
            imgUrl: studySetImgUrl,
            cards: cardsWithUrls,
          },
          document: null,
        });
      } else {
        if (!initialLesson) throw new Error("Thiếu dữ liệu ban đầu");
        const lessonId = initialLesson.id;

        if (lessonType === LessonResourceType.Document) {
          return updateLesson(lessonId, {
            title: safeTitle,
            description: values.description || null,
            type: LessonResourceType.Document,
            chapterId: initialLesson.chapterId,
            order: initialLesson.order,
            resourceId: initialLesson.resourceId,
            document: {
              title: values.document?.title || safeTitle,
              content: values.document?.content || "",
            },
            studySet: null,
          });
        }

        if (!initialStudySet) throw new Error("Thiếu dữ liệu ban đầu");
        const studySetImgUrl = values.studySet?.imgFile
          ? (await studysetUploader.upload(values.studySet.imgFile as File))
              .publicUrl
          : (values.studySet?.imgUrl ?? null);

        const cardsWithUrls = await Promise.all(
          (values.studySet?.cards || []).map(async (c, idx) => {
            const file = (c as any).imgFile as File | undefined;
            const uploadedUrl = file
              ? (await cardUploader.upload(file)).publicUrl
              : undefined;
            const { imgFile, ...rest } = c as any;
            return {
              ...rest,
              imgUrl: uploadedUrl ?? c.imgUrl ?? null,
              order: idx + 1,
            };
          }),
        );

        return updateLesson(lessonId, {
          title: safeTitle,
          description: values.description || null,
          type: LessonResourceType.StudySet,
          chapterId: initialLesson.chapterId,
          order: initialLesson.order,
          resourceId: initialLesson.resourceId,
          studySet: {
            name: values.studySet?.name || initialStudySet.name,
            keyword: values.studySet?.keyword || undefined,
            isPublic: !!values.studySet?.isPublic,
            imgUrl: studySetImgUrl,
            cards: cardsWithUrls,
          },
          document: null,
        });
      }
    },
  });

  const parseWords = (input: string): string[] => {
    return input
      .trim()
      .split(/\s+/)
      .map((w) => w.trim())
      .filter((w) => w.length > 0);
  };

  const applyAiFieldsToCard = (
    index: number,
    item: {
      meaning?: string;
      pronunciation?: string;
      pronounce?: string;
      sinoVietnamese?: string;
      type?: string;
      meaningDescription?: string;
      example?: string;
      exampleMeaning?: string;
    },
  ) => {
    const updateIfPresent = (fieldName: string, value: string | undefined) => {
      if (
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
      ) {
        form.setValue(fieldName as any, value, {
          shouldDirty: true,
          shouldTouch: true,
        });
      }
    };
    updateIfPresent(`studySet.cards.${index}.meaning`, item.meaning);
    updateIfPresent(
      `studySet.cards.${index}.pronounce`,
      (item as any).pronunciation ?? item.pronounce,
    );
    updateIfPresent(
      `studySet.cards.${index}.sinoVietnamese`,
      item.sinoVietnamese,
    );
    updateIfPresent(`studySet.cards.${index}.type`, item.type);
    updateIfPresent(
      `studySet.cards.${index}.meaningDescription`,
      item.meaningDescription,
    );
    updateIfPresent(`studySet.cards.${index}.example`, item.example);
    updateIfPresent(
      `studySet.cards.${index}.exampleMeaning`,
      item.exampleMeaning,
    );
  };

  const bulkAutofillExisting = async () => {
    const currentCards = form.getValues("studySet.cards") as any[];
    if (!currentCards || currentCards.length === 0) {
      toast({
        title: "Không có thẻ",
        description: "Danh sách thẻ hiện tại đang trống.",
        variant: "destructive",
      });
      return;
    }
    const words = currentCards.map((c) => c.word).filter(Boolean);
    if (words.length === 0) {
      toast({
        title: "Thiếu từ",
        description: "Hãy đảm bảo mỗi thẻ có từ để tự động điền.",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsBulkLoading(true);
      const result = await autoFillWords(words.map((w) => ({ word: w })));
      const map = new Map<string, any>();
      for (const item of result || []) {
        if (!item) continue;
        map.set((item as any).word, item);
      }
      const latestCards = form.getValues("studySet.cards") as any[];
      latestCards.forEach((c, idx) => {
        const it = map.get(c.word);
        if (it) applyAiFieldsToCard(idx, it as any);
      });
      toast({
        title: "Đã tự động điền",
        description: "Đã cập nhật tất cả thẻ hiện có.",
      });
      setBulkOpen(false);
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error?.message || "Không thể tự động điền.",
        variant: "destructive",
      });
    } finally {
      setIsBulkLoading(false);
    }
  };

  const bulkApplyAddOrOverride = async () => {
    const words = parseWords(bulkWordsInput);
    if (words.length === 0) {
      toast({
        title: "Thiếu từ",
        description: "Nhập danh sách từ để thêm.",
        variant: "destructive",
      });
      return;
    }

    const current = form.getValues("studySet.cards") as any[];
    let startIndex = 0;
    let nextCards: any[] = [];
    if (bulkMode === "override") {
      nextCards = words.map((w) => ({ word: w, meaning: "" }));
      form.setValue("studySet.cards", nextCards, { shouldDirty: true });
    } else {
      startIndex = current.length;
      const newOnes = words.map((w) => ({ word: w, meaning: "" }));
      nextCards = [...current, ...newOnes];
      form.setValue("studySet.cards", nextCards, { shouldDirty: true });
    }

    try {
      setIsBulkLoading(true);
      const result = await autoFillWords(words.map((w) => ({ word: w })));
      const map = new Map<string, any>();
      for (const item of result || []) {
        if (!item) continue;
        map.set((item as any).word, item);
      }
      const latestCards = form.getValues("studySet.cards") as any[];
      const rangeStart = bulkMode === "override" ? 0 : startIndex;
      const rangeEnd = latestCards.length - 1;
      for (let i = rangeStart; i <= rangeEnd; i++) {
        const w = latestCards[i]?.word;
        if (!w) continue;
        const it = map.get(w);
        if (it) applyAiFieldsToCard(i, it as any);
      }
      toast({
        title:
          bulkMode === "override"
            ? "Đã thay thế và tự động điền"
            : "Đã thêm và tự động điền",
        description:
          bulkMode === "override"
            ? "Toàn bộ thẻ đã được thay thế và cập nhật từ AI."
            : "Các thẻ mới đã được thêm và cập nhật từ AI.",
      });
      setBulkOpen(false);
      setBulkWordsInput("");
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error?.message || "Không thể xử lý danh sách từ.",
        variant: "destructive",
      });
    } finally {
      setIsBulkLoading(false);
    }
  };

  const handleSubmit = async (values: LessonFormValues) => {
    try {
      const res: any = await mutateAsync(values);
      if (mode === "add") {
        toast({
          title: "Thành công",
          description:
            lessonType === LessonResourceType.Document
              ? "Đã tạo bài học (Document)"
              : "Đã tạo bài học (Study set)",
        });
        const id = res?.id;
        if (id) router.replace(`/admin/lesson/${id}`);
        else router.back();
      } else {
        toast({ title: "Thành công", description: "Đã cập nhật bài học" });
        router.replace(`/admin/lesson/${initialLesson?.id}`);
      }
    } catch (error: any) {
      toast({
        title: "Thất bại",
        description:
          error?.message ||
          (mode === "add"
            ? "Không thể tạo bài học"
            : "Không thể cập nhật bài học"),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6">
      <div className="mx-auto max-w-6xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="mb-6">
              <h1 className="text-2xl font-bold">
                {mode === "add" ? "Thêm bài học" : "Chỉnh sửa bài học"}
              </h1>
              {mode === "add" && chapterId ? (
                <p className="text-sm text-muted-foreground">
                  Đang thêm vào chương {chapterTitle || `#${chapterId}`}
                </p>
              ) : null}
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Loại bài học</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  className="flex gap-6"
                  value={String(lessonType)}
                  onValueChange={(v) => {
                    const nextType = Number(v) as LessonResourceType;
                    setLessonType(nextType);
                    if (nextType === LessonResourceType.StudySet) {
                      form.setValue("document", null as any, {
                        shouldDirty: true,
                      });
                      if (!form.getValues("studySet")) {
                        form.setValue(
                          "studySet",
                          {
                            name: "",
                            keyword: "",
                            isPublic: false,
                            imgFile: undefined,
                            imgUrl: null,
                            cards: [],
                          } as any,
                          { shouldDirty: true },
                        );
                      }
                    } else if (nextType === LessonResourceType.Document) {
                      form.setValue("studySet", null as any, {
                        shouldDirty: true,
                      });
                      if (!form.getValues("document")) {
                        form.setValue(
                          "document",
                          {
                            title: form.getValues("title") || "",
                            content: "",
                          } as any,
                          { shouldDirty: true },
                        );
                      }
                    }
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={String(LessonResourceType.StudySet)}
                      id="type-studyset"
                    />
                    <Label htmlFor="type-studyset">Study set</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={String(LessonResourceType.Document)}
                      id="type-document"
                    />
                    <Label htmlFor="type-document">Document</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

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
                        <Textarea
                          placeholder="Nhập mô tả..."
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {lessonType === LessonResourceType.StudySet && (
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
                              existingUrl={
                                form.getValues("studySet.imgUrl") || undefined
                              }
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
                              <Input
                                placeholder="Từ khóa"
                                {...field}
                                value={field.value ?? ""}
                              />
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
            )}

            {lessonType === LessonResourceType.Document && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Tài liệu</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="document.title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tiêu đề tài liệu</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập tiêu đề tài liệu"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormLabel>Nội dung</FormLabel>
                  <LessonDocumentEditor
                    value={form.getValues("document.content") || ""}
                    onChange={(html) =>
                      form.setValue("document.content" as any, html, {
                        shouldDirty: true,
                        shouldTouch: true,
                      })
                    }
                  />
                </CardContent>
              </Card>
            )}

            {lessonType === LessonResourceType.StudySet && (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between rounded-md border bg-white px-6 py-4">
                  <div className="text-lg font-medium">Thẻ</div>
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setBulkOpen(true)}
                    >
                      <Sparkles className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="rounded-md">
                  <CardsEditor form={form} />
                </div>

                <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tự động điền hàng loạt</DialogTitle>
                      <DialogDescription>
                        Nhập danh sách từ (phân tách bằng khoảng trắng) để thêm
                        mới hoặc thay thế. Hoặc tự động điền cho toàn bộ thẻ
                        hiện có.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="bulk-words">Danh sách từ</Label>
                        <Textarea
                          id="bulk-words"
                          placeholder="Ví dụ: a b c d"
                          value={bulkWordsInput}
                          onChange={(e) => setBulkWordsInput(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Chế độ</Label>
                        <RadioGroup
                          className="flex gap-6"
                          value={bulkMode}
                          onValueChange={(v) => setBulkMode(v as any)}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="add" id="mode-add" />
                            <Label htmlFor="mode-add">Thêm (Append)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="override"
                              id="mode-override"
                            />
                            <Label htmlFor="mode-override">
                              Thay thế (Override)
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={bulkAutofillExisting}
                        disabled={isBulkLoading}
                      >
                        Tự động điền thẻ hiện có
                      </Button>
                      <Button
                        type="button"
                        onClick={bulkApplyAddOrOverride}
                        disabled={isBulkLoading}
                      >
                        {bulkMode === "override"
                          ? "Thay thế + tự động điền"
                          : "Thêm + tự động điền"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? mode === "add"
                    ? "Đang tạo..."
                    : "Đang cập nhật..."
                  : mode === "add"
                    ? "Tạo"
                    : "Lưu"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

type CardsEditorProps = {
  form: ReturnType<typeof useForm<LessonFormValues>>;
};

function CardsEditor({ form }: CardsEditorProps) {
  const cards = form.watch("studySet.cards");

  const [loadingByIndex, setLoadingByIndex] = React.useState<
    Record<number, boolean>
  >({});

  const addCard = () => {
    const next = [...cards, { word: "", meaning: "" }];
    form.setValue("studySet.cards", next);
  };

  const removeCard = (index: number) => {
    const next = cards.filter((_: any, i: number) => i !== index);
    form.setValue("studySet.cards", next);
  };

  const handleAutoFill = async (index: number) => {
    const word: string = form.getValues(
      `studySet.cards.${index}.word` as const,
    );
    if (!word || word.trim() === "") {
      toast({
        title: "Thiếu từ",
        description: "Vui lòng nhập từ trước khi tự động điền.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoadingByIndex((prev) => ({ ...prev, [index]: true }));
      const result = await autoFillWords([{ word }]);
      const first = result?.[0];
      if (!first) {
        toast({
          title: "Không có dữ liệu",
          description: "Không nhận được dữ liệu phù hợp từ AI.",
          variant: "destructive",
        });
        return;
      }

      const updateIfPresent = (
        fieldName: string,
        value: string | undefined,
      ) => {
        if (
          value !== undefined &&
          value !== null &&
          String(value).trim() !== ""
        ) {
          form.setValue(fieldName as any, value, {
            shouldDirty: true,
            shouldTouch: true,
          });
        }
      };

      // Map response fields to form fields, excluding the word itself
      updateIfPresent(`studySet.cards.${index}.meaning`, first.meaning);
      updateIfPresent(
        `studySet.cards.${index}.pronounce`,
        (first as any).pronunciation ?? (first as any).pronounce,
      );
      updateIfPresent(
        `studySet.cards.${index}.sinoVietnamese`,
        first.sinoVietnamese,
      );
      updateIfPresent(`studySet.cards.${index}.type`, first.type);
      updateIfPresent(
        `studySet.cards.${index}.meaningDescription`,
        first.meaningDescription,
      );
      updateIfPresent(`studySet.cards.${index}.example`, first.example);
      updateIfPresent(
        `studySet.cards.${index}.exampleMeaning`,
        first.exampleMeaning,
      );

      toast({
        title: "Đã tự động điền",
        description: `Đã cập nhật thông tin cho thẻ "${word}"`,
      });
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error?.message || "Không thể tự động điền từ AI.",
        variant: "destructive",
      });
    } finally {
      setLoadingByIndex((prev) => ({ ...prev, [index]: false }));
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {cards.map((card: any, index: number) => (
        <div
          key={card.id ?? index}
          className="col-span-1 rounded-md border bg-white p-4"
        >
          <div className="mb-2 flex justify-between">
            <div className="text-sm font-medium">#{index + 1}</div>
            <div className="flex flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAutoFill(index)}
                disabled={!!loadingByIndex[index]}
                title={
                  loadingByIndex[index]
                    ? "Đang lấy dữ liệu..."
                    : "Tự động điền bằng AI"
                }
              >
                <Sparkles className="h-4 w-4" />
              </Button>
              <Button
                type="button"
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
              name={`studySet.cards.${index}.imgFile` as const}
              render={({ field }) => (
                <FormItem className="col-span-1 row-span-4">
                  <FormLabel>Ảnh</FormLabel>
                  <FormControl>
                    <FileDropInput
                      value={field.value as File | undefined}
                      onChange={(file) => field.onChange(file)}
                      inputName={field.name}
                      existingUrl={
                        form.getValues(`studySet.cards.${index}.imgUrl`) ||
                        undefined
                      }
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
      <Button type="button" variant="secondary" onClick={addCard}>
        Thêm thẻ
      </Button>
    </div>
  );
}
