// src/store/useAuthStore.ts

import { axiosInstance } from "@/lib/axios";
import { AuthUser } from "@/types";
import axios from "axios";
import { create } from "zustand";

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  checkAuth: () => Promise<void>;
  setToken: (token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  checkAuth: async () => {
    const token = localStorage.getItem("token");
    if (token) {
      set({ token });
      try {
        const {data} = await axiosInstance.get("/profile")
        set({ user: data });
      } catch (error) {
        console.error("Token inválido o expirado")
        localStorage.removeItem("token")
        set({ token: null, user: null })
      } 
    }else{
      set({ token: null, user: null });
    }

  },
  setToken: (token: string) => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
    set({ token });
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ token: null , user: null});
  },

  isAuthenticated: () => !!get().token,
}));
