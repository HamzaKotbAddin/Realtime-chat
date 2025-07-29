"use client";

import ProfileInfo from "./components/profile.info";
import NewDM from "./components/new.dm";
import { useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { Get_DM_CONTACTS, GET_USER_CHANNELS } from "@/utils/constants";
import { useAppStore } from "@/store";
import ContactList from "@/components/contact.list";
import CreateChannel from "./components/create.channel";

const ContactsContainer = () => {
  const setDirectMessagesContact = useAppStore(
    (state) => state.setDirectMessagesContact
  );
  const directMessagesContact = useAppStore(
    (state) => state.directMessagesContact
  );

  const Channels = useAppStore((state) => state.channels);
  const setChannels = useAppStore((state) => state.setChannels);

  useEffect(() => {
    const getContacts = async () => {
      const response = await apiClient.get(Get_DM_CONTACTS);

      if (response.data.contacts) {
        setDirectMessagesContact(response.data.contacts);
      }
    };
    const getChannels = async () => {
      const response = await apiClient.get(GET_USER_CHANNELS);

      if (response.data.channels) {
        setChannels(response.data.channels);
      }
    };

    getChannels();
    getContacts();
  }, []);
  return (
    <div className="relative md:w[35vw] lg:w-[25vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
      <div className="pt-5  ">
        <Logo />
      </div>
      <div className="my-5 ">
        <div className="flex justify-between items-center  pr-10">
          <Title text="Direct Messages" />
          <NewDM />
        </div>
        <div className="max-h-[38v] overflow-y-auto">
          <ContactList contacts={directMessagesContact} />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channels" />
          <CreateChannel />
        </div>
        <div className="max-h-[38v] overflow-y-auto">
          <ContactList contacts={Channels} isChannel={true} />
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
};

const Logo = () => {
  return (
    <div className="flex items-center gap-2 p-5">
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-purple-600"
      >
        <path
          d="M3 5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V15C21 16.1046 20.1046 17 19 17H7L3 21V5Z"
          fill="#8338ec"
        />
        <circle cx="8" cy="10" r="1.5" fill="white" />
        <circle cx="12" cy="10" r="1.5" fill="white" />
        <circle cx="16" cy="10" r="1.5" fill="white" />
      </svg>
      <span className="text-3xl font-bold">chatterly</span>
    </div>
  );
};

export default ContactsContainer;

const Title = ({ text }: { text: string }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm ">
      {text}
    </h6>
  );
};
