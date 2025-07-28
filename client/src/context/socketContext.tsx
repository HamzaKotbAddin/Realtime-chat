"use client";

import { useAppStore } from "@/store";
import { NEXTJS_URL } from "@/utils/constants";
import { useContext, createContext, useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socket = useRef<Socket | null>(null);
  const userInfo = useAppStore((state) => state.userInfo);
  const selectedChatType = useAppStore((state) => state.selectedChatType);
  const SelectedChatData = useAppStore((state) => state.selectedChatData);
  const addMessage = useAppStore((state) => state.addMessage);

  useEffect(() => {
    if (!userInfo?.id) return;

    socket.current = io(NEXTJS_URL, {
      auth: { userId: userInfo.id },
      forceNew: true,
      timeout: 5000,
    });

    socket.current.on("connect", () => {
      console.log("🟢 Connected to socket server:", socket.current?.id);
    });

    socket.current.on("disconnect", (reason) => {
      console.log("🔴 Socket disconnected:", reason);
    });

    socket.current.on("connect_error", (err) => {
      console.error("⚠️ Socket connection error:", err);
    });

    return () => {
      socket.current?.disconnect();
    };
  }, [userInfo?.id]);

  useEffect(() => {
    if (!socket.current) return;

    const handleReceiveMessages = (message: any) => {
      console.log("📩 Received DM message:", message);

      if (
        selectedChatType === "contact" &&
        SelectedChatData?._id &&
        (SelectedChatData._id === message.sender._id ||
          SelectedChatData._id === message.recipient._id)
      ) {
        addMessage(message);
      }
    };

    const handleReceiveChannelMessage = (message: any) => {
      if (
        selectedChatType === "channel" &&
        SelectedChatData?._id === message.channelId
      ) {
        addMessage(message);
      }
    };

    socket.current.on("receiveMessages", handleReceiveMessages);
    socket.current.on("receive-channel-message", handleReceiveChannelMessage);

    return () => {
      socket.current?.off("receiveMessages", handleReceiveMessages);
      socket.current?.off(
        "receive-channel-message",
        handleReceiveChannelMessage
      );
    };
  }, [selectedChatType, SelectedChatData, addMessage]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
