import useUserChatsFetcher from "app/hooks/userChatsFetcher.hook";
import useUserSettingsFetcher from "app/hooks/userSettingsFetcher.hook";
import { useSession } from "next-auth/react";
import { Chat } from "types/types";
import userChatsFetcher from "utils/fetchUserChats";

type useChatInvitationType = {
  resolveChatInviteRequest: (value: boolean) => void;
};

function useChatInvitation(chat: Chat) {
  const { data: session } = useSession();

  const { userChats, userChatsMutate } = useUserChatsFetcher();

  const { userSettings, userSettingsMutate } = useUserSettingsFetcher();

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

  async function resolveChatInviteRequest(accept: boolean) {
    const res = await fetch(
      `api/chat/chatInvite?chat=${chat.id}&user=${session?.user?.email}&accept=${accept}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    await userChatsMutate(
      await userChatsFetcher(`api/chat/chats?user=${session?.user?.email!}`),
      {
        optimisticData: accept
          ? [
              ...userChats?.map((userChat) =>
                userChat.id === chat.id
                  ? ({
                      ...userChat,
                      invite: false,
                      inviteFromUser: undefined,
                    } as Chat)
                  : userChat
              )!,
            ]
          : [...userChats?.filter((userChat) => userChat.id !== chat.id)!],
      }
    );

    if (accept) dispatchNewSelectedChat(chat.id);
  }

  return { resolveChatInviteRequest } as useChatInvitationType;
}

export default useChatInvitation;
