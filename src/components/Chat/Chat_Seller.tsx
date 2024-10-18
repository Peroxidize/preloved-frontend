import { useMediaQuery } from "react-responsive";
import css from "./Chat.module.css";
import { MobileNavBottom } from "../fragments/nav-bar/nav-bar";
import NavBar, { MobileNavTop } from "../fragments/nav-bar/nav-bar";
import {
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useRef,
  useState,
} from "react";
import sendIcon from "../../assets/icons/send.svg";
import sendIconFilled from "../../assets/icons/sendFilled.svg";
import { fetch_all_messages, fetch_chat_history_seller, fetch_chat_history_user, long_poll_messages, send_message } from "../../utils/chat";
import { atom, useAtomValue } from "jotai";
import { userAtom } from "../../App";
import { User } from "../misc";
import { useAtom } from "jotai/react";

interface SellerInformation {
  sellerID: string;
  storeName: string;
}

interface CustomerInformation {
  id: string;
  name: string;
}

export interface ChatMessage {
  id: number; // Unique identifier for the message
  is_read: boolean; // Indicates if the message has been read
  message: string; // The content of the message
  sellerID: string; // The ID of the seller
  sender: string; // The ID or name of the sender
  timestamp: string; // ISO 8601 format timestamp (e.g., "2024-10-17T21:52:51.105Z")
  userID: string; // The ID of the user
}

const activeChatAtom = atom<CustomerInformation | null>(null);

const Chatrooms = () => {
  const [selectedChat, setSelectedChat] = useState<CustomerInformation[]>([]);
  const [activeChatID, setActiveChatID] = useAtom(activeChatAtom);

  const fetch_history = async () => {
    const response = await fetch_chat_history_seller();
    const chats: CustomerInformation[] = response.map((chat: CustomerInformation) => ({
      id: chat.id,
      name: chat.name,
    }));

    setSelectedChat((prevSelectedChat) => [...prevSelectedChat, ...chats]);
  };

  useEffect(() => {
    const updateChat = async () => {
      await fetch_history();
    };

    updateChat();
  }, []);

  return (
    <div className={css.chatrooms}>
      <div className={css.chatroomsHeader}>
        <h1 className={css.chat}>Chat</h1>
      </div>
      <div className={css.spacer}></div>
      <div className={css.chatroomsContainer} key={"127848"}>
        {selectedChat.length > 0 &&
          selectedChat.map((chat) => (
            <div
              key={chat.id}
              className={`${css.chatroom} ${activeChatID?.id === chat.id && css.selected}`}
              onClick={() =>
                setActiveChatID({ id: chat.id, name: chat.name })
              }
            >
              <p>{chat.name}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

const Messages = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [isHovered, setIsHovered] = useState(false);
  const user = useAtomValue<User | null>(userAtom);
  const selectedChat = useAtomValue(activeChatAtom);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = async () => {
    if (newMessage.trim().length === 0) {
      return;
    }
    const seller_id = String(user!.user_id);
    const customer_id = String(selectedChat?.id);

    send_message(newMessage, customer_id, seller_id, seller_id);
    setNewMessage("");
    fetch_messages();
  };

  async function shortPolling(user_id: string, seller_id: string) {
    const response = await long_poll_messages(user_id, seller_id);
    const chats: ChatMessage[] = Array.isArray(response)
    ? response.map((chat: ChatMessage) => ({
        id: chat.id, // Unique identifier for the message
        is_read: chat.is_read, // Indicates if the message has been read
        message: chat.message, // The content of the message
        sellerID: chat.sellerID, // The ID of the seller (updated this, it was wrong before)
        sender: chat.sender, // The ID or name of the sender
        timestamp: chat.timestamp, // ISO 8601 format timestamp (e.g., "2024-10-17T21:52:51.105Z")
        userID: chat.userID // The ID of the user
      }))
    : [];

    setMessages(chats);
  }

  useEffect(() => {
    const user_id = String(selectedChat?.id);
    const seller_id = String(user?.user_id);
    const intervalID = setInterval(() => {
      fetch_messages();
    }, 500);

    return () => clearInterval(intervalID);
  }, [selectedChat]);

  const fetch_messages = async () => {
    const user_id: string = String(selectedChat?.id);
    const seller_id: string = String(user?.user_id);
    const response = await fetch_all_messages(user_id, seller_id);
    setMessages(response);
  }; 

  useEffect(() => {
    fetch_messages();
  }, [selectedChat]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]); // Trigger scroll when `messages` change

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault(); // prevents the default action, like form submission
      sendMessage();
    }
  };

  return (
    <div className={css.messages}>
      <h2 className={css.receiver}>{selectedChat?.name}</h2>
      <div className={css.messagesContainer}>
        {messages.map((message: ChatMessage) => (
          <div
            key={message.timestamp}
            className={`${css.message} ${message.sender === String(user!.user_id) ? css.sender : css.recipient}`}
            ref={messagesEndRef}
          >
            {message.message}
          </div>
        ))}
      </div>
      <div className={css.messageInputContainer}>
        <input
          type="text"
          placeholder="Type your message here"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button
          onClick={sendMessage}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img src={isHovered ? sendIconFilled : sendIcon} alt="Send" className={css.sendIcon} />
        </button>
      </div>
    </div>
  );
};

export const Chat_Seller = () => {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 1224px)",
  });

  return (
    <>
      {isDesktopOrLaptop ? <NavBar /> : <MobileNavTop />}
      <div className={css.spacer}></div>
      <div className={css.spacer}></div>
      <div className={css.wrapper}>
        <Chatrooms />
        <Messages />
      </div>
      {!isDesktopOrLaptop && <MobileNavBottom />}
    </>
  );
};
