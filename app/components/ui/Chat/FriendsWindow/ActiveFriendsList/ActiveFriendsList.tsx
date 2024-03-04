"use client";

import React from "react";
import { Divider } from "@nextui-org/react";
import FriendsSearch from "../FriendsSearch/FriendsSearch";
import FriendsUser from "../FriendsUser/FriendsUser";
import styles from "./ActiveFriendsList.module.css";
import { useActiveFriendsList } from "./ActiveFriendsList.hook";

function ActiveFriendsList() {
  const {
    friends,
    users,
    searchUserInput,
    setSearchUserInput,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriendAction,
  } = useActiveFriendsList();

  return (
    <>
      <FriendsSearch
        searchUserInput={searchUserInput}
        setSearchUserInput={setSearchUserInput}
      />
      <Divider orientation="horizontal" />
      {searchUserInput ? (
        <p className={styles.centerText}>Search result</p>
      ) : (
        <p className={styles.centerText}>Your friends</p>
      )}
      <Divider orientation="horizontal" />
      <ul className={`${styles.friendList} ${styles.scroll}`}>
        {searchUserInput
          ? users
              ?.filter(
                (user) =>
                  user?.email?.includes(searchUserInput.toLowerCase()) ||
                  user?.name
                    ?.toLowerCase()
                    .includes(searchUserInput.toLowerCase())
              )
              .map((user) => (
                <FriendsUser
                  user={user}
                  key={user?.email!}
                  searching={true}
                  alreadyFriend={
                    friends?.some(
                      (friend) => friend.email === user.email
                    ) as boolean
                  }
                  sendFriendRequest={sendFriendRequest}
                  acceptFriendRequest={acceptFriendRequest}
                  declineFriendRequest={declineFriendRequest}
                  removeFriendAction={removeFriendAction}
                />
              ))
          : friends?.map((friend) => (
              <FriendsUser
                user={friend}
                key={friend?.email!}
                searching={false}
                alreadyFriend={true}
                sendFriendRequest={sendFriendRequest}
                acceptFriendRequest={acceptFriendRequest}
                declineFriendRequest={declineFriendRequest}
                removeFriendAction={removeFriendAction}
              />
            ))}
      </ul>
    </>
  );
}

export default ActiveFriendsList;
