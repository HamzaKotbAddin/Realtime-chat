"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAppStore } from "@/store";
import { AUTH_LOGOUT, NEXTJS_URL } from "@/utils/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { FiEdit2 } from "react-icons/fi";
import { IoPowerSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";

const ProfileInfo = () => {
  const router = useRouter();
  const userInfo = useAppStore((state) => state.userInfo);
  const setUserInfo = useAppStore((state) => state.setUserInfo);

  const imageSrc = userInfo?.image?.startsWith("http")
    ? userInfo.image
    : `${NEXTJS_URL}/${userInfo?.image}`;

  const handleNavigate = () => router.push("/profile");

  const handleLogOut = async () => {
    try {
      const response = await apiClient.post(AUTH_LOGOUT);
      if (response.status === 200) {
        setUserInfo(null);
        router.push("/");
      }
    } catch {}
  };

  return (
    <div className="absolute bottom-0 h-16  flex items-center justify-between gap-4 px-2 w-full bg-[#2a2b33] ">
      <div className="flex gap-3 items-center justify-center ">
        <div className="w-12 h-12 relative">
          <div className="relative w-12 h-12 rounded-full overflow-hidden">
            <Avatar className="w-full h-full bg-gray-700 text-white rounded-full flex items-center justify-center text-4xl font-bold">
              <AvatarImage
                src={imageSrc}
                alt="avatar"
                className="object-cover w-full h-full"
              />
              <AvatarFallback
                className="w-full h-full flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: userInfo?.color }}
              >
                {userInfo?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="flex items-center justify-center text-sm font-semibold text-white ">
          <div className="truncate max-w-xs">{userInfo?.username}</div>
        </div>
      </div>
      <div className="flex gap-5">
        <Tooltip>
          <TooltipTrigger>
            <FiEdit2
              className="text-purple-500 hover:text-purple-400 text-xl font-medium cursor-pointer"
              onClick={handleNavigate}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] ">
            <p>{"Edit Profile"}</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <IoPowerSharp
              className="text-red-600 hover:text-red-400 text-xl font-medium cursor-pointer"
              onClick={handleLogOut}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] ">
            <p>{"logout"}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default ProfileInfo;
