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
import Lottie from "lottie-react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import animationData from "@/assets/gradient.animation.json";
import { apiClient } from "@/lib/api-client";
import { NEXTJS_URL, SEARCH_CONTACT } from "@/utils/constants";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";

const NewDM = () => {
  const [newChat, setNewChat] = useState<boolean>(false);
  const [searchContacts, setSearchContacts] = useState([]);
  const userInfo = useAppStore((state) => state.userInfo);
  const setSelectedChatData = useAppStore((state) => state.setSelectedChatData);
  const setSelectedChatType = useAppStore((state) => state.setSelectedChatType);

  const imageSrc = userInfo?.image?.startsWith("http")
    ? userInfo.image
    : `${NEXTJS_URL}/${userInfo?.image}`;

  const searchContact = async (searchTerm: string) => {
    try {
      if (searchTerm.length > 0) {
        const response = await apiClient.post(SEARCH_CONTACT, {
          searchTerm,
        });
        console.log("Response data:", response.data);
        if (response.status === 200 && response.data.contacts.length > 0) {
          setSearchContacts(response.data.contacts);
          console.log("Contacts set:", response.data.contacts);
        } else {
          setSearchContacts([]);
          console.log("No contacts found, clearing list");
        }
      } else {
        setSearchContacts([]);
        console.log("Empty search term, clearing contacts");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const selctContact = (contact: any) => {
    setNewChat(false);
    setSelectedChatData(contact);
    setSelectedChatType("contact");
    setSearchContacts([]);
    console.log(contact);
  };

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
          <p>Open new chat</p>
        </TooltipContent>
      </Tooltip>

      <Dialog open={newChat} onOpenChange={setNewChat}>
        <DialogContent className="bg-[#181920] border-[#2f303b] text-white w-[400px] h-[400px] flex flex-col items-center lg:w-[700px] lg:h-[600px]">
          <DialogHeader>
            <DialogTitle>select a contact.</DialogTitle>
            <DialogDescription />
          </DialogHeader>

          <div className="flex items-center justify-start w-full px-4">
            <input
              type="text"
              placeholder="search for a contact"
              name="search"
              className="rounded-md px-4 py-4 bg-[#2c2e3b] border-none outline-none w-full text-white text-sm leading-tight placeholder-gray-400"
              onChange={(e) => searchContact(e.target.value)}
            />
          </div>

          <ScrollArea className="w-full px-4">
            <div className="flex flex-col gap-5">
              {searchContacts.map((contact: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-3 items-center cursor-pointer"
                  onClick={() => selctContact(contact)}
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Avatar className="w-full h-full bg-gray-700 text-white rounded-full flex items-center justify-center text-4xl font-bold">
                      <AvatarImage
                        src={imageSrc}
                        alt="avatar"
                        className="object-cover w-full h-full"
                      />
                      <AvatarFallback
                        className="w-full h-full flex items-center justify-center text-white font-bold text-lg"
                        style={{ backgroundColor: contact.color || "#808080" }}
                      >
                        {contact.username?.charAt(0).toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white">{contact.username}</span>
                    <span className="text-white">{contact.email}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {searchContacts.length <= 0 && (
            <div className="flex flex-col justify-center items-center gap-4 mt-6 transition-all duration-700">
              <div className="w-[100px] h-[100px] lg:w-[200px] lg:h-[200px]">
                <Lottie animationData={animationData} loop={true} />
              </div>
              <TextGenerateEffect
                words="Search for a contact"
                className="text-2xl lg:text-3xl text-purple-500 mt-10"
                filter={true}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDM;
