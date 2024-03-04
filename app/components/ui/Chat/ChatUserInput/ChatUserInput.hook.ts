import { v4 as uuidv4 } from "uuid";
import { Emoji, Message } from "types/types";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { FormEvent } from "react";
import useUserSettingsFetcher from "app/hooks/userSettingsFetcher.hook";
import useMessagesFetcher from "app/hooks/messagesFetcher.hook";

type useChatUserInputType = {
  userInput: string;
  addEmoji: (emoji: string) => void;
  onChangeUserInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  status: string;
  disabled: boolean;
  toggleEmojiPicker: boolean;
  setToggleEmojiPicker: (toggle: boolean) => void;
};

function useChatUserInput() {
  const [userInput, setUserInput] = useState<string>("");
  const [toggleEmojiPicker, setToggleEmojiPicker] = useState<boolean>(false);
  const { data: session, status } = useSession();

  const { userSettings } = useUserSettingsFetcher();

  const { messages, messagesMutate } = useMessagesFetcher();

  async function uploadMessageToUpstash(messageToSend: Message) {
    const data = await fetch(
      `api/chat/messages/messages_${userSettings?.lastChatOpened!}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageToSend),
      }
    ).then((res) => res.json());

    if (!data.message) return [messageToSend, ...messages!];

    return [data.message, ...messages!];
  }

  function onKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  }

  async function onSendMessage(e?: FormEvent<HTMLFormElement>) {
    e?.preventDefault();

    if (!userInput.length) return;

    const messageToSend = {
      id: uuidv4(),
      chatId: userSettings?.lastChatOpened!,
      from: session?.user?.name!,
      email: session?.user?.email!,
      message: userInput,
      timeStamp: Date.now(),
      profilePic: session?.user?.image!,
      seenBy: [session?.user?.image!],
      pending: true,
    };

    setUserInput("");

    await messagesMutate(uploadMessageToUpstash(messageToSend), {
      optimisticData: [messageToSend, ...messages!],
      rollbackOnError: true,
    });
  }

  function addEmoji(emoji: string) {
    setUserInput((prev) => prev + emoji);
  }

  function onChangeUserInput(e: React.ChangeEvent<HTMLInputElement>) {
    setUserInput(e.target.value);
  }

  return {
    userInput,
    addEmoji,
    onChangeUserInput,
    onSendMessage,
    onKeyPress,
    status,
    disabled: userSettings?.lastChatOpened === "" ? true : false,
    toggleEmojiPicker,
    setToggleEmojiPicker,
  } as useChatUserInputType;
}

export default useChatUserInput;
