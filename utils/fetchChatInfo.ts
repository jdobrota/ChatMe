import { ChatInfoType } from "types/types";

async function fetcher(url: string) {
  const response = await fetch(url);
  const data = await response.json();
  const chatInfo: ChatInfoType = data.chatInfo;

  return chatInfo;
}

export default fetcher;
