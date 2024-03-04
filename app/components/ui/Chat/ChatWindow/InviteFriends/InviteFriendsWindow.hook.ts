import { User as UserType } from "types/types";
import { useState } from "react";
import useChatInfoFetcher from "app/hooks/chatInfoFetcher.hook";
import useUserSettingsFetcher from "app/hooks/userSettingsFetcher.hook";
import useFriendsFetcher from "app/hooks/friendsFetcher.hook";

type InviteFriendsWindowType = {
  filteredFriends: UserType[] | undefined;
  inviteSent: string;
  setInviteSent: (sent: string) => void;
  sendInviteRequest: (user: UserType) => void;
};

function useInviteFriendsWindow() {
  const [inviteSent, setInviteSent] = useState<string>("");

  const { userSettings } = useUserSettingsFetcher();

  const { friends } = useFriendsFetcher();

  const { chatInfo } = useChatInfoFetcher();

  async function sendInviteRequest(user: UserType) {
    const res = await fetch(
      `api/chat/chatInvite?chat=${userSettings?.lastChatOpened!}&user=${
        user.email
      }`,
      {
        method: "POST",
        body: JSON.stringify(userSettings?.id),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const filteredFriends = friends?.filter(
    (friend) =>
      !chatInfo?.members.some((member) => member.email === friend.email)
  );

  return {
    filteredFriends,
    inviteSent,
    setInviteSent,
    sendInviteRequest,
  } as InviteFriendsWindowType;
}

export default useInviteFriendsWindow;
