import api from "./axios";

export type PresignRequest = {
  objectKey?: string;
  contentType: string;
  bucket?: string;
};

export type PresignResponse = {
  // The signed URL to upload to (PUT or POST depending on backend)
  uploadUrl: string;
  // Publicly accessible URL of the object after upload
  publicUrl: string;
  // Optional HTTP method (defaults to PUT)
  method?: "PUT" | "POST";
  // Optional headers to include when uploading (for PUT style)
  headers?: Record<string, string>;
  // Optional form fields (for POST/multipart style)
  fields?: Record<string, string>;
  // Echoed object key if server generated it
  objectKey?: string;
};

/**
 * Calls backend to create a presigned upload URL for object storage (MinIO/S3-compatible).
 * The backend endpoint can be configured through NEXT_PUBLIC_PRESIGN_ENDPOINT; defaults to /Upload/presign.
 */
export async function getPresignedUploadUrl(
  req: PresignRequest,
): Promise<PresignResponse> {
  const endpoint =
    process.env.NEXT_PUBLIC_PRESIGN_ENDPOINT || "/Upload/presign";
  const res = await api.post(endpoint, req);
  return res.data as PresignResponse;
}

// ---- Direct multipart upload API (backend handles storage & returns public URL) ----

export type UploadOptions = {
  folderPath: string;
  filename?: string | null;
};

/**
 * Uploads a single file via multipart/form-data to the backend.
 * Returns the public URL as returned by the server.
 */
export async function uploadFileDirect(
  file: File,
  options: UploadOptions,
  onProgress?: (percent: number) => void,
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post<string>(`/File/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    params: {
      folderPath: options.folderPath,
      filename: options.filename ?? null,
    },
    onUploadProgress: (evt) => {
      if (!evt.total) return;
      const pct = Math.round((evt.loaded / evt.total) * 100);
      onProgress?.(pct);
    },
  });
  return res.data as unknown as string;
}

// Helper: upload multiple images and return public URLs
export async function uploadMultiImages(
  files: Array<File & { preview?: string }>,
  pathPrefix: string,
): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    const url = await uploadFileDirect(file, {
      folderPath: pathPrefix,
      filename: null,
    });
    urls.push(url);
  }
  return urls;
}
