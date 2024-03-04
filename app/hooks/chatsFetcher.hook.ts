import chatFetcher from "utils/fetchChats";
import useSWR, { KeyedMutator } from "swr";
import { Chat } from "types/types";

type useChatsFetcherType = {
  chats: Chat[] | undefined;
  chatsMutate: KeyedMutator<Chat[]>;
};

function useChatsFetcher() {
  const { data: chats, mutate: chatsMutate } = useSWR<Chat[]>(
    "api/chat/chats",
    chatFetcher
  );

  return { chats, chatsMutate } as useChatsFetcherType;
}

export default useChatsFetcher;
