"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppStore } from "@/store";
import { NEXTJS_URL } from "@/utils/constants";
import { AvatarImage } from "@radix-ui/react-avatar";
import { RiCloseFill } from "react-icons/ri";

const ChatHeader = () => {
  const closeChat = useAppStore((state) => state.closeChat);
  const selectedChatData = useAppStore((state) => state.selectedChatData);
  const SelectedChatType = useAppStore((state) => state.selectedChatType);
  const { userInfo } = useAppStore();

  const imageSrc = userInfo?.image?.startsWith("http")
    ? userInfo.image
    : `${NEXTJS_URL}/${userInfo?.image}`;

  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
      <div className="flex gap-5 items-center w-full justify-between ">
        <div className="flex gap-3 items-center justify-center ">
          <div className="relative w-12 h-12 rounded-full overflow-hidden">
            <Avatar className="w-full h-full bg-gray-700 text-white rounded-full flex items-center justify-center text-4xl font-bold">
              <AvatarImage
                src={imageSrc}
                alt="avatar"
                className="object-cover w-full h-full"
              />
              <AvatarFallback
                className={`w-full h-full flex items-center justify-center text-white font-bold text-lg`}
                style={{
                  backgroundColor: userInfo?.color
                    ? `#${userInfo.color.toString(16)}`
                    : "#808080",
                }}
              >
                {SelectedChatType === "channel"
                  ? "#"
                  : selectedChatData?.username?.charAt(0).toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
          </div>

          {SelectedChatType === "contact" && selectedChatData?.username}
          {SelectedChatType === "channel" && (
            <span className="font-semibold text-lg text-white">
              {selectedChatData?.name || "Unnamed Channel"}
            </span>
          )}
          {SelectedChatType !== "contact" &&
            SelectedChatType !== "channel" &&
            selectedChatData?.email}
        </div>

        <div className="flex items-center justify-center gap-5 ">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none duration-300 transition-all hover:text-white cursor-pointer"
            onClick={closeChat}
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
