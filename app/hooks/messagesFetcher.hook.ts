import useSWR, { KeyedMutator } from "swr";
import { Message } from "types/types";
import messageFetcher from "utils/fetchMessages";
import useUserSettingsFetcher from "./userSettingsFetcher.hook";

type useMessagesFetcherType = {
  messages: Message[] | undefined;
  messagesMutate: KeyedMutator<Message[]>;
};

function useMessagesFetcher() {
  const { userSettings } = useUserSettingsFetcher();

  const { data: messages, mutate: messagesMutate } = useSWR<Message[]>(
    `api/chat/messages/messages_${userSettings?.lastChatOpened!}`,
    messageFetcher
  );

  return { messages, messagesMutate } as useMessagesFetcherType;
}

export default useMessagesFetcher;
