"use client";
import { useEffect } from "react";
import { useAppStore } from "@/store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ChatPage() {
  const userInfo = useAppStore((state) => state.userInfo);
  const router = useRouter();

  useEffect(() => {
    // If no user or profileSetup is false, redirect
    if (!userInfo) {
      toast.error("You must be logged in to access the chat.");
      router.push("/auth"); // Or wherever you want to send non-auth users
      return;
    }
    if (!userInfo.profileSetup) {
      toast.error(
        "Please complete your profile setup before accessing the chat."
      );
      router.push("/profile"); // Redirect to profile setup page
    }
  }, [userInfo, router]);

  if (!userInfo || !userInfo.profileSetup) {
    return <p>Redirecting...</p>; // Or a loading spinner
  }

  return (
    <div>
      {/* Your chat UI here */}
      <h1>Welcome to Chat, {userInfo.username}</h1>
    </div>
  );
}
