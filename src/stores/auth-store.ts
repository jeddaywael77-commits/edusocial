import { create } from "zustand";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; role: string }) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  updateProfile: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      // Mock login - replace with actual API call
      await new Promise((r) => setTimeout(r, 1000));
      const mockUser: User = {
        id: "1",
        name: "Ahmed Benali",
        email,
        avatar: "",
        coverPhoto: "",
        bio: "Computer Science Student | Passionate about AI and Web Development",
        role: "student",
        isOnline: true,
        lastSeen: new Date().toISOString(),
        school: "Ecole Superieure d'Informatique",
        department: "Computer Science",
        xp: 2450,
        level: 12,
        coins: 350,
        badges: [
          { id: "1", name: "Quick Learner", icon: "🎓", description: "Completed 10 lessons", color: "#3B82F6", earnedAt: "2024-01-15" },
          { id: "2", name: "Helpful", icon: "🤝", description: "Answered 20 questions", color: "#22C55E", earnedAt: "2024-02-10" },
          { id: "3", name: "Streak Master", icon: "🔥", description: "30 day streak", color: "#F59E0B", earnedAt: "2024-03-01" },
        ],
        followersCount: 156,
        followingCount: 89,
        postsCount: 45,
        friendsCount: 234,
        createdAt: "2023-09-01",
      };
      localStorage.setItem("token", "mock-jwt-token");
      set({ user: mockUser, token: "mock-jwt-token", isLoading: false, isAuthenticated: true });
    } catch {
      set({ isLoading: false });
      throw new Error("Invalid credentials");
    }
  },

  register: async (data) => {
    set({ isLoading: true });
    try {
      await new Promise((r) => setTimeout(r, 1000));
      const mockUser: User = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        avatar: "",
        coverPhoto: "",
        bio: "",
        role: data.role as User["role"],
        isOnline: true,
        lastSeen: new Date().toISOString(),
        school: "",
        department: "",
        xp: 0,
        level: 1,
        coins: 50,
        badges: [],
        followersCount: 0,
        followingCount: 0,
        postsCount: 0,
        friendsCount: 0,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("token", "mock-jwt-token");
      set({ user: mockUser, token: "mock-jwt-token", isLoading: false, isAuthenticated: true });
    } catch {
      set({ isLoading: false });
      throw new Error("Registration failed");
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  setUser: (user) => set({ user, isAuthenticated: true, isLoading: false }),

  updateProfile: (data) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    })),
}));
