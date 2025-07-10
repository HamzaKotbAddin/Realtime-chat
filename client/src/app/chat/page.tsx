import Loading from "./Chatloading";
import ContactsContainer from "./components/contacts.container";
import EmptyChatContainer from "./components/empty.chat.container";
import ChatContainer from "./components/chat.container";

export default function ChatPage() {
  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      <Loading />
      <ContactsContainer />
      {/* <EmptyChatContainer /> */}
      <ChatContainer />
    </div>
  );
}
