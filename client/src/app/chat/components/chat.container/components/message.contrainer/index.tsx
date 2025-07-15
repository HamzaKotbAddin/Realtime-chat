"use client";
import { useAppStore } from "@/store";
import { useEffect, useRef } from "react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import { apiClient } from "@/lib/api-client";
import { GET_MESSAGES } from "@/utils/constants";

dayjs.extend(relativeTime); // Extend only once
dayjs.extend(localizedFormat);

const MessageContainer = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedChatType = useAppStore((state) => state.selectedChatType);
  const selectChatData = useAppStore((state) => state.selectedChatData);
  const userInfo = useAppStore((state) => state.userInfo);
  const selectChatMessages = useAppStore((state) => state.selectChatMessages);
  const setSelectChatMessages = useAppStore(
    (state) => state.setSelectChatMessages
  );
  const getMessages = async () => {
    try {
      const res = await apiClient.post(GET_MESSAGES, {
        id: selectChatData._id,
      });
      if (res.data?.messages) {
        setSelectChatMessages(res.data.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (selectChatData._id && selectedChatType === "contact") {
      getMessages();
    }
  }, [selectedChatType, selectChatData, setSelectChatMessages]);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
  }, [selectChatMessages]);

  const renderDMMessages = (message: any) => {
    const isSender = message.sender === userInfo?.id;

    const bubbleStyle = isSender
      ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 self-start"
      : "bg-[#2a2b33]/5 text-white/90 border-white/20 self-end";

    return (
      <div
        className={`p-3 my-2 border rounded-md max-w-[70%] break-words ${bubbleStyle}`}
      >
        <div className="text-sm">{message.content}</div>
        <div className="text-xs text-gray-400 mt-1">
          {dayjs(message.timeStamp).format("LT")}{" "}
        </div>
      </div>
    );
  };

  const renderMessages = () => {
    let lastDate: string | null = null;

    if (!selectChatMessages || selectChatMessages.length === 0) {
      return (
        <div className="text-center text-gray-500 mt-4">No messages yet.</div>
      );
    }

    return selectChatMessages.map((message: any, index: number) => {
      const messageDate = dayjs(message.timeStamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      if (showDate) {
      }
      lastDate = messageDate;

      return (
        <div
          key={message._id || index}
          className="flex flex-col items-start gap-1"
        >
          {showDate && (
            <div className="text-center text-gray-500 my-2 w-full">
              {dayjs(message.timeStamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
        </div>
      );
    });
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[75vw] w-full">
      {renderMessages()}
      <div ref={scrollRef} />
    </div>
  );
};

export default MessageContainer;
