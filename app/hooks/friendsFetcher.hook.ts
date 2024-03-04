import { useSession } from "next-auth/react";
import useSWR, { KeyedMutator } from "swr";
import friendsFetcher from "utils/fetchUserFriends";
import { User as UserType } from "types/types";

type useFriendsFetcherType = {
  friends: UserType[] | undefined;
  friendsMutate: KeyedMutator<UserType[]>;
};

function useFriendsFetcher() {
  const { data: session } = useSession();

  const { data: friends, mutate: friendsMutate } = useSWR<UserType[]>(
    `api/chat/friends?user=${session?.user?.email!}`,
    friendsFetcher
  );

  return { friends, friendsMutate } as useFriendsFetcherType;
}

export default useFriendsFetcher;
