import React, { useState } from "react";
import { IoPersonAddOutline } from "react-icons/io5";
import styles from "./InviteFriendsButton.module.css";
import { Button } from "@nextui-org/react";
import InviteFriendsWindow from "../InviteFriendsWindow";

function InviteFriendsButton() {
  const [showInviteFriendsWindow, setShowInviteFriendsWindow] =
    useState<boolean>(false);

  function changeChatInfo() {
    setShowInviteFriendsWindow(!showInviteFriendsWindow);
  }

  return (
    <>
      <Button
        className={styles.inviteBtn}
        size="sm"
        onClick={() => setShowInviteFriendsWindow(!showInviteFriendsWindow)}
      >
        <IoPersonAddOutline
          size={27}
          className={styles.inviteIcon}
          color={"#FFFFFF"}
        />
      </Button>
      {showInviteFriendsWindow && <InviteFriendsWindow />}
    </>
  );
}

export default InviteFriendsButton;
