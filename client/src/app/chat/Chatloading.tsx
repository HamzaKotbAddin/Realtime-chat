"use client";
import { useEffect } from "react";
import { useAppStore } from "@/store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const loading = () => {
  const userInfo = useAppStore((state) => state.userInfo);
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  const router = useRouter();

  useEffect(() => {
    if (!hasHydrated) return;

    if (!userInfo) {
      toast.error("You must be logged in to access the chat.");
      router.push("/auth");
      return;
    }

    if (!userInfo.profileSetup) {
      toast.error(
        "Please complete your profile setup before accessing the chat."
      );
      router.push("/profile");
    }
  }, [userInfo, hasHydrated, router]);

  if (!hasHydrated) {
    return <div>Loading...</div>;
  }
};

export default loading;
