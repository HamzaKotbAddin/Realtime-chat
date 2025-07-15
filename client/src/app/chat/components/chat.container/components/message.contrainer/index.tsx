import { useAppStore } from "@/store";
import { stat } from "fs";
import { useEffect, useRef } from "react";

const MessageContainer = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedChatType = useAppStore((state) => state.selectedChatType);
  const selectChatData = useAppStore((state) => state.selectedChatData);
  const userInfo = useAppStore((state) => state.userInfo);
  const selectChatMessages = useAppStore((state) =>state.selectChatMessages);

  useEffect( () => {
    if(scrollRef.current)
      scrollRef.current?.scrollIntoView({behavior: "smooth"});

  }[selectChatMessages])

  const renderMessaes = () => {};
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w[65vw] lg:w-[70vw] xl:w-[75vw] w-full">
      {renderMessaes()}
      <div ref={scrollRef} />
    </div>
  );
};

export default MessageContainer;
