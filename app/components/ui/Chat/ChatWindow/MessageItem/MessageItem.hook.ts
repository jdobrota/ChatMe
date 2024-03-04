import userChatsFetcher from "utils/fetchUserChats";
import { Message } from "types/types";
import { useSession } from "next-auth/react";
import { useState } from "react";
import useUserSettingsFetcher from "app/hooks/userSettingsFetcher.hook";
import useUserChatsFetcher from "app/hooks/userChatsFetcher.hook";
import useMessagesFetcher from "app/hooks/messagesFetcher.hook";

type useMessageItemType = {
  mine: boolean;
  seen: boolean;
  showDetails: boolean;
  setShowDetails: (value: boolean) => void;
  doNotSendSeenRequest: boolean;
  setMessageAsSeen: () => Promise<void>;
};

function useMessageItem(message: Message) {
  const { data: session } = useSession();

  const { userSettings } = useUserSettingsFetcher();

  const { messages, messagesMutate } = useMessagesFetcher();

  const { userChats, userChatsMutate } = useUserChatsFetcher();

  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [doNotSendSeenRequest, setDoNotSendSeenRequest] =
    useState<boolean>(false);

  const mine = message?.email === session?.user?.email!;
  const seen: boolean = message?.seenBy.filter(
    (image) => image === session?.user?.image
  ).length
    ? true
    : false;

  async function sendUpdateRequest(messageToUpdate: Message) {
    const data = await fetch(
      `api/chat/messages/messages_${userSettings?.lastChatOpened!}?user=${session
        ?.user?.email!}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageToUpdate),
      }
    ).then((res) => {
      if (!res.ok) {
        setDoNotSendSeenRequest(false);
      }
      return res.json();
    });

    const returnMsg = [
      ...messages!.map((msg) =>
        msg.id === data.messages.id
          ? { ...msg, seenBy: [...msg.seenBy, session?.user?.image!] }
          : msg
      ),
    ] as Message[];

    return returnMsg;
  }

  async function setMessageAsSeen() {
    setDoNotSendSeenRequest(true);
    if (!message.seenBy?.includes(session?.user?.image!)) {
      await messagesMutate(sendUpdateRequest(message), {
        optimisticData: [
          ...messages!.map((msg) =>
            msg.id === message.id
              ? ({
                  ...msg,
                  seenBy: [...msg.seenBy, session?.user?.image!],
                } as Message)
              : msg
          ),
        ],
        rollbackOnError: true,
      });
      await userChatsMutate(
        userChatsFetcher(`api/chat/chats?user=${session?.user?.email!}`),
        {
          optimisticData: [
            ...userChats!.map((chat) =>
              chat.id === userSettings?.lastChatOpened!
                ? { ...chat, unreadMessages: chat.unreadMessages! - 1 }
                : chat
            ),
          ],
        }
      );
    }
  }

  return {
    mine,
    seen,
    showDetails,
    setShowDetails,
    doNotSendSeenRequest,
    setMessageAsSeen,
  } as useMessageItemType;
}

export default useMessageItem;
