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
import { SEARCH_CONTACT } from "@/utils/constants";
import { ScrollArea } from "@radix-ui/react-scroll-area";

const NewDM = () => {
  const [newChat, setNewChat] = useState<boolean>(false);
  const [searchContacts, setSearchContacts] = useState([]);

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

  return (
    <>
      <Tooltip>
        <TooltipTrigger>
          <FaPlus
            className="text-neutral-400 font-light text-opacity-90 text-sm hover:text-neutral-300 cursor-pointer transition-all duration-300"
            onClick={() => setNewChat((prev) => !prev)}
          />
        </TooltipTrigger>
        <TooltipContent className="bg-[#1c1b1e] ">
          <p> {`Open new chat`}</p>
        </TooltipContent>
      </Tooltip>
      <Dialog open={newChat} onOpenChange={setNewChat}>
        <DialogContent className="bg-[#181920] border-[#2f303b] text-white w-[400px] h-[400px] flex flex-col items-center lg:w-[700px] lg:h-[600px] ">
          <DialogHeader>
            <DialogTitle>{`select a contact.`}</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-start overflow-hidden">
            <input
              type="text"
              placeholder="search for a contact"
              name="search"
              className="rounded-lg px-12 py-4 bg-[#2c2e3b] border-none outline-none w-full lg:px-24 lg:py-4"
              onChange={(e) => searchContact(e.target.value)}
            />
          </div>
          <ScrollArea className="h-[250px]">
            <div className="flex flex-col gap-5">
              {searchContacts.map((contact: any, index: number) => {
                return (
                  <div
                    key={index}
                    className="flex gap-3 items-center curser-pointer "
                  ></div>
                );
              })}
            </div>
          </ScrollArea>
          {searchContacts.length <= 0 && (
            <div>
              <div className="flex-1  flex flex-col justify-center items-center duration-1000 transition-all mt-10">
                <div className="w-[100px] h-[100px] lg:w-[200px] lg:h-[200px]">
                  <Lottie animationData={animationData} loop={true} />
                </div>
                <TextGenerateEffect
                  words="Search for a contact"
                  className="text-2xl lg:text-3xl text-purple-500 mt-10 "
                  filter={true}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDM;
