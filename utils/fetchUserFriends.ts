import { User } from "types/types";

async function fetcher(url: string) {
  const response = await fetch(url);
  const data = await response.json();
  const friends: User[] = data.users;

  return friends;
}

export default fetcher;
