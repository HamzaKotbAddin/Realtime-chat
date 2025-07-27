"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createAuthSlice } from "./slice/auth.slice";
import { createChatSlice } from "./slice/chat.slice";

interface AppState {
  setChannels: any;
  channels: any;
  addChannel: any;
  fileDownloadProgress: any;
  fileUploadProgress: any;
  isDownloading: any;
  isUploading: any;
  directMessagesContact: any;
  setDirectMessagesContact: any;
  addMessage: any;
  closeChat: any;
  selectedChatType: any;
  selectedChatData: any;
  selectChatMessages: any;
  setSelectedChatType: (selectedChatType: any) => void;
  setSelectedChatData: (selectedChatData: any) => void;
  setSelectChatMessages: (selectChatMessages: any) => void;
  setIsDownloading: (isDownloading: any) => void;
  setIsUploading: (isUploading: any) => void;
  setfileDownloadProgress: (fileDownloadProgress: any) => void;
  setfileUploadProgress: (fileUploadProgress: any ) => void;
  userInfo: any;
  setUserInfo: (userInfo: any) => void;
  hasHydrated: boolean;
  setHasHydrated: (val: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...createAuthSlice(set),
      ...createChatSlice(set, get),
      hasHydrated: false,
      setHasHydrated: (val) => set({ hasHydrated: val }),
    }),
    {
      name: "app-store",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
