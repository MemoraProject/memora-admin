"use client";

import { useCallback, useMemo, useState } from "react";
import { uploadFileDirect } from "@/api/upload";

type UploadResult = {
  publicUrl: string;
  objectKey?: string;
};

type UseUploadOptions = {
  // Optional logical folder/prefix, backend may use to compose object key
  prefix?: string;
  // Explicit bucket if your backend supports multiple buckets
  bucket?: string;
  // Validate file before requesting presign
  maxBytes?: number;
  allowedContentTypes?: string[];
};

type UploadState = {
  isUploading: boolean;
  progress: number; // 0..100 (best-effort; for PUT uploads we estimate based on xhr progress)
  error?: string;
};

export function useUpload(options?: UseUploadOptions) {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
  });

  const validateFile = useCallback(
    (file: File) => {
      if (options?.maxBytes && file.size > options.maxBytes) {
        throw new Error("File is too large");
      }
      if (
        options?.allowedContentTypes &&
        !options.allowedContentTypes.includes(file.type)
      ) {
        throw new Error("Unsupported file type");
      }
    },
    [options?.maxBytes, options?.allowedContentTypes],
  );

  const upload = useCallback(
    async (file: File): Promise<UploadResult> => {
      validateFile(file);
      setState({ isUploading: true, progress: 0, error: undefined });

      const publicUrl = await uploadFileDirect(
        file,
        {
          folderPath: options?.prefix ?? "uploads",
          filename: null,
        },
        (pct) => setState((s) => ({ ...s, progress: pct })),
      );

      setState({ isUploading: false, progress: 100 });
      return { publicUrl };
    },
    [validateFile, options?.prefix],
  );

  return useMemo(
    () => ({
      ...state,
      upload,
      reset: () => setState({ isUploading: false, progress: 0 }),
    }),
    [state, upload],
  );
}
