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
    <div className="flex p-5  justify-start items-center gap-2">
      <svg
        id="logo-38"
        width="78"
        height="32"
        viewBox="0 0 78 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {" "}
        <path
          d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
          className="ccustom"
          fill="#8338ec"
        ></path>{" "}
        <path
          d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
          className="ccompli1"
          fill="#975aed"
        ></path>{" "}
        <path
          d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
          className="ccompli2"
          fill="#a16ee8"
        ></path>{" "}
      </svg>
      <span className="text-3xl font-semibold ">Syncronus</span>
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
