import { Chat } from "types/types";

async function fetcher() {
  const response = await fetch("api/chat/chats");
  const data = await response.json();
  const chats: Chat[] = data.chats;

  return chats;
}

export default fetcher;
