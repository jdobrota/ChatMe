import MyCard from "app/components/ui/Card/MyCard";
import React, { useState } from "react";
import styles from "./InviteFriendsWindow.module.css";
import { User, Button } from "@nextui-org/react";
import useInviteFriendsWindow from "./InviteFriendsWindow.hook";

function InviteFriendsWindow() {
  const { filteredFriends, inviteSent, setInviteSent, sendInviteRequest } =
    useInviteFriendsWindow();

  return (
    <MyCard cardStyle={styles.card}>
      <p>Invite friends to current chat</p>
      <ul>
        {filteredFriends?.length ? (
          filteredFriends?.map((user) => (
            <li key={user.email}>
              <Button
                disabled={inviteSent === user.email}
                className={`${styles.friendButton} ${
                  inviteSent === user.email && styles.friendInviteSent
                }`}
                onClick={async () => {
                  setInviteSent(user.email);
                  await sendInviteRequest(user);
                }}
              >
                <User
                  className={styles.user}
                  name={user?.name!}
                  description={user?.email!}
                  avatarProps={{
                    size: "sm",
                    src: user?.image!,
                    isBordered: true,
                    color: user.status === "online" ? "success" : "warning",
                  }}
                />
              </Button>
            </li>
          ))
        ) : (
          <p className={styles.noFriends}>... no friends to invite ...</p>
        )}
      </ul>
    </MyCard>
  );
}

export default InviteFriendsWindow;
