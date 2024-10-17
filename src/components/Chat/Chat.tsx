import { useMediaQuery } from "react-responsive";
import css from "./Chat.module.css";
import { MobileNavBottom } from "../fragments/nav-bar/nav-bar";
import NavBar, { MobileNavTop } from "../fragments/nav-bar/nav-bar";
import { useState } from "react";
import sendIcon from "../../assets/icons/send.svg";
import sendIconFilled from "../../assets/icons/sendFilled.svg";

const chatroomData = [
  {
    id: 1,
    name: "Perms Store",
  },
  {
    id: 2,
    name: "Kenjas Store",
  },
  {
    id: 3,
    name: "Nathaniel's Stuff",
  },
];

const Chatrooms = () => {
  const [selectedChatroom, setSelectedChatroom] = useState(1);
  return (
    <div className={css.chatrooms}>
      <div className={css.chatroomsHeader}>
        <h1 className={css.chat}>Chat</h1>
      </div>
      <div className={css.spacer}></div>
      <div className={css.chatroomsContainer}>
        {chatroomData.map((chatroom) => (
          <div
            key={chatroom.id}
            className={`${css.chatroom} ${selectedChatroom === chatroom.id && css.selected}`}
            onClick={() => setSelectedChatroom(chatroom.id)}
          >
            <p>{chatroom.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Messages = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you?", sender: "recipient" },
    { id: 2, text: "I have a question about my order.", sender: "sender" },
    { id: 3, text: "Sure, I'd be happy to help. What's your order number?", sender: "recipient" },
  ]);

  const [isHovered, setIsHovered] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([...messages, { id: messages.length + 1, text: newMessage, sender: "sender" }]);
      setNewMessage("");
    }
  };

  return (
    <div className={css.messages}>
      <h2 className={css.receiver}>Perms Store</h2>
      <div className={css.messagesContainer}>
        {messages.map((message) => (
          <div key={message.id} className={`${css.message} ${css[message.sender]}`}>
            {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <div className={css.messageInputContainer}>
          <input
            type="text"
            placeholder="Type your message here"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img src={isHovered ? sendIconFilled : sendIcon} alt="Send" className={css.sendIcon} />
          </button>
        </div>
      </form>
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
