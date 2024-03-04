"use client";

import styles from "./ChatWindow.module.css";
import MessageItem from "./MessageItem/MessageItem";
import Loading from "../../../../loading";
import { Message } from "types/types";
import useChatWindow from "./ChatWindow.hook";
import ChatInfoButton from "./ChatInfo/ChatInfoButton/ChatInfoButton";
import InviteFriendsButton from "./InviteFriends/InviteFriendsButton/InviteFriendsButton";
import ChatInvitation from "./ChatInvitation/ChatInvitation";
import useUpdateMyStatus from "app/hooks/updateMyStatus.hook";

function ChatWindow({ initialMessages }: { initialMessages: Message[] }) {
  const { messages, chat } = useChatWindow();
  useUpdateMyStatus();

  return (
    <ul className={styles.messages + " " + styles.scroll}>
      {/* LIST OF MESSAGES IN THE CURRENT CHAT */}
      {chat?.invite ? (
        <ChatInvitation chat={chat} />
      ) : (
        <>
          {chat && <ChatInfoButton />}
          {chat && <InviteFriendsButton />}
          {messages || initialMessages ? (
            (messages || initialMessages)?.map((message) => (
              <MessageItem key={String(message?.id)}>{message}</MessageItem>
            ))
          ) : (
            <Loading />
          )}
        </>
      )}
    </ul>
  );
}

export default ChatWindow;
