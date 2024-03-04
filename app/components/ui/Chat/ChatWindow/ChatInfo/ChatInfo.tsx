import MyCard from "app/components/ui/Card/MyCard";
import React from "react";
import styles from "./ChatInfo.module.css";
import { AvatarGroup, Avatar } from "@nextui-org/react";
import useChatInfo from "./ChatInfo.hooks";

function ChatInfo() {
  const { chatInfo } = useChatInfo();

  return (
    <MyCard cardStyle={styles.card}>
      <p>name: {chatInfo?.name!}</p>
      <p>created: {new Date(chatInfo?.created!).toDateString()}</p>
      <p>private: {chatInfo?.private! ? "Yes" : "No"}</p>
      <AvatarGroup isBordered className="mt-2">
        {chatInfo?.members.map((memeber) => (
          <Avatar
            key={memeber.email}
            size="sm"
            src={memeber.image}
            color={memeber.status === "online" ? "success" : "warning"}
          />
        ))}
      </AvatarGroup>
    </MyCard>
  );
}

export default ChatInfo;
