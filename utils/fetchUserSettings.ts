import { UserSettings } from "types/types";

async function fetcher(url: string) {
  const response = await fetch(url);
  const data = await response.json();
  const userSettings: UserSettings = data.userSettings;

  return userSettings;
}

export default fetcher;
