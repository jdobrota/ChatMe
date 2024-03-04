import { UserSettings } from "types/types";
import useSWR, { KeyedMutator } from "swr";
import { useSession } from "next-auth/react";
import userSettingsFetcher from "utils/fetchUserSettings";

type useUserSettingsFetcherType = {
  userSettings: UserSettings | undefined;
  userSettingsMutate: KeyedMutator<UserSettings>;
};

function useUserSettingsFetcher() {
  const { data: session } = useSession();

  const { data: userSettings, mutate: userSettingsMutate } =
    useSWR<UserSettings>(
      `api/chat/userSettings?user=${session?.user?.email!}`,
      userSettingsFetcher
    );

  return { userSettings, userSettingsMutate } as useUserSettingsFetcherType;
}

export default useUserSettingsFetcher;
