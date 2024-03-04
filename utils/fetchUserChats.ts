import { Chat } from "types/types";

async function fetcher(url: string) {
  const response = await fetch(url);
  const data = await response.json();
  const chats: Chat[] = data.chats;

  return chats;
}

export default fetcher;
