"use client";

import { Button, Badge } from "@nextui-org/react";
import { FaUserFriends } from "react-icons/fa";
import styles from "./FriendsWindow.module.css";
import ActiveFriendsList from "./ActiveFriendsList/ActiveFriendsList";
import useFriendsWindow from "./FriendsWindow.hook";
import MyCard from "../../Card/MyCard";

function FriendsWindow() {
  const { friends, showFriends, setShowFriends } = useFriendsWindow();

  return (
    <MyCard
      cardStyle={styles.card}
      providerStyle={showFriends ? styles.provider : ""}
    >
      <div className={styles.column}>
        <Button
          onClick={() => setShowFriends(!showFriends)}
          className={styles.button}
          color="primary"
        >
          <Badge
            content={
              friends?.filter((friend) => friend.reqStatus === "recv").length
            }
            color="warning"
            placement="top-right"
            size="sm"
            isInvisible={
              friends?.filter((friend) => friend.reqStatus === "recv").length
                ? false
                : true
            }
          >
            <FaUserFriends size={18} />
          </Badge>
        </Button>

        {showFriends && <ActiveFriendsList />}
      </div>
    </MyCard>
  );
}

export default FriendsWindow;
