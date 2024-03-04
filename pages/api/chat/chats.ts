import { NextApiRequest, NextApiResponse } from "next";
import redis from "_redis";
import { Chat } from "types/types";
import {
  getAllUserSettings,
  getSortedChats,
  getSortedUserChats,
  getUserSettings,
  subscribeToChat,
  unsubscribeFromChat,
} from "utils/chatActionsDB";

type Data = {
  chats: Chat | Chat[];
};

type ErrorData = {
  body: string;
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
  if (req.method === "POST") {
    const newChat = { ...req.body };
    const chatId = req.body.id;
    const user = req.query.user;
    const subscribeOnly = req.query.subscribeonly;

    if (subscribeOnly) {
      await subscribeToChat(String(user), chatId);

      res.status(201).json({
        chats: newChat,
      });
      return;
    }

    await redis.hset("chats", {
      [chatId]: JSON.stringify(newChat),
    });

    if (user) {
      await subscribeToChat(String(user), chatId);
    }

    res.status(201).json({
      chats: newChat,
    });
    return;
  }

  if (req.method === "GET") {
    let chats: Chat[];
    const user = req.query.user;

    if (user) {
      // return user chats
      const userSettingsDB = await getUserSettings(String(user));

      chats = await getSortedUserChats(userSettingsDB);
    } else {
      // return all chats
      chats = await getSortedChats();
    }

    res.status(200).json({
      chats: chats,
    });
    return;
  }

  if (req.method === "DELETE") {
    const chatId = req.body.id;
    const user = req.query.user;
    let chats: Chat[] = [];

    const unsub = await unsubscribeFromChat(String(user), chatId);

    // checks if someone is still subscribed to this chat
    const userSettingsRes = await getAllUserSettings();
    const userSettings = Object.values(userSettingsRes);
    const usersSubscribed = userSettings.filter((user_settings) =>
      user_settings.chats.includes(chatId)
    );

    if (!usersSubscribed.length) {
      //  delete chat permanently if no one is subscribed to the chat
      await redis.hdel("chats", chatId);

      //  delete left over messages after chat delete
      await redis.del(`messages_${chatId}`);
    }

    //  get all user chats to return
    const userSettingsForUser = userSettings.filter(
      (user_settings) => user_settings.id === user
    )[0];
    chats = await getSortedUserChats(userSettingsForUser);

    res.status(200).json({
      chats: chats,
    });
    return;
  }

  res.status(405).json({
    body: "Method not allowed",
  });
}

export default handler;
