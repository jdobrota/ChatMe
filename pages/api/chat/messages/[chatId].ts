import { NextApiRequest, NextApiResponse } from "next";
import { serverPusher } from "_pusher";
import redis from "_redis";
import { Message } from "types/types";
import { updateSeenMessages } from "utils/chatActionsDB";

type Data = {
  messages: Message | Message[];
};

type ErrorData = {
  body: string;
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
  if (req.method === "PUT") {
    const { chatId } = req.query;
    const user = req.query.user;
    const msgId = req.body.id;

    const updatedMessage = await updateSeenMessages(
      String(user),
      String(chatId),
      msgId
    );

    if (!updatedMessage) {
      res.status(404).json({
        body: "message not updated",
      });
      return;
    }

    res.status(200).json({
      messages: updatedMessage!,
    });
    return;
  }

  if (req.method === "POST") {
    const { chatId } = req.query;

    const newMessage = { ...req.body, timeStamp: Date.now(), pending: false };
    const msgId = req.body.id;

    await redis.hset(String(chatId), {
      [msgId]: JSON.stringify(newMessage),
    });

    await serverPusher.trigger("messages", "new-message", newMessage);

    res.status(201).json({
      messages: newMessage,
    });
    return;
  }

  if (req.method === "GET") {
    const { chatId } = req.query;

    const messagesRes = await redis.hvals(String(chatId));
    const messages = Object.values(messagesRes).sort(
      (a: any, b: any) => b.timeStamp - a.timeStamp
    ) as Message[];

    res.status(200).json({
      messages: messages,
    });
    return;
  }

  res.status(405).json({
    body: "Method now allowed",
  });
}

export default handler;
