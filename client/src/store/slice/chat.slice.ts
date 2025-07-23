import { channel } from "diagnostics_channel";
import { IoIosDownload } from "react-icons/io";

export interface ChatSlice {
    selectedChatType: any;
    selectedChatData: any;
    isUploading: boolean;
  isDownloading: boolean;
  fileUploadProgress: number;
  fileDownloadProgress: number;
  setIsUploading: boolean
  setIsDownloading: boolean
  channels: any;
setfileUploadProgress: number
setfileDownloadProgress: number
    selectChatMessages: any;

    setSelectedChatType: (type: any) => void;
    setSelectedChatData: (data: any) => void;
      setChannels: (channels: any) => void;

    setSelectChatMessages: (messages: any) => void;
    addChannel: (channel: any) => void
    closeChat: () => void;
    addMessage: (message: any) => void
  }
  


export const createChatSlice = (set : any, get : any) => ({
    selectedChatType: undefined,
    selectedChatData: undefined, 
    selectChatMessages: [],
     directMessagesContact: [], 

     isUploading : false,
     isDownloading: false,
     fileUploadProgress: 0,
     fileDownloadProgress: 0,

     channels: [],
     
     setChannels: (channels: any) => set({ channels }),
     setIsUploading: (isUploading: boolean) => set({ isUploading }),
     setIsDownloading: (isDownloading: boolean) => set({isDownloading}),
      setfileUploadProgress: (fileUploadProgress: number) => set({ fileUploadProgress }),
     setfileDownloadProgress: (fileDownloadProgress: number) => set({fileDownloadProgress}),

    setSelectedChatType: (selectedChatType: any) => set({ selectedChatType }),
    setSelectedChatData: (selectedChatData: any) => set({ selectedChatData }),
    setSelectChatMessages: (selectChatMessages: any) => set({ selectChatMessages }),
    addChannel: (channel: any) => set({ channels: [...get().channels, channel] }),
    closeChat: () => set({ selectedChatType: undefined, selectedChatData: undefined, selectChatMessages: [] }),
    setDirectMessagesContact: (directMessagesContact: any) => set({ directMessagesContact }),
    addMessage: (message: any) => {

      const selectChatMessages = get().selectChatMessages;
      const selectedChatType = get().selectedChatType; 
    
    set({
      selectChatMessages: [...selectChatMessages, {
        ...message,
        recipient: selectedChatType === "channel" ? message.recipient : message.recipient.id,
        sender: selectedChatType === "channel" ? message.sender : message.sender.id
      }],
    })}
});