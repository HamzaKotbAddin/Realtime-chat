"use client";

import { useAppStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import { apiClient } from "@/lib/api-client";
import {
  GET_CHANNEL_MESSAGES,
  GET_MESSAGES,
  NEXTJS_URL,
} from "@/utils/constants";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown, IoMdClose } from "react-icons/io";
import Image from "next/image";
import { AvatarFallback, Avatar, AvatarImage } from "@/components/ui/avatar";

// Extend dayjs
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

const MessageContainer = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const selectedChatType = useAppStore((state) => state.selectedChatType);
  const selectChatData = useAppStore((state) => state.selectedChatData);
  const userInfo = useAppStore((state) => state.userInfo);
  const selectChatMessages = useAppStore((state) => state.selectChatMessages);
  const setSelectChatMessages = useAppStore(
    (state) => state.setSelectChatMessages
  );
  const setIsdownloading = useAppStore((state) => state.setIsDownloading);
  const setfileDownloadProgress = useAppStore(
    (state) => state.setfileDownloadProgress
  );

  useEffect(() => {
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
    const getChannelMessages = async () => {
      try {
        const res = await apiClient.get(
          `${GET_CHANNEL_MESSAGES}/${selectChatData._id}`
        );
        if (res.data?.messages) {
          setSelectChatMessages(res.data.messages);
        }
      } catch (error) {
        console.error("Error fetching channel messages:", error);
      }
    };
    if (selectedChatType === "contact") {
      console.log("🔄 Fetching messages for chat ID:", selectChatData._id);
      getMessages();
    }
    if (selectedChatType === "channel") {
      console.log("🔄 Fetching messages for channel ID:", selectChatData._id);
      getChannelMessages();
    }
  }, [selectedChatType, selectChatData, setSelectChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectChatMessages]);

  const handleDownloadFile = async (fileUrl: string) => {
    try {
      if (!fileUrl) return;
      setIsdownloading(true);
      setfileDownloadProgress(0);
      const response = await apiClient.get(`${NEXTJS_URL}/${fileUrl}`, {
        responseType: "blob",
        onDownloadProgress(progressEvent) {
          const { loaded, total } = progressEvent;
          const percentCompleted = Math.round((loaded * 100) / (total ?? 1));
          setfileDownloadProgress(percentCompleted);
        },
      });

      const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = urlBlob;
      link.setAttribute("download", fileUrl.split("/").pop() ?? "file");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(urlBlob);
      setIsdownloading(false);
      setfileDownloadProgress(0);
    } catch (error) {
      setIsdownloading(false);
      setfileDownloadProgress(0);
      console.error("Error downloading file:", error);
    }
  };

  const checkIfImage = (filePath: string) => {
    return /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|tiff|jfif|heic|heif)$/i.test(
      filePath
    );
  };

  const renderDMMessages = (message: any) => {
    const isSender = message.sender._id === userInfo?.id;

    const bubbleAlignment = isSender ? "self-end" : "self-start";
    const bubbleColors = isSender
      ? "bg-gradient-to-r from-purple-600 to-purple-800 text-white"
      : "bg-gray-700 text-white";

    return (
      <div
        className={`p-3 my-2 rounded-xl max-w-[70%] break-words ${bubbleColors} ${bubbleAlignment}`}
      >
        <div className="text-sm whitespace-pre-wrap">{message.content}</div>

        {message.messageType === "file" && (
          <div className="mt-3">
            {checkIfImage(message.fileUrl) ? (
              <div>
                <Image
                  src={`${NEXTJS_URL}/${message.fileUrl}`}
                  alt="file"
                  height={300}
                  width={300}
                  style={{ width: "auto", height: "auto" }}
                  className="rounded-lg cursor-pointer hover:opacity-80 transition"
                  onClick={() =>
                    setPreviewImage(`${NEXTJS_URL}/${message.fileUrl}`)
                  }
                />
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-black/30 p-2 rounded-lg mt-2">
                <MdFolderZip className="text-3xl text-purple-300" />
                <span
                  className="truncate max-w-[150px] text-sm"
                  title={message.fileUrl.split("/").pop()}
                >
                  {message.fileUrl.split("/").pop()}
                </span>
                <IoMdArrowRoundDown
                  className="text-2xl hover:text-purple-300 cursor-pointer transition"
                  onClick={() => handleDownloadFile(message.fileUrl)}
                />
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-300 mt-2 text-right">
          {dayjs(message.timeStamp).format("LT")}
        </div>
      </div>
    );
  };

  const renderChannelMessages = (message: any) => {
    return (
      <div
        className={`mt-5 ${
          message.sender.id !== userInfo?.id ? "self-end" : "self-start"
        }`}
      >
        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
        {message.sender._id !== userInfo?.id && (
          <div className="flex items-center justify-center gap-3">
            <Avatar className="w-8 h-8 bg-gray-700 text-white rounded-full flex items-center justify-center text-4xl font-bold">
              <AvatarImage
                src={`${NEXTJS_URL}/${message?.sender?.image}`}
                alt="avatar"
                className="object-cover w-full h-full"
              />
              <AvatarFallback
                className={`w-full h-full flex items-center justify-center text-white font-bold text-lg`}
                style={{
                  backgroundColor: message?.sender?.color
                    ? `#${message.sender.color.toString(16)}`
                    : "#808080",
                }}
              >
                {selectChatData === "channel"
                  ? "#"
                  : message?.sender?.username?.charAt(0).toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
          </div>
        )}

        <div className="text-xs text-gray-300 mt-2 text-right">
          {dayjs(message.timeStamp).format("LT")}
        </div>
      </div>
    );
  };

  const renderMessages = () => {
    let lastDate: string | null = null;

    if (!selectChatMessages || selectChatMessages.length === 0) {
      return (
        <div className="text-center text-gray-400 mt-10 italic">
          No messages yet. Start the conversation!
        </div>
      );
    }

    return selectChatMessages.map((message: any, index: number) => {
      const messageDate = dayjs(message.timeStamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={message._id || index} className="flex flex-col items-start">
          {showDate && (
            <div className="text-center text-gray-400 my-3 w-full text-sm">
              {dayjs(message.timeStamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
          {selectedChatType === "channel" && renderChannelMessages(message)}
        </div>
      );
    });
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[75vw] w-full relative">
      {renderMessages()}
      <div ref={scrollRef} />

      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <Image
              src={previewImage}
              alt="Preview"
              width={600}
              height={600}
              className="rounded-lg max-w-[90vw] max-h-[80vh] object-contain"
            />
            <button
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-2 hover:bg-black/80 cursor-pointer"
              onClick={() => setPreviewImage(null)}
            >
              <IoMdClose size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
