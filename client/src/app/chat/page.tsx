"use client";

import Loading from "./Chatloading";
import ContactsContainer from "./components/contacts.container";
import EmptyChatContainer from "./components/empty.chat.container";
import ChatContainer from "./components/chat.container";
import { useAppStore } from "@/store";

export default function ChatPage() {
  const selectedChatType = useAppStore((state) => state.selectedChatType);

  console.log("Selected chat type:", selectedChatType);

  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      <Loading />
      <ContactsContainer />
      {selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer />
      )}
    </div>
  );
}
