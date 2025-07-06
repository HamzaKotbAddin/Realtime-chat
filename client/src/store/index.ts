import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserInfo {
  id: string;
  username: string;
  email: string;
  image?: string;
  profileSetup?: boolean;
  firstName?: string;
  lastName?: string;
  color?: number;
}

interface AppState {
  userInfo?: UserInfo;
  setUserInfo: (userInfo: UserInfo | undefined) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      userInfo: undefined,
      setUserInfo: (userInfo) => set({ userInfo }),
    }),
    {
      name: "app-store", // key for localStorage
      // optionally you can serialize/deserialize here or add partialize
      
    }
  )
);
