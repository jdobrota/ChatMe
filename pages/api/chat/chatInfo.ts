import { NextApiRequest, NextApiResponse } from "next";
import { ChatInfoType } from "types/types";
import { getChatInfo } from "utils/chatActionsDB";

type Data = {
  message?: string;
  chatInfo?: ChatInfoType;
};

type ErrorData = {
  body: string;
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
  if (req.method === "GET") {
    const chatId = req.query.chat as string;

    const returnChatInfo = await getChatInfo(chatId);

    res.status(200).json({
      chatInfo: returnChatInfo,
    });
    return;
  }

  res.status(405).json({
    body: "Method not allowed",
  });
}

export default handler;
