import { FcInfo } from "react-icons/fc";
import React, { useState } from "react";
import styles from "./ChatInfoButton.module.css";
import ChatInfo from "../ChatInfo";

function ChatInfoButton() {
  const [showInfo, setShowInfo] = useState<boolean>(false);

  function changeChatInfo() {
    setShowInfo(!showInfo);
  }

  return (
    <>
      <FcInfo
        size={30}
        className={styles.infoBtn}
        onMouseEnter={changeChatInfo}
        onMouseLeave={changeChatInfo}
      />
      {showInfo && <ChatInfo />}
    </>
  );
}

export default ChatInfoButton;
