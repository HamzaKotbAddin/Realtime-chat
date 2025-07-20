"use client";

import Loading from "./Chatloading";
import ContactsContainer from "./components/contacts.container";
import EmptyChatContainer from "./components/empty.chat.container";
import ChatContainer from "./components/chat.container";
import { useAppStore } from "@/store";

export default function ChatPage() {
  const selectedChatType = useAppStore((state) => state.selectedChatType);
  const isUploading = useAppStore((state) => state.isUploading);
  const isDownloading = useAppStore((state) => state.isDownloading);
  const fileUploadProgress = useAppStore((state) => state.fileUploadProgress);
  const fileDownloadProgres = useAppStore((state) => state.fileUploadProgress);

  console.log("Selected chat type:", selectedChatType);

  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      <Loading />
      {isUploading && (
        <div className="h-screen w-screen fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
          <h5 className="text-5xl animate-pulse ">Uploaing file</h5>
          {fileUploadProgress}%
        </div>
      )}
      {isDownloading && (
        <div className="h-screen w-screen fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
          <h5 className="text-5xl animate-pulse ">Downloading file</h5>
          {fileDownloadProgres}%
        </div>
      )}
      <ContactsContainer />
      {selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer />
      )}
    </div>
  );
}
