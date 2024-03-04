"use client";

import { useSession } from "next-auth/react";
import { User as UserType } from "types/types";
import usersFetcher from "utils/fetchUserFriends";
import { useState } from "react";
import useFriendsFetcher from "app/hooks/friendsFetcher.hook";
import useUsersFetcher from "app/hooks/usersFetcher.hooks";

type UseActiveFriendsListType = {
  friends: UserType[];
  users: UserType[];
  searchUserInput: string;
  setSearchUserInput: (value: string) => void;
  sendFriendRequest: (targetUser: UserType) => Promise<void>;
  acceptFriendRequest: (targetUser: UserType) => Promise<void>;
  declineFriendRequest: (targetUser: UserType) => Promise<void>;
  removeFriendAction: (targetUser: UserType) => Promise<void>;
};

export function useActiveFriendsList(): UseActiveFriendsListType {
  const [searchUserInput, setSearchUserInput] = useState<string>("");
  const { data: session } = useSession();

  const { friends, friendsMutate } = useFriendsFetcher();
  const { users, usersMutate } = useUsersFetcher();

  async function postFriendRequest(targetUser: string) {
    const data = await fetch(`api/chat/friends?user=${session?.user?.email!}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(targetUser),
    }).then((res) => res.json());

    return data.friends;
  }

  async function sendFriendRequest(targetUser: UserType) {
    await friendsMutate(await postFriendRequest(targetUser.email), {
      optimisticData: [{ ...targetUser, reqStatus: "sent" }, ...friends!],
      rollbackOnError: true,
    });
    await usersMutate(
      usersFetcher(`api/chat/users?user=${session?.user?.email!}`),
      {
        optimisticData: [
          ...users!.map((user) =>
            user === targetUser ? { ...user, reqStatus: "sent" } : user
          ),
        ],
        rollbackOnError: true,
      }
    );
  }

  async function patchAcceptFriendRequest(targetUser: string) {
    const data = await fetch(
      `api/chat/friends?user=${session?.user?.email!}&accept=true`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(targetUser),
      }
    ).then((res) => res.json());

    return data.friends;
  }

  async function acceptFriendRequest(targetUser: UserType) {
    await friendsMutate(await patchAcceptFriendRequest(targetUser.email), {
      optimisticData: [{ ...targetUser, reqStatus: "" }, ...friends!],
      rollbackOnError: true,
    });
  }

  async function patchDeclineFriendRequest(targetUser: string) {
    const data = await fetch(
      `api/chat/friends?user=${session?.user?.email!}&accept=false`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(targetUser),
      }
    ).then((res) => res.json());

    return data.friends;
  }

  async function declineFriendRequest(targetUser: UserType) {
    await friendsMutate(await patchDeclineFriendRequest(targetUser.email), {
      optimisticData: [
        ...friends!.filter((friend) => friend.email !== targetUser.email),
      ],
      rollbackOnError: true,
    });
  }

  async function deleteFriend(targetUser: string) {
    const data = await fetch(`api/chat/friends?user=${session?.user?.email!}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(targetUser),
    }).then((res) => res.json());

    return data.friends;
  }

  async function removeFriendAction(targetUser: UserType) {
    await friendsMutate(await deleteFriend(targetUser.email), {
      optimisticData: [
        ...friends!.filter((friend) => friend.email !== targetUser.email),
      ],
      rollbackOnError: true,
    });
  }

  return {
    friends,
    users,
    searchUserInput,
    setSearchUserInput,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriendAction,
  } as UseActiveFriendsListType;
}
