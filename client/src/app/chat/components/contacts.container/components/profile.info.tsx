"use client";

import { useAppStore } from "@/store";
import { NEXTJS_URL } from "@/utils/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
const ProfileInfo = () => {
  const userInfo = useAppStore((state) => state.userInfo);

  const imageSrc = userInfo?.image?.startsWith("http")
    ? userInfo.image
    : `${NEXTJS_URL}/${userInfo?.image}`;

  return (
    <div className="absolute bottom-0 h-16  flex items-center justify-between px-10 w-full bg-[#2a2b33] ">
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
        <div className="flex items-center justify-center gap-3 text-sm font-semibold text-white ">
          <div>{userInfo?.username}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
