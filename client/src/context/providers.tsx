"use client";
import { SocketProvider } from "@/context/socketContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SocketProvider>{children}</SocketProvider>;
}
