import { User as UserType } from "types/types";
import { useState } from "react";
import useFriendsFetcher from "app/hooks/friendsFetcher.hook";

type UseFriendsWindowType = {
  friends: UserType[];
  showFriends: boolean;
  setShowFriends: (value: boolean) => void;
};

function useFriendsWindow() {
  const [showFriends, setShowFriends] = useState<boolean>(false);

  const { friends } = useFriendsFetcher();

  return { friends, showFriends, setShowFriends } as UseFriendsWindowType;
}

export default useFriendsWindow;
