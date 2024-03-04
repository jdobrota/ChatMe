import useChatInfoFetcher from "app/hooks/chatInfoFetcher.hook";

function useChatInfo() {
  const { chatInfo } = useChatInfoFetcher();

  return { chatInfo };
}

export default useChatInfo;
