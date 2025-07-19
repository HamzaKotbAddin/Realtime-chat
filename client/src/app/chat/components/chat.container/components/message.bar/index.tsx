"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { useAppStore } from "@/store";
import { useSocket } from "@/context/socketContext";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { UPLOAD_FILE } from "@/utils/constants";

const MessageBar = () => {
  const emojiRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string>("");
  const [isEmojiOpen, setIsEmojiOpen] = useState<boolean>(false);
  const selectedChatType = useAppStore((state) => state.selectedChatType);
  const selectChatData = useAppStore((state) => state.selectedChatData);
  const userInfo = useAppStore((state) => state.userInfo);
  const socket = useSocket();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiRef.current &&
        !emojiRef.current.contains(event.target as Node)
      ) {
        setIsEmojiOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEmojiClick = async (emoji: any) => {
    setMessage((prev) => prev + emoji.emoji);
  };
  const handleSendMessage = async () => {
    if (!socket) {
      console.error("Socket is not connected");
      return;
    }

    if (!userInfo?.id) {
      console.error("User info missing or user ID undefined");
      return;
    }

    if (!selectChatData?._id) {
      console.error("Selected chat data missing or ID undefined");
      return;
    }

    if (!message.trim()) {
      toast.error("Cannot send empty message");
      return;
    }

    if (message.length > 1000) {
      toast.error("Message is too long");
      return;
    }
    if (selectedChatType === "contact") {
      socket.emit(
        "sendMessage",
        {
          sender: userInfo.id,
          content: message,
          recipient: selectChatData._id,
          messageType: "text",
          fileUrl: undefined,
          timeStamp: new Date(),
        },
        (response: { status: "ok" | "error"; error?: string }) => {
          if (response.status === "error") {
            console.error("Failed to send message:", response.error);
          }
        }
      );
    }
  };

  const handleAttachFile = () => {
    if (fileRef.current) fileRef.current.click();
  };

  const handleAttachChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      console.log({ file });
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post(UPLOAD_FILE, formData);
      if (response.status === 200 && response.data) {
        if (selectedChatType === "contact") {
          socket?.emit(
            "sendMessage",
            {
              sender: userInfo.id,
              content: undefined,
              recipient: selectChatData._id,
              messageType: "file",
              fileUrl: response.data.filePath,
              timeStamp: new Date(),
            },
            (response: { status: "ok" | "error"; error?: string }) => {
              if (response.status === "error") {
                console.error("Failed to send message:", response.error);
              }
            }
          );
        }
      }
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6 ">
      <div className="flex-1 flex bg-[#2a2b33] rounder-md items-center gap-5 pr-5">
        <input
          type="text"
          placeholder="Type your message here..."
          className="w-full bg-transparent p-3 focus:outline-none flex-1 rounded-md focus:border-none focus:ring-0"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="text-neutral-500 focus:border-none focus:outline-none
         duration-300 transition-all hover:text-white cursor-pointer
        "
          onClick={handleAttachFile}
        >
          <GrAttachment className="text-2xl" />
        </button>
        <input
          type="file"
          ref={fileRef}
          className="hidden"
          onChange={handleAttachChange}
        />
        <button
          className="text-neutral-500 hover:text-white transition text-2xl focus:outline-none"
          onClick={() => setIsEmojiOpen(!isEmojiOpen)}
        >
          <RiEmojiStickerLine />
        </button>
        <div className="absolute bottom-25 right-5" ref={emojiRef}>
          <EmojiPicker
            theme={Theme.AUTO}
            open={isEmojiOpen}
            lazyLoadEmojis={true}
            onEmojiClick={handleEmojiClick}
          />
        </div>
      </div>
      <button
        className="text-white hover:text-white transition rounded-md text-2xl focus:outline-none bg-purple-700 flex items-center justify-center p-4 hover:bg-purple-600 cursor-pointer"
        onClick={handleSendMessage}
      >
        <IoSend />
      </button>
    </div>
  );
};

export default MessageBar;
