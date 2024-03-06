import React from "react";
import { User, Button } from "@nextui-org/react";
import styles from "./FriendsUser.module.css";
import { User as UserType } from "types/types";
import { IoPersonAddOutline } from "react-icons/io5";
import { TiTickOutline } from "react-icons/ti";
import { TiTimesOutline } from "react-icons/ti";
import FriendsUserCardOptions from "../FriendUserCard/FriendUserCardOptions/FriendsUserCardOptions";
import MyCard from "app/components/ui/Card/MyCard";

function FriendsUser({
  user,
  searching,
  alreadyFriend,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriendAction,
}: {
  user: UserType;
  searching: boolean;
  alreadyFriend: boolean;
  sendFriendRequest: (targetUser: UserType) => void;
  acceptFriendRequest: (targetUser: UserType) => void;
  declineFriendRequest: (targetUser: UserType) => void;
  removeFriendAction: (targetUser: UserType) => void;
}) {
  return (
    <li key={user.email}>
      <MyCard
        cardStyle={styles.cardStyle}
        bodyStyle={styles.bodyStyle}
        shadow={false}
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
            classNames: { base: styles.avatar },
          }}
        />

        {searching && !user.reqStatus && (
          <>
            {alreadyFriend ? (
              <TiTickOutline size={20} color={"#18C964"} />
            ) : (
              <Button
                isIconOnly
                color="success"
                aria-label="add"
                size="sm"
                className={styles.addButton}
                onClick={() => sendFriendRequest(user)}
              >
                <IoPersonAddOutline size={15} />
              </Button>
            )}
          </>
        )}
        {!searching && user.reqStatus === "recv" && (
          <span className={styles.span}>
            <Button
              isIconOnly
              color="success"
              aria-label="confirm"
              size="sm"
              className={styles.addButton}
              onClick={() => acceptFriendRequest(user)}
            >
              <TiTickOutline size={18} />
            </Button>
            <Button
              isIconOnly
              color="danger"
              aria-label="decline"
              size="sm"
              className={styles.addButton}
              onClick={() => declineFriendRequest(user)}
            >
              <TiTimesOutline size={18} />
            </Button>
          </span>
        )}
        {alreadyFriend && !searching && !user.reqStatus && (
          <FriendsUserCardOptions
            removeFriendAction={() => removeFriendAction(user)}
          />
        )}
      </MyCard>
    </li>
  );
}

export default FriendsUser;
