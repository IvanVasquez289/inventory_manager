// src/store/useAuthStore.ts

import { create } from "zustand";

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  setToken: (token: string) => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
    set({ token })
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ token: null });
  },

  isAuthenticated: () => !!get().token,
}));
