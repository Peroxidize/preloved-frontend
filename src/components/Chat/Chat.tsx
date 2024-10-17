import { useMediaQuery } from "react-responsive";
import css from "./Chat.module.css";
import { MobileNavBottom } from "../fragments/nav-bar/nav-bar";
import NavBar, { MobileNavTop } from "../fragments/nav-bar/nav-bar";
import { useState } from "react";

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
          >
            <p>{chatroom.name}</p>
          </div>
        ))}
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
        <div className={css.messages}>
          <h2 className={css.receiver}>Perms Store</h2>
          <div className={css.messagesContainer}></div>
          <div className={css.messageInputContainer}></div>
        </div>
      </div>
      {!isDesktopOrLaptop && <MobileNavBottom />}
    </>
  );
};
