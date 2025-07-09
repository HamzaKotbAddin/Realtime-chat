"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  userInfo: any;
  setUserInfo: (userInfo: any) => void;
  hasHydrated: boolean;
  setHasHydrated: (val: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      userInfo: undefined,
      setUserInfo: (userInfo) => set({ userInfo }),
      hasHydrated: false,
      setHasHydrated: (val) => set({ hasHydrated: val }),
    }),
    {
      name: "app-store",
      // 💡 This gets called after Zustand rehydrates from localStorage
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
