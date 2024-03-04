import { NextApiRequest, NextApiResponse } from "next";
import { Chat, User } from "types/types";
import {
  acceptChatInvite,
  declineChatInvite,
  inviteUserToChat,
  subscribeToChat,
} from "utils/chatActionsDB";
import { serverPusher } from "_pusher";
import redis from "_redis";

type Data = {
  message?: string;
};

type ErrorData = {
  body: string;
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
  if (req.method === "POST") {
    const chatId = req.query.chat as string;
    const fromUser = req.body as string;
    const invitedUser = req.query.user as string;

    await inviteUserToChat(invitedUser, chatId, fromUser);

    const chatsRes = (await redis.hvals("chats")) as Chat[];

    await serverPusher.trigger(
      "invites",
      "chat-invite",
      chatsRes.filter((chat) => chat.id === chatId)[0]
    );

    res.status(200).json({
      message: `User ${invitedUser} was invited to the chat ${chatId} by ${fromUser}`,
    });
    return;
  }

  if (req.method === "PATCH") {
    const chatId = req.query.chat as string;
    const accept = req.query.accept as string;
    const invitedUser = req.query.user as string;

    if (accept === "true") {
      await acceptChatInvite(invitedUser, chatId);
    }

    if (accept === "false") {
      await declineChatInvite(invitedUser, chatId);
    }

    res.status(200).json({
      message:
        accept === "true"
          ? `User ${invitedUser} accepted invite and joined to the chat ${chatId}`
          : `User ${invitedUser} declined invite to the chat ${chatId}`,
    });
    return;
  }

  res.status(405).json({
    body: "Method not allowed",
  });
}

export default handler;
