"use client";

import { Button } from "@/components/ui/button";
import { RiCloseFill } from "react-icons/ri";
const ChatHeader = () => {
  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
      <div className="flex gap-5 items-center ">
        <div className="flex gap-3 items-center justify-center ">
          {"current chat "}
        </div>
        <div className="flex items-center justify-center gap-5 ">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none
 duration-300 transition-all hover:text-white cursor-pointer
"
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
