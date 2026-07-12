import { useUpdateUser } from "@/api/users";
import type { UpdateProfileData } from "../types";

export function useUpdateProfile() {
  return useUpdateUser();
}
