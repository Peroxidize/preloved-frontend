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
import { fetch_all_messages, fetch_chat_history_user, long_poll_messages, send_message } from "../../utils/chat";
import { atom, useAtomValue } from "jotai";
import { userAtom } from "../../App";
import { User } from "../misc";
import { useAtom } from "jotai/react";

interface SellerInformation {
  sellerID: string;
  storeName: string;
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

export const sellerIDAtom = atom<number | null>(null);
export const storeNameAtom = atom<string | null>(null);
const activeChatAtom = atom<SellerInformation | null>(null);

const Chatrooms = () => {
  const [selectedChat, setSelectedChat] = useState<SellerInformation[]>([]);
  const [activeChatID, setActiveChatID] = useAtom(activeChatAtom);
  const sellerID = useAtomValue(sellerIDAtom);
  const storeName = useAtomValue(storeNameAtom);

  const fetch_history = async () => {
    const response = await fetch_chat_history_user();
    const chats: SellerInformation[] = response.map((chat: any) => ({
      sellerID: chat.id,
      storeName: chat.name,
    }));

    setSelectedChat((prevSelectedChat) => {
      // Create a new array that includes previous chats
      const combinedChats = [...prevSelectedChat, ...chats];

      // Filter to keep only unique chats based on sellerID
      return combinedChats.filter(
        (c, index, self) => index === self.findIndex((x) => x.sellerID === c.sellerID)
      );
    });
  };

  useEffect(() => {
    if (sellerID !== null && storeName !== null) {
      const chat_info: SellerInformation = {
        sellerID: String(sellerID),
        storeName: storeName!,
      };
      setActiveChatID(chat_info);
      setSelectedChat((prevSelectedChat) => [...prevSelectedChat, chat_info]);
    }

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
      <div className={css.chatroomsContainer}>
        {selectedChat.length > 0 &&
          selectedChat.map((chat) => (
            <div
              key={chat.sellerID}
              className={`${css.chatroom} ${activeChatID?.sellerID === chat.sellerID && css.selected}`}
              onClick={() =>
                setActiveChatID({ sellerID: chat.sellerID, storeName: chat.storeName })
              }
            >
              <p>{chat.storeName}</p>
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

    send_message(newMessage, String(user!.user_id), String(selectedChat?.sellerID), String(user!.user_id));
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
    const user_id = String(user?.user_id);
    const seller_id = String(selectedChat?.sellerID);
    const intervalID = setInterval(() => {
      fetch_messages();
    }, 500);

    return () => clearInterval(intervalID);
  }, [selectedChat]);

  const fetch_messages = async () => {
    const user_id: string = String(user?.user_id);
    const seller_id: string = String(selectedChat?.sellerID);
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

  return (
    <div className={css.messages}>
      <h2 className={css.receiver}>{selectedChat?.storeName}</h2>
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

export const Chat = () => {
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
