import {
  Chat,
  ChatInfoType,
  Emoji,
  Message,
  User,
  UserSettings,
} from "types/types";
import { DefaultUser, Session } from "next-auth";
import redis from "_redis";
import { getStatusFromUserSettings } from "./helpers";

export async function prepareUi(session: Session) {
  //  get initial user settings
  let userSettingsDB = await getUserSettings(session?.user?.email!);
  const emojis = await getEmojis();

  if (!userSettingsDB) {
    //  Create UserSettings for user in DB
    const response = await createEmptyUserSettings({
      id: session?.user?.email!,
      ...session?.user!,
    } as DefaultUser);

    //  update local user settings
    if (response) userSettingsDB = await getUserSettings(session?.user?.email!);
  }

  if (!emojis.length) {
    await fetchAndStoreEmojis();
  }

  //  get sorted user chats for UI
  const chats = await getSortedUserChats(userSettingsDB);

  //  get sorted last opened messages
  const messages = await getSortedLastOpenedMessages(chats, userSettingsDB);

  return [messages, chats, userSettingsDB.lastChatOpened, emojis];
}

export async function getSortedChats() {
  const chatsRes = (await redis.hvals("chats")) as Chat[];

  return Object.values(chatsRes).sort((a, b) => a.created - b.created);
}

export async function updateSeenMessages(
  user: string,
  chat_id: string,
  message_id: string
) {
  const message = (await redis.hget(
    String(chat_id),
    String(message_id)
  )) as Message;

  const userSettingsDB = await getUserSettings(user);

  if (!message.seenBy.includes(userSettingsDB.profilePic)) {
    const response = await redis.hset(String(chat_id), {
      [message_id]: JSON.stringify({
        ...message,
        seenBy: [...message.seenBy, userSettingsDB.profilePic],
      }),
    });

    return {
      ...message,
      seenBy: [...message.seenBy, userSettingsDB.profilePic],
    } as Message;
  }
}

export async function getSortedLastOpenedMessages(
  chats: Chat[],
  userSettings: UserSettings
) {
  const messagesRes = (await redis.hvals(
    `messages_${chats.filter(
      (chat) => chat.id === userSettings.lastChatOpened
    )}`
  )) as Message[];

  return Object.values(messagesRes).sort((a, b) => b.timeStamp - a.timeStamp);
}

async function getUnreadMessagesForUserChat(
  userSettings: UserSettings,
  chatId: string
) {
  const allChatMessages = (await redis.hvals(
    `messages_${chatId}`
  )) as Message[]; // get messages from selected chat;

  return allChatMessages.filter(
    (chat) => !chat.seenBy.includes(userSettings.profilePic)
  ).length; // return number of unseen messages in chat
}

export async function getUnreadMessagesForUser(userSettings: UserSettings) {
  let unreadMessages = {} as Record<string, number>;

  for (const chat of userSettings.chats) {
    unreadMessages = {
      ...unreadMessages,
      [chat]: await getUnreadMessagesForUserChat(userSettings, chat),
    };
  }

  return unreadMessages;
}

export async function getSortedUserChats(userSettings: UserSettings) {
  const chatsRes = (await redis.hvals("chats")) as Chat[];

  const unread = await getUnreadMessagesForUser(userSettings);

  const allUsers = await getAllUsers(userSettings.id);

  const userChats = chatsRes
    .filter((chat) =>
      userSettings.chats.some((userChat) => userChat.includes(chat.id))
    )
    .sort((a, b) => a.created - b.created)
    .map((userChat) => {
      const invite = userSettings.chats.some((chat) =>
        chat.includes(userChat.id + ":")
      );
      let inviteFromUser: User | undefined = undefined;
      if (invite) {
        const chatInviteString = userSettings.chats
          .filter((chat) => chat.includes(userChat.id + ":"))[0]
          .split(":");
        inviteFromUser = allUsers.filter(
          (user) => user.email === chatInviteString[1]
        )[0];
      }

      return {
        ...userChat,
        unreadMessages: unread[userChat.id],
        invite: invite,
        inviteFromUser: inviteFromUser,
      } as Chat;
    });

  return userChats;
}

export async function createEmptyUserSettings(user: DefaultUser) {
  return await redis.hset("userSettings", {
    [user.id]: JSON.stringify({
      id: user.id,
      name: user.name,
      profilePic: user.image,
      friends: [] as string[],
      chats: [] as string[],
      status: "offline",
      lastChatOpened: "" as string,
    } as UserSettings),
  });
}

export async function updateLastChatOpened(user: string, chatId: string) {
  const userSettingsDB = await getUserSettings(user);

  const optimisticUserSettings = {
    ...userSettingsDB,
    lastChatOpened: chatId,
  } as UserSettings;

  const resp = await redis.hset("userSettings", {
    [user]: JSON.stringify(optimisticUserSettings),
  });

  return optimisticUserSettings;
}

export async function getEmojis(): Promise<Record<string, Emoji[]>> {
  const emojis = (await redis.hget("emojis", "emojis")) as Emoji[]; // get emojis;

  const groupedEmojis: Record<string, Emoji[]> = {};

  emojis?.forEach((item) => {
    if (!groupedEmojis[item.group]) {
      groupedEmojis[item.group] = []; // Initialize the array if it doesn't exist
    }
    groupedEmojis[item.group].push(item);
  });

  return groupedEmojis;
}

export async function getUserSettings(user: string) {
  return (await redis.hget("userSettings", String(user))) as UserSettings; // get user settings;
}

export async function getAllUserSettings() {
  return (await redis.hvals("userSettings")) as UserSettings[];
}

export async function subscribeToChat(user: string, chatId: string) {
  let userSettingsDB = await getUserSettings(user);

  // add chat to the user settings
  return await redis.hset("userSettings", {
    [String(user)]: JSON.stringify({
      ...userSettingsDB,
      chats: [...userSettingsDB.chats, chatId],
    }),
  });
}

export async function unsubscribeFromChat(user: string, chatId: string) {
  const userSettingsDB = await getUserSettings(user);

  const newChats = [
    ...userSettingsDB.chats.filter((chat) => !chat.includes(chatId)),
  ];

  const kv = {
    [user]: JSON.stringify({
      ...userSettingsDB,
      chats: newChats,
      lastChatOpened: newChats[0] || "",
    }),
  };

  // delete chat from user settings
  const response = await redis.hset("userSettings", kv);
}

export async function getAllSortedMessagesFromChat(chatId: string) {
  const messagesRes = (await redis.hvals(chatId)) as Message[];

  return Object.values(messagesRes).sort((a, b) => b.timeStamp - a.timeStamp);
}

export async function getFriendsForUser(user: string) {
  const allUsers = await getAllUserSettings();

  const myUser = allUsers.filter((userSettings) => userSettings.id === user)[0];

  const filteredUsers = allUsers.filter(
    (userSettings) =>
      myUser.friends.includes(userSettings.id) ||
      myUser.friends.includes(userSettings.id + ":sent") ||
      myUser.friends.includes(userSettings.id + ":recv")
  );

  const returnUsers = filteredUsers.map((filtered) => {
    return {
      name: filtered.name,
      email: filtered.id,
      image: filtered.profilePic,
      status: filtered.status,
      reqStatus: getStatusFromUserSettings(myUser, filtered),
    } as User;
  });

  return returnUsers;
}

export async function getAllUsers(user: string) {
  const allUsers = await getAllUserSettings();

  const myUser = allUsers.filter((userSettings) => userSettings.id === user)[0];

  const returnUsers = await (
    await (
      await getAllUserSettings()
    ).filter((userSettings) => userSettings.id !== myUser.id)
  ).map((userSetting) => {
    return {
      name: userSetting.name,
      email: userSetting.id,
      image: userSetting.profilePic,
      status: userSetting.status,
      reqStatus: getStatusFromUserSettings(myUser, userSetting),
    } as User;
  });

  return returnUsers;
}

async function dealWithFriendship(
  targetSetting: UserSettings,
  userSetting: UserSettings,
  accept: string
) {
  await redis.hset("userSettings", {
    [targetSetting.id]: JSON.stringify({
      ...targetSetting,
      friends:
        accept === "true"
          ? targetSetting.friends.map((friend) =>
              friend.includes(userSetting.id) ? userSetting.id : friend
            )
          : targetSetting.friends.filter(
              (friend) => !friend.includes(userSetting.id)
            ),
    } as UserSettings),
  });

  await redis.hset("userSettings", {
    [userSetting.id]: JSON.stringify({
      ...userSetting,
      friends:
        accept === "true"
          ? userSetting.friends.map((friend) =>
              friend.includes(targetSetting.id) ? targetSetting.id : friend
            )
          : userSetting.friends.filter(
              (friend) => !friend.includes(targetSetting.id)
            ),
    } as UserSettings),
  });

  return;
}

export async function handleFriendRequest(
  targetUser: string,
  user: string,
  accept?: string
) {
  const targetSetting = await getUserSettings(targetUser);
  const userSetting = await getUserSettings(user);

  if (accept) {
    await dealWithFriendship(targetSetting, userSetting, accept);
    return;
  }

  if (
    targetSetting.friends.includes(user + ":sent") ||
    targetSetting.friends.includes(user + ":recv") ||
    userSetting.friends.includes(targetUser + ":sent") ||
    userSetting.friends.includes(targetUser + ":recv")
  )
    return;

  await redis.hset("userSettings", {
    [targetSetting.id]: JSON.stringify({
      ...targetSetting,
      friends: targetSetting.friends.includes(user)
        ? targetSetting.friends.map((friend) =>
            friend === user ? friend + ":recv" : friend
          )
        : [...targetSetting.friends, user + ":recv"],
    } as UserSettings),
  });

  await redis.hset("userSettings", {
    [userSetting.id]: JSON.stringify({
      ...userSetting,
      friends: userSetting.friends.includes(targetUser)
        ? userSetting.friends.map((friend) =>
            friend === targetUser ? friend + ":sent" : friend
          )
        : [...userSetting.friends, targetUser + ":sent"],
    } as UserSettings),
  });
}

export async function deleteFriendFromUserSettings(
  targetUser: string,
  user: string
) {
  const targetSetting = await getUserSettings(targetUser);
  const userSetting = await getUserSettings(user);

  await redis.hset("userSettings", {
    [targetSetting.id]: JSON.stringify({
      ...targetSetting,
      friends: targetSetting.friends.filter((friend) => friend !== user),
    } as UserSettings),
  });

  await redis.hset("userSettings", {
    [userSetting.id]: JSON.stringify({
      ...userSetting,
      friends: userSetting.friends.filter((friend) => friend !== targetUser),
    } as UserSettings),
  });
}

export async function getChatInfo(chatId: string): Promise<ChatInfoType> {
  const allUserSettings = await getAllUserSettings();
  const allChats = await getSortedChats();

  const chat = allChats.filter((chat) => chat.id === chatId)[0];
  const members = allUserSettings.filter((user) => user.chats.includes(chatId));

  return {
    name: chat?.name,
    created: chat?.created,
    private: chat?.private,
    members: members?.map((member) => {
      return {
        name: member.name,
        email: member.id,
        image: member.profilePic,
        status: member.status,
        reqStatus: "",
      } as User;
    }),
  } as ChatInfoType;
}

export async function inviteUserToChat(
  invitedUser: string,
  chatId: string,
  fromUser: string
) {
  const targetSetting = await getUserSettings(invitedUser);

  if (targetSetting.chats.filter((chat) => chat.includes(chatId + ":")).length)
    return;

  await redis.hset("userSettings", {
    [targetSetting.id]: JSON.stringify({
      ...targetSetting,
      chats: [...targetSetting.chats, chatId + ":" + fromUser],
    } as UserSettings),
  });
}

export async function acceptChatInvite(invitedUser: string, chatId: string) {
  await unsubscribeFromChat(invitedUser, chatId);
  await subscribeToChat(invitedUser, chatId);
}

export async function declineChatInvite(invitedUser: string, chatId: string) {
  await unsubscribeFromChat(invitedUser, chatId);
}

export async function fetchAndStoreEmojis() {
  const data = await fetch(process.env.EMOJI_URL!);
  const emojis = (await data.json()) as Emoji[];

  return await redis.hset("emojis", {
    ["emojis"]: JSON.stringify(emojis),
  });
}

export async function setUserStatus(user: string, status: string) {
  let userSettingsDB = await getUserSettings(user);

  return await redis.hset("userSettings", {
    [String(user)]: JSON.stringify({
      ...userSettingsDB,
      status: status,
    }),
  });
}
