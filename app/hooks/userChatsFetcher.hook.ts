import { useSession } from "next-auth/react";
import useSWR, { KeyedMutator } from "swr";
import { Chat } from "types/types";
import userChatsFetcher from "utils/fetchUserChats";

type useUserChatsFetcherType = {
  userChats: Chat[] | undefined;
  userChatsMutate: KeyedMutator<Chat[]>;
};

function useUserChatsFetcher() {
  const { data: session } = useSession();

  const { data: userChats, mutate: userChatsMutate } = useSWR<Chat[]>(
    `api/chat/chats?user=${session?.user?.email!}`,
    userChatsFetcher
  );

  return { userChats, userChatsMutate } as useUserChatsFetcherType;
}

export default useUserChatsFetcher;
