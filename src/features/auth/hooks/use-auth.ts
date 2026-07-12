import { useProfile } from "./use-profile";
import { useLogin } from "./use-login";
import { useRegister } from "./use-register";
import { useLogout } from "./use-logout";

export function useAuth() {
  const profile = useProfile();
  const login = useLogin();
  const register = useRegister();
  const logout = useLogout();

  return {
    user: profile.data ?? null,
    isLoading: profile.isLoading,
    isAuthenticated: !!profile.data,
    isError: profile.isError,
    login,
    register,
    logout,
  };
}
