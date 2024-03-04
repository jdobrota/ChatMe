import { NextApiRequest, NextApiResponse } from "next";
import { UserSettings } from "types/types";
import { getUserSettings, updateLastChatOpened } from "utils/chatActionsDB";

type Data = {
  message?: string;
  userSettings?: UserSettings;
};

type ErrorData = {
  body: string;
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
  if (req.method === "GET") {
    const user = req.query.user;

    const response = await getUserSettings(String(user));

    res.status(200).json({
      userSettings: response,
    });
    return;
  }

  if (req.method === "POST") {
    const user = req.query.user;
    const chatId = req.body;

    const response = await updateLastChatOpened(String(user), chatId);

    res.status(202).json({
      userSettings: response,
    });
    return;
  }

  res.status(405).json({
    body: "Method not allowed",
  });
}

export default handler;
