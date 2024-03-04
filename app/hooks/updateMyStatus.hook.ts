import { useEffect, useRef } from "react";
import useUserSettingsFetcher from "./userSettingsFetcher.hook";
import userSettingsFetcher from "utils/fetchUserSettings";

function useUpdateMyStatus() {
  const { userSettings, userSettingsMutate } = useUserSettingsFetcher();
  const canSendRequest = useRef<boolean>(true);

  async function setOnlineStatus() {
    if (
      userSettings?.status !== "online" &&
      userSettings?.id &&
      canSendRequest.current
    ) {
      canSendRequest.current = false;
      await fetch(
        `api/chat/userStatus?user=${userSettings?.id}&status=online`,
        { method: "PATCH" }
      );
      await userSettingsMutate(
        await userSettingsFetcher(
          `api/chat/userSettings?user=${userSettings.id}`
        ),
        {
          optimisticData: { ...userSettings!, status: "online" },
          rollbackOnError: true,
        }
      ).then(() => {
        canSendRequest.current = true;
      });
    }
  }

  async function setOfflineStatus() {
    if (
      userSettings?.status !== "offline" &&
      userSettings?.id &&
      canSendRequest.current
    ) {
      canSendRequest.current = false;
      await fetch(
        `api/chat/userStatus?user=${userSettings?.id}&status=offline`,
        {
          method: "PATCH",
        }
      );
      await userSettingsMutate(
        await userSettingsFetcher(
          `api/chat/userSettings?user=${userSettings?.id}`
        ).then((userSettings) => {
          canSendRequest.current = true;
          return userSettings;
        }),
        {
          optimisticData: { ...userSettings!, status: "offline" },
          rollbackOnError: true,
        }
      );
    }
  }

  useEffect(() => {
    window.addEventListener("mousemove", setOnlineStatus);
    window.addEventListener("beforeunload", setOfflineStatus);

    return () => {
      window.removeEventListener("mousemove", setOnlineStatus);
      window.removeEventListener("beforeunload", setOfflineStatus);
    };
  }, [userSettings]);
}

export default useUpdateMyStatus;
