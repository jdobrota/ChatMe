import { User } from "types/types";

async function fetcher(url: string) {
  const response = await fetch(url);
  const data = await response.json();
  const users: User[] = data.users;

  return users;
}

export default fetcher;
