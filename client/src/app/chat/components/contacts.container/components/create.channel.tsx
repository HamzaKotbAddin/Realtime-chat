"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { apiClient } from "@/lib/api-client";
import {
  CREATE_CHANNEL,
  GET_ALL_CONTACTS,
  NEXTJS_URL,
} from "@/utils/constants";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/multi-select";
import { channel } from "process";

const NewChannel = () => {
  const [newChat, setNewChat] = useState<boolean>(false);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState<string[]>([]);
  const [channelName, setChannelName] = useState<string>("");

  const userInfo = useAppStore((state) => state.userInfo);
  const setSelectedChatData = useAppStore((state) => state.setSelectedChatData);
  const setSelectedChatType = useAppStore((state) => state.setSelectedChatType);
  const addChannel = useAppStore((state) => state.addChannel);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await apiClient.get(GET_ALL_CONTACTS);
        console.log("Response data:", response.data);
        setAllContacts(response.data.contacts);
        console.log("Response status:", response.data.contacts);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  const createNewChannel = async () => {
    try {
      console.log("Selected contacts:", selectedContact);
      if (channelName.length > 0 && selectedContact.length > 0) {
        const response = await apiClient.post(CREATE_CHANNEL, {
          name: channelName,
          members: selectedContact,
        });
        console.log("Channel creation response:", response.data);
        if (response.status === 200) {
          setChannelName("");
          setSelectedContact([]);
          setNewChat(false);
          addChannel(response.data.channel);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const imageSrc = userInfo?.image?.startsWith("http")
    ? userInfo.image
    : `${NEXTJS_URL}/${userInfo?.image}`;
  console.log("MultiSelect options:", allContacts);

  return (
    <>
      <Tooltip>
        <TooltipTrigger>
          <FaPlus
            className="text-neutral-400 font-light text-opacity-90 text-sm hover:text-neutral-300 cursor-pointer transition-all duration-300"
            onClick={() => setNewChat((prev) => !prev)}
          />
        </TooltipTrigger>
        <TooltipContent className="bg-[#1c1b1e]">
          <p>{`Create New Channel`}</p>
        </TooltipContent>
      </Tooltip>

      <Dialog open={newChat} onOpenChange={setNewChat}>
        <DialogContent className="bg-[#181920] border-[#2f303b] text-white w-[400px] h-[400px] flex flex-col items-center lg:w-[700px] lg:h-[600px]">
          <DialogHeader>
            <DialogTitle>{`fill the details for a new channel`}</DialogTitle>
            <DialogDescription />
          </DialogHeader>

          <div className="flex items-center justify-start w-full">
            <input
              type="text"
              placeholder="channel name"
              name="search"
              className="rounded-md px-4 py-4 bg-[#2c2e3b] border-none outline-none w-full text-white text-sm leading-tight placeholder-gray-400"
              onChange={(e) => setChannelName(e.target.value)}
              value={channelName}
            />
          </div>
          <div className="w-full">
            <MultiSelect
              options={allContacts}
              onValueChange={setSelectedContact}
              defaultValue={selectedContact}
              placeholder="search contacts"
              animation={2}
              maxCount={3}
              variant="inverted"
              className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white "
            />
          </div>
          <div className="w-full">
            <Button
              className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300 cursor-pointer"
              onClick={createNewChannel}
            >
              Create Channel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewChannel;
