
export interface ChatSlice {
    selectedChatType: any;
    selectedChatData: any;
    setSelectedChatType: (type: any) => void;
    setSelectedChatData: (data: any) => void;
    selectChatMessages: any;
    setSelectChatMessages: (messages: any) => void;
    closeChat: () => void;
    addMessage: (message: any) => void
  }
  


export const createChatSlice = (set : any, get : any) => ({
    selectedChatType: undefined,
    selectedChatData: undefined, 
    selectChatMessages: [],
    setSelectedChatType: (selectedChatType: any) => set({ selectedChatType }),
    setSelectedChatData: (selectedChatData: any) => set({ selectedChatData }),
    setSelectChatMessages: (selectChatMessages: any) => set({ selectChatMessages }),
    closeChat: () => set({ selectedChatType: undefined, selectedChatData: undefined, selectChatMessages: [] }),
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