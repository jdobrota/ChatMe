import React from "react";
import { Chat, Emoji, Message } from "types/types";
import MyCard from "../Card/MyCard";
import ChatTabsNav from "./ChatTabsNav/ChatTabsNav";
import ChatUserInput from "./ChatUserInput/ChatUserInput";
import ChatWindow from "./ChatWindow/ChatWindow";
import styles from "./MainChat.module.css";

function MainChat({
  initialMessages,
  initialChats,
  initialChatId,
  initialEmojis,
}: {
  initialMessages: Message[];
  initialChats: Chat[];
  initialChatId: string;
  initialEmojis: Record<string, Emoji[]>;
}) {
  return (
    <MyCard cardStyle={styles.card} providerStyle={styles.provider}>
      <ChatTabsNav initialChats={initialChats} initialChatId={initialChatId} />
      <ChatWindow initialMessages={initialMessages} />
      <ChatUserInput initialEmojis={initialEmojis} />
    </MyCard>
  );
}

export default MainChat;
