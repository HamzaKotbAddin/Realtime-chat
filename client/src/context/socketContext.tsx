"use client";

import { useAppStore } from "@/store";
import { NEXTJS_URL } from "@/utils/constants";
import { channel } from "diagnostics_channel";
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
    if (!userInfo || !userInfo.id) {
      console.log("❌ No user info found");
      return;
    }

    console.log("✅ Connecting with userId:", userInfo.id);

    socket.current = io(NEXTJS_URL, {
      auth: {
        userId: userInfo.id,
      },
      forceNew: true,
      timeout: 5000,
    });

    socket.current.on("connect", () => {
      console.log("Connected to socket server:", socket.current?.id);
    });

    socket.current.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    const handleReciveMessages = (message: any) => {
      if (
        selectedChatType !== undefined &&
        (SelectedChatData._id === message.sender.id ||
          SelectedChatData._id === message.recipient.id)
      ) {
        addMessage(message);
        console.log("Received message:", message);
      }
      return;
    };

    const handeRecivedChannelMessage = (message: any) => {
      if (
        selectedChatType !== undefined &&
        SelectedChatData._id === message.channelId
      ) {
        addMessage(message);
        console.log("Received message:", message);
      }
      return;
    };

    socket.current.on("receiveMessages", handleReciveMessages);
    socket.current.on("receive-channel-message", handeRecivedChannelMessage);

    return () => {
      if (socket.current) {
        console.log("Disconnecting socket...");
        socket.current.disconnect();
      }
    };
  }, [userInfo?.id, selectedChatType, SelectedChatData]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
