"use client";
import { useEffect, useState } from "react";
import { useAppStore } from "@/store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const LoadingRedirect = () => {
  const userInfo = useAppStore((state) => state.userInfo);
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  const selectedChatType = useAppStore((state) => state.selectedChatType);
  const router = useRouter();

  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    try {
      if (!hasHydrated) return;

      if (!userInfo) {
        toast.error("You must be logged in to access the chat.");
        router.push("/auth");
        setHasRedirected(true);
        return;
      }

      if (!userInfo.profileSetup) {
        toast.error(
          "Please complete your profile setup before accessing the chat."
        );
        router.push("/profile");
        setHasRedirected(true);
        return;
      }

      router.push("/chat");
      setHasRedirected(true);
    } catch (error) {
      console.error("Redirection error:", error);
      toast.error("Something went wrong while redirecting.");
    }
  }, [userInfo, hasHydrated, router]);

  return null;
};

export default LoadingRedirect;
