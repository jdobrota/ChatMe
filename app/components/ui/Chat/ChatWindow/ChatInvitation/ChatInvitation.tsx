import MyCard from "app/components/ui/Card/MyCard";
import { User, Button } from "@nextui-org/react";
import styles from "./ChatInvitation.module.css";
import React from "react";
import { Chat } from "types/types";
import { TiTickOutline } from "react-icons/ti";
import { TiTimesOutline } from "react-icons/ti";
import useChatInvitation from "./ChatInvitation.hook";

function ChatInvitation({ chat }: { chat: Chat }) {
  const { resolveChatInviteRequest } = useChatInvitation(chat);

  return (
    <MyCard cardStyle={styles.card} bodyStyle={styles.cardBody}>
      <p className="text-xs">Invited to the chat by:</p>
      <MyCard cardStyle={styles.user}>
        <User
          name={chat.inviteFromUser?.name!}
          description={chat.inviteFromUser?.email!}
          avatarProps={{
            size: "sm",
            src: chat.inviteFromUser?.image!,
            isBordered: true,
            color:
              chat.inviteFromUser?.status! === "online" ? "success" : "warning",
          }}
        />
      </MyCard>
      <p className="mt-2 text-xs">{`Do you want to join chat "${chat.name}" ?`}</p>
      <span className={styles.span}>
        <Button
          isIconOnly
          color="success"
          aria-label="confirm"
          size="sm"
          className={styles.addButton}
          onClick={() => resolveChatInviteRequest(true)}
        >
          <TiTickOutline size={18} />
        </Button>
        <Button
          isIconOnly
          color="danger"
          aria-label="decline"
          size="sm"
          className={styles.addButton}
          onClick={() => resolveChatInviteRequest(false)}
        >
          <TiTimesOutline size={18} />
        </Button>
      </span>
    </MyCard>
  );
}

export default ChatInvitation;
