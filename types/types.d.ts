export type Message = {
  id: string;
  chatId: string;
  from: string;
  email: string;
  message: string;
  timeStamp: number;
  profilePic: string;
  seenBy: string[];
  pending: boolean;
};

export type Chat = {
  id: string;
  name: string;
  private: boolean;
  created: number;
  unreadMessages?: number;
  invite: boolean = false;
  inviteFromUser: User | undefined = undefined;
};

export type UserSettings = {
  id: string;
  name: string;
  profilePic: string;
  friends: string[];
  chats: string[];
  status: string;
  lastChatOpened: string;
};

export type User = {
  name: string;
  email: string;
  image: string;
  status: string;
  reqStatus: string;
};

export type ChatInfoType = {
  name: string;
  created: number;
  private: boolean;
  members: User[];
};

export type Emoji = {
  slug: string;
  character: string;
  unicodeName: string;
  codePoint: string;
  group: string;
  subGroup: string;
};
