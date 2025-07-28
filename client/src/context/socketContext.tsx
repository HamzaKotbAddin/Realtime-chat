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
    console.log("🔄 useEffect triggered: Connecting socket");
    if (!userInfo || !userInfo.id) {
      console.log("❌ No user info found, aborting socket connection");
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
      console.log("🟢 Connected to socket server:", socket.current?.id);
    });

    socket.current.on("disconnect", (reason) => {
      console.log("🔴 Socket disconnected:", reason);
    });

    socket.current.on("connect_error", (err) => {
      console.error("⚠️ Socket connection error:", err);
    });

    const handleReciveMessages = (message: any) => {
      console.log("📩 Received DM message:", message);
      if (!message.sender) {
        console.warn(
          "Received incomplete message, fetching full message by ID",
          message._id
        );
      }
      if (
        selectedChatType === "contact" &&
        SelectedChatData?._id &&
        (SelectedChatData._id === message.sender._id ||
          SelectedChatData._id === message.recipient._id)
      ) {
        console.log("✅ Message matches current contact chat, adding message");
        addMessage(message);
      } else {
        console.log("ℹ️ Message does not match current contact chat, ignoring");
      }
    };

    const handeRecivedChannelMessage = (message: any) => {
      console.log("📩 Received channel message:", message);
      if (
        selectedChatType === "channel" &&
        SelectedChatData?._id &&
        SelectedChatData._id === message.channelId
      ) {
        console.log("✅ Message matches current channel chat, adding message");
        addMessage(message);
      } else {
        console.log("ℹ️ Message does not match current channel chat, ignoring");
      }
    };

    socket.current.on("receiveMessages", handleReciveMessages);
    socket.current.on("receive-channel-message", handeRecivedChannelMessage);

    return () => {
      if (socket.current) {
        console.log("⚠️ Disconnecting socket...");
        socket.current.disconnect();
      }
    };
  }, [userInfo?.id, selectedChatType, SelectedChatData, addMessage]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
