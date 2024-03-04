import { ChatInfoType } from "types/types";
import useSWR, { KeyedMutator } from "swr";
import chatInfoFetcher from "utils/fetchChatInfo";
import useUserSettingsFetcher from "./userSettingsFetcher.hook";

type useChatInfoFetcherType = {
  chatInfo: ChatInfoType;
  chatInfoMutate: KeyedMutator<ChatInfoType>;
};

function useChatInfoFetcher() {
  const { userSettings } = useUserSettingsFetcher();

  const { data: chatInfo, mutate: chatInfoMutate } = useSWR<ChatInfoType>(
    `api/chat/chatInfo?chat=${userSettings?.lastChatOpened!}`,
    chatInfoFetcher
  );

  return { chatInfo, chatInfoMutate } as useChatInfoFetcherType;
}

export default useChatInfoFetcher;
