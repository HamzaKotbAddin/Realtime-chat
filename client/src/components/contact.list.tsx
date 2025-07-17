import { useAppStore } from "@/store";
import { NEXTJS_URL } from "@/utils/constants";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const ContactList = ({ contacts, isChannel = false }: any) => {
  const setSelectedChatData = useAppStore((state) => state.setSelectedChatData);
  const setSelectedChatType = useAppStore((state) => state.setSelectedChatType);
  const selectedChatData = useAppStore((state) => state.selectedChatData);
  const setSelectChatMessages = useAppStore(
    (state) => state.setSelectChatMessages
  );

  const handleClick = (contact: any) => {
    setSelectedChatType(isChannel ? "channel" : "contact");
    setSelectedChatData(contact);

    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectChatMessages([]);
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-2 px-3">
      {contacts.map((contact: any) => {
        const isSelected =
          selectedChatData && selectedChatData._id === contact._id;

        const imageSrc = contact.image?.startsWith("http")
          ? contact.image
          : `${NEXTJS_URL}/${contact.image}`;

        const fallbackInitial =
          contact.username?.charAt(0).toUpperCase() || "?";

        return (
          <div
            key={contact._id}
            onClick={() => handleClick(contact)}
            className={`flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition-all duration-300
              ${
                isSelected
                  ? "bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white shadow-md"
                  : "bg-[#1e1f29] hover:bg-[#2a2b35] text-neutral-300"
              }`}
          >
            {/* Avatar */}
            {!isChannel ? (
              <Avatar className="w-12 h-12">
                <AvatarImage
                  src={imageSrc}
                  alt={contact.username}
                  className="object-cover w-full h-full rounded-full"
                />
                <AvatarFallback
                  className="w-full h-full flex items-center justify-center text-white font-bold text-lg rounded-full"
                  style={{
                    backgroundColor: contact.color
                      ? `#${contact.color.toString(16)}`
                      : "#808080",
                  }}
                >
                  {fallbackInitial}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="bg-[#808080] w-12 h-12 flex justify-center items-center rounded-full text-xl text-white">
                #
              </div>
            )}

            {/* Contact Info */}
            <div className="flex flex-col">
              <span
                className={`font-semibold ${
                  isSelected ? "text-white" : "text-neutral-200"
                }`}
              >
                {isChannel ? contact.name : contact.username}
              </span>
              {!isChannel && (
                <span className="text-sm text-neutral-400 truncate">
                  {contact.firstName} {contact.lastName}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ContactList;
