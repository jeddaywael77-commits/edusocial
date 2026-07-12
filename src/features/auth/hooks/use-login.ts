import { useLogin as useApiLogin } from "@/api/auth";
import type { LoginData } from "../types";

export function useLogin() {
  return useApiLogin();
}

export type UseLoginReturn = ReturnType<typeof useLogin>;
