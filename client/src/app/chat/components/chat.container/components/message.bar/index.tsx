"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";

const MessageBar = () => {
  const [message, setMessage] = useState("");

  const handleSendMessage = async () => {
    console.log(message);
  };
  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6 ">
      <div className="flex-1 flex bg-[#2a2b33] rounder-md items-center gap-5 pr-5">
        <input
          type="text"
          placeholder="Type your message here..."
          className="w-full bg-transparent p-3 focus:outline-none flex-1 rounded-md focus:border-none focus:ring-0"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="text-neutral-500 focus:border-none focus:outline-none
         duration-300 transition-all hover:text-white cursor-pointer
        "
        >
          <GrAttachment className="text-2xl" />
        </button>
        <button className="text-neutral-500 hover:text-white transition text-2xl focus:outline-none">
          <RiEmojiStickerLine />
        </button>
      </div>
      <button
        className="text-white hover:text-white transition rounded-md text-2xl focus:outline-none bg-purple-700 flex items-center justify-center p-4 hover:bg-purple-600 cursor-pointer"
        onClick={handleSendMessage}
      >
        <IoSend />
      </button>
    </div>
  );
};

export default MessageBar;
