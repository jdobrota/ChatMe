import messagesFetcher from "utils/fetchMessages";
import { Chat, Message } from "types/types";
import { useEffect } from "react";
import { clientPusherChatWindow } from "_pusher";
import useUserSettingsFetcher from "app/hooks/userSettingsFetcher.hook";
import useUserChatsFetcher from "app/hooks/userChatsFetcher.hook";
import useMessagesFetcher from "app/hooks/messagesFetcher.hook";

type useChatWindowType = {
  messages: Message[];
  chat: Chat;
};

function useChatWindow() {
  const { userSettings } = useUserSettingsFetcher();

  const { messages, messagesMutate } = useMessagesFetcher();

  const { userChats } = useUserChatsFetcher();

  useEffect(() => {
    const pusherConnection = clientPusherChatWindow.subscribe("messages");

    pusherConnection.bind("new-message", async (data: Message) => {
      if (messages?.find((msg) => msg.id === data.id)) return;

      if (data.chatId !== userSettings?.lastChatOpened!) return;

      if (!messages) {
        messagesMutate(
          messagesFetcher(
            `api/chat/messages/messages_${userSettings?.lastChatOpened!}`
          )
        );
      } else {
        messagesMutate(
          messagesFetcher(
            `api/chat/messages/messages_${userSettings?.lastChatOpened!}`
          ),
          {
            optimisticData: [data, ...messages!],
            rollbackOnError: true,
          }
        );
      }
    });

    return () => {
      pusherConnection.unbind_all();
      pusherConnection.unsubscribe();
    };
  }, [
    messages,
    clientPusherChatWindow,
    messagesMutate,
    userSettings?.lastChatOpened!,
  ]);

  return {
    messages,
    chat: userChats?.filter(
      (chat) => chat.id === userSettings?.lastChatOpened!
    )[0],
  } as useChatWindowType;
}

export default useChatWindow;
