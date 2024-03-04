import { useSession } from "next-auth/react";
import useSWR, { KeyedMutator } from "swr";
import { User as UserType } from "types/types";
import usersFetcher from "utils/fetchUserFriends";

type useUsersFetcherType = {
  users: UserType[] | undefined;
  usersMutate: KeyedMutator<UserType[]>;
};

function useUsersFetcher() {
  const { data: session } = useSession();
  const { data: users, mutate: usersMutate } = useSWR<UserType[]>(
    `api/chat/users?user=${session?.user?.email!}`,
    usersFetcher
  );

  return { users, usersMutate } as useUsersFetcherType;
}

export default useUsersFetcher;
