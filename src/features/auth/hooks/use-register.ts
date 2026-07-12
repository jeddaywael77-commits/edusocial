import { useRegister as useApiRegister } from "@/api/auth";
import type { RegisterData } from "../types";

export function useRegister() {
  return useApiRegister();
}
