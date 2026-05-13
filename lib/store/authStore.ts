// lib/store/authStore.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { User } from "@/types/user";

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthStore>()(
  immer((set) => ({
    user: null,
    isAuthenticated: false,

    setUser: (user) =>
      set((state) => {
        state.user = user;
        state.isAuthenticated = true;
      }),

    clearUser: () =>
      set((state) => {
        state.user = null;
        state.isAuthenticated = false;
      }),
  }))
);

// ========== СЕЛЕКТОРИ ==========

// Витягти користувача
export const selectUser = (state: AuthStore) => state.user;

// Витягти статус авторизації
export const selectIsAuthenticated = (state: AuthStore) =>
  state.isAuthenticated;

// Витягти email користувача
export const selectUserEmail = (state: AuthStore) => state.user?.email;

// Витягти username
export const selectUserUsername = (state: AuthStore) => state.user?.username;

// Витягти avatar
export const selectUserAvatar = (state: AuthStore) => state.user?.avatar;

// Витягти setUser
export const selectSetUser = (state: AuthStore) => state.setUser;

// Витягти clearUser
export const selectClearUser = (state: AuthStore) => state.clearUser;
