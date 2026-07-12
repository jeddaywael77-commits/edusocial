import { AxiosError } from "axios";

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: Record<string, string[]>;
}

export interface PaginatedMeta {
  total: number;
  nextCursor: string | null;
  hasNext: boolean;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

export function parseError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    const responseData = error.response?.data as Record<string, unknown> | undefined;
    const message =
      (responseData?.message as string) ??
      (responseData?.error as string) ??
      error.message ??
      "An unexpected error occurred";

    return {
      message: Array.isArray(message) ? message.join(", ") : message,
      status: error.response?.status ?? 0,
      code: error.code,
      details: responseData?.errors as Record<string, string[]> | undefined,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      status: 0,
    };
  }

  return {
    message: "An unexpected error occurred",
    status: 0,
  };
}

export function buildQueryParams(
  params: Record<string, unknown>
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      result[key] = String(value);
    }
  }
  return result;
}

export function cursorPaginationConfig<T>(params: {
  cursor?: string;
  limit?: number;
  queryKey: readonly unknown[];
  queryFn: (cursor?: string) => Promise<PaginatedResponse<T>>;
}) {
  return {
    queryKey: params.cursor
      ? [...params.queryKey, { cursor: params.cursor }]
      : params.queryKey,
    queryFn: () => params.queryFn(params.cursor),
    getNextPageParam: (lastPage: PaginatedResponse<T>) =>
      lastPage.meta.hasNext ? lastPage.meta.nextCursor : undefined,
    initialPageParam: undefined as string | undefined,
  };
}
