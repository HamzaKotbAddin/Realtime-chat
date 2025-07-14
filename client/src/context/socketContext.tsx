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

    return () => {
      if (socket.current) {
        console.log("Disconnecting socket...");
        socket.current.disconnect();
      }
    };
  }, [userInfo?.id]); // ✅ react only when _id is ready

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
