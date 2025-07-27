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
  const selectedChatData = useAppStore((state) => state.selectedChatData);
  const addMessage = useAppStore((state) => state.addMessage);

  useEffect(() => {
    if (!userInfo?.id) {
      console.log("❌ No user info found — skipping socket connection");
      return;
    }

    console.log("✅ Connecting to socket with userId:", userInfo.id);

    socket.current = io(NEXTJS_URL, {
      auth: {
        userId: userInfo.id,
      },
      forceNew: true,
      timeout: 5000,
    });

    socket.current.on("connect", () => {
      console.log(
        "🔌 Connected to socket server, socket ID:",
        socket.current?.id
      );
    });

    socket.current.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });

    socket.current.on("disconnect", (reason) => {
      console.warn("⚠️ Disconnected from socket:", reason);
    });

    const handleReceiveMessages = (message: any) => {
      console.log("📩 Incoming 'receiveMessages' event:", message);

      if (
        selectedChatType === "contact" &&
        (selectedChatData?._id === message.sender.id ||
          selectedChatData?._id === message.recipient.id)
      ) {
        console.log("✅ Matched current contact chat. Adding message.");
        addMessage(message);
      } else {
        console.log("❌ Message not relevant to current contact chat.");
      }
    };

    const handleReceiveChannelMessages = (message: any) => {
      console.log("📩 Incoming 'receive-channel-message' event:", message);

      if (
        selectedChatType === "channel" &&
        selectedChatData?._id === message.channelId
      ) {
        console.log("✅ Matched current channel chat. Adding message.");
        addMessage(message);
      } else {
        console.log("❌ Message not relevant to current channel chat.");
      }
    };

    socket.current.on("receiveMessages", handleReceiveMessages);
    socket.current.on("receive-channel-message", handleReceiveChannelMessages);

    return () => {
      if (socket.current) {
        console.log("🧹 Cleaning up socket listeners and disconnecting...");
        socket.current.off("receiveMessages", handleReceiveMessages);
        socket.current.off(
          "receive-channel-message",
          handleReceiveChannelMessages
        );
        socket.current.disconnect();
      }
    };
  }, [userInfo?.id, selectedChatType, selectedChatData?._id]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
