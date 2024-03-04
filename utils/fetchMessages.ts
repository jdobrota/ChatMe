import { Message } from "types/types";

async function fetcher(url: string) {
  if (url.endsWith("_")) return [];

  const response = await fetch(url);
  const data = await response.json();
  const messages: Message[] = data.messages;

  return messages;
}

export default fetcher;
