import React, { useState } from "react";
import { Chat } from "types/types";
import { useSession } from "next-auth/react";
import useUserChatsFetcher from "app/hooks/userChatsFetcher.hook";
import useChatsFetcher from "app/hooks/chatsFetcher.hook";

type useJoinExistingChatType = {
  searchUserInput: string;
  onChangeSearchInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  joinChatPending: boolean;
  setJoinChatPending: (value: boolean) => void;
  userChats: Chat[];
  chats: Chat[];
  onChatClick: (chatToSubscribe: Chat) => Promise<void>;
};

function useJoinExistingChat() {
  const { data: session } = useSession();
  const [searchUserInput, setSearchUserInput] = useState<string>("");
  const [joinChatPending, setJoinChatPending] = useState<boolean>(false);

  const { chats } = useChatsFetcher();
  const { userChats, userChatsMutate } = useUserChatsFetcher();

  function onChangeSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchUserInput(e.target.value);
  }

  async function sendRequestSubscribe(chatToSubscribe: Chat) {
    const data = await fetch(
      `api/chat/chats?user=${session?.user?.email!}&subscibeonly=true`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(chatToSubscribe),
      }
    ).then((res) => res.json());

    if (!data.chats)
      return [...userChats!, chatToSubscribe].sort(
        (a, b) => a.created - b.created
      );

    return [...userChats!, data.chats].sort((a, b) => a.created - b.created);
  }

  async function onChatClick(chatToSubscribe: Chat) {
    await userChatsMutate(sendRequestSubscribe(chatToSubscribe), {
      optimisticData: [...userChats!, chatToSubscribe].sort(
        (a, b) => a.created - b.created
      ),
      rollbackOnError: true,
    });
  }

  return {
    searchUserInput,
    onChangeSearchInput,
    joinChatPending,
    setJoinChatPending,
    userChats,
    chats,
    onChatClick,
  } as useJoinExistingChatType;
}

export default useJoinExistingChat;
