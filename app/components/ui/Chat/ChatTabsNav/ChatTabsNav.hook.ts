import chatsFetcher from "utils/fetchUserChats";
import { useSession } from "next-auth/react";
import { clientPusherChatTabs } from "_pusher";
import { Chat, Message, UserSettings } from "types/types";
import { useState, useEffect } from "react";
import useUserSettingsFetcher from "app/hooks/userSettingsFetcher.hook";
import useUserChatsFetcher from "app/hooks/userChatsFetcher.hook";

type useChatTabsNavType = {
  userChats: Chat[];
  userSettings: UserSettings;
  pendingClose: boolean;
  setPendingClose: (value: boolean) => void;
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
  dispatchNewSelectedChat: (chatid: string) => Promise<void>;
  onCloseChatTab: (chat: Chat) => Promise<void>;
};

function useChatTabsNav(initialChatId: string) {
  const [modalVisible, setModalVisible] = useState<boolean>();
  const [pendingClose, setPendingClose] = useState<boolean>(false);
  const { data: session } = useSession();

  const { userChats, userChatsMutate } = useUserChatsFetcher();

  const { userSettings, userSettingsMutate } = useUserSettingsFetcher();

  useEffect(() => {
    const pusherMessagesConnection = clientPusherChatTabs.subscribe("messages");
    const pusherInviteConnection = clientPusherChatTabs.subscribe("invites");

    pusherMessagesConnection.bind("new-message", function (data: Message) {
      if (!userChats) return;

      userChatsMutate(
        chatsFetcher(`api/chat/chats?user=${session?.user?.email!}`),
        {
          optimisticData: [
            ...userChats!.map((chat) =>
              chat.id === data.chatId
                ? { ...chat, unreadMessages: chat.unreadMessages! + 1 }
                : chat
            ),
          ],
        }
      );
    });

    pusherInviteConnection.bind("chat-invite", function (chat: Chat) {
      if (!userChats) return;

      if (userChats.some((userChat) => userChat.id.includes(chat.id))) return;

      userChatsMutate(
        chatsFetcher(`api/chat/chats?user=${session?.user?.email!}`),
        {
          optimisticData: [...userChats!, chat],
        }
      );
    });

    return () => {
      pusherMessagesConnection.unbind_all();
      pusherMessagesConnection.unsubscribe();
      pusherInviteConnection.unbind_all();
      pusherInviteConnection.unsubscribe();
    };
  }, [userSettings?.lastChatOpened!]);

  useEffect(() => {
    dispatchNewSelectedChat(initialChatId);
  }, [initialChatId]);

  async function deleteChatFromUserSettings(chat: Chat) {
    const data = await fetch(`api/chat/chats?user=${session?.user?.email!}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(chat),
    }).then((res) => res.json());

    return data.chats! ? [...data.chats!] : [];
  }

  async function onCloseChatTab(chat: Chat) {
    const optimistic = [
      ...userChats!.filter((chat) => chat.id !== userSettings?.lastChatOpened!),
    ];

    await userChatsMutate(deleteChatFromUserSettings(chat), {
      optimisticData: optimistic,
      rollbackOnError: true,
    });

    if (!optimistic.length) {
      dispatchNewSelectedChat("");
    }
  }

  async function postNewSelectedChat(chatid: string) {
    const data = await fetch(
      `api/chat/userSettings?user=${session?.user?.email!}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(chatid),
      }
    ).then((res) => res.json());

    return data.userSettings;
  }

  async function dispatchNewSelectedChat(chatid: string) {
    userSettingsMutate(postNewSelectedChat(chatid), {
      optimisticData: { ...userSettings!, lastChatOpened: chatid },
      rollbackOnError: true,
    });
  }

  return {
    userChats,
    userSettings,
    pendingClose,
    setPendingClose,
    modalVisible,
    setModalVisible,
    dispatchNewSelectedChat,
    onCloseChatTab,
  } as useChatTabsNavType;
}

export default useChatTabsNav;
