import { persist } from "zustand/middleware";

import { create } from "zustand";
import type { User } from "../models/User";

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

interface AppState {
  user: User | null;
  tokens: Tokens | null;
  isAuthenticated: boolean;

  setAuth: (user: User, tokens: Tokens) => void;
  updateTokens: (tokens: Tokens) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,

      setAuth: (user, tokens) =>
        set({
          user,
          tokens,
          isAuthenticated: true,
        }),

      updateTokens: (tokens) =>
        set((state) => ({
          tokens,
          user: state.user,
          isAuthenticated: true,
        })),

      logout: () =>
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "app-storage",
    },
  ),
);
