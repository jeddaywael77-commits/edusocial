import apiClient from "@/shared/lib/axios";
import { Media } from "@/shared/types";
import { getAccessToken } from "@/shared/lib/auth";
import { API_BASE_URL } from "@/shared/lib/constants";

export const mediaApi = {
  upload(file: File, category: string, onProgress?: (pct: number) => void): Promise<Media> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${API_BASE_URL}/media/upload`);
      xhr.setRequestHeader("Authorization", `Bearer ${getAccessToken()}`);

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          onProgress?.(Math.round((e.loaded / e.total) * 100));
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(`Upload failed: ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => reject(new Error("Upload failed")));
      xhr.addEventListener("abort", () => reject(new Error("Upload cancelled")));

      xhr.send(formData);
    });
  },

  uploadMultiple(
    files: File[],
    category: string,
    onProgress?: (fileIndex: number, pct: number) => void
  ): Promise<Media[]> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));
      formData.append("category", category);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${API_BASE_URL}/media/upload/multiple`);
      xhr.setRequestHeader("Authorization", `Bearer ${getAccessToken()}`);

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 100);
          files.forEach((_, i) => onProgress?.(i, pct));
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(`Upload failed: ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => reject(new Error("Upload failed")));
      xhr.send(formData);
    });
  },

  getMine: (params?: Record<string, string>) =>
    apiClient.get("/media/mine", { params }).then((r) => r.data),

  getStats: () => apiClient.get("/media/stats").then((r) => r.data),

  getById: (id: string): Promise<Media> =>
    apiClient.get(`/media/${id}`).then((r) => r.data),

  getSignedUrl: (id: string, expiresIn?: number) =>
    apiClient.get(`/media/${id}/signed-url`, { params: { expiresIn } }).then((r) => r.data),

  replace: (id: string, file: File): Promise<Media> => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.put(`/media/${id}/replace`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then((r) => r.data);
  },

  delete: (id: string) =>
    apiClient.delete(`/media/${id}`).then((r) => r.data),

  bulkDelete: (ids: string[]) =>
    apiClient.post("/media/bulk-delete", { ids }).then((r) => r.data),
};
