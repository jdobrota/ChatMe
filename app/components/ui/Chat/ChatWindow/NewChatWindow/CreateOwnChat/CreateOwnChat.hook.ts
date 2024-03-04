import React, { useState } from "react";
import { Chat } from "types/types";
import { v4 as uuidv4 } from "uuid";
import { useSession } from "next-auth/react";
import useUserChatsFetcher from "app/hooks/userChatsFetcher.hook";

type useCreateOwnChatType = {
  userInput: string;
  onChangeSearchInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isPrivate: boolean;
  setIsPrivate: (value: boolean) => void;
  onCreateChat: (e: React.FormEvent<HTMLFormElement>) => void;
};

function useCreateOwnChat() {
  const { data: session } = useSession();
  const [userInput, setUserInput] = useState<string>("");
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const { userChats, userChatsMutate } = useUserChatsFetcher();

  function onChangeSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
    setUserInput(e.target.value);
  }

  async function uploadChatToUpstashAndSubscribe(chatToCreate: Chat) {
    const data = await fetch(`api/chat/chats?user=${session?.user?.email!}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(chatToCreate),
    }).then((res) => res.json());

    if (!data.chats) return [...userChats!, chatToCreate];

    return [...userChats!, data.chats];
  }

  async function onCreateChat(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!userInput.length) return;

    const chatToCreate: Chat = {
      id: uuidv4(),
      name: userInput,
      private: isPrivate,
      created: Date.now(),
      invite: false,
      inviteFromUser: undefined,
    };

    setUserInput("");
    setIsPrivate(false);

    await userChatsMutate(uploadChatToUpstashAndSubscribe(chatToCreate), {
      optimisticData: [...userChats!, chatToCreate],
      rollbackOnError: true,
    });
  }

  return {
    userInput,
    onChangeSearchInput,
    isPrivate,
    setIsPrivate,
    onCreateChat,
  } as useCreateOwnChatType;
}

export default useCreateOwnChat;
