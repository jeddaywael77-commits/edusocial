export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: AuthUser;
  tokens: TokenPair;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
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

export interface ApiErrorResponse {
  message: string | string[];
  error?: string;
  statusCode: number;
}
