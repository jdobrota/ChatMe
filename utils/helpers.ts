import { UserSettings } from "types/types";

export function getStatusFromUserSettings(
  myUser: UserSettings,
  targetUser: UserSettings
) {
  const myUserSettingsStatus = myUser.friends.filter((my) =>
    my.includes(targetUser.id)
  )[0];

  const splitted = myUserSettingsStatus?.split(":");

  if (splitted?.length > 1) return splitted[1];
  else return "";
}
