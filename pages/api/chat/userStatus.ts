import { NextApiRequest, NextApiResponse } from "next";
import { getUserSettings, setUserStatus } from "utils/chatActionsDB";

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
  if (req.method === "PATCH") {
    const user = req.query.user as string;
    const status = req.query.status as string;

    const userSettingsDB = await getUserSettings(user);
    if (userSettingsDB.status === status) {
      res.status(304).end();
      return;
    }
    if (
      status.toLowerCase() !== "online" &&
      status.toLowerCase() !== "offline"
    ) {
      res.status(406).json({
        body: "online or offline supported only",
      });
      return;
    }

    await setUserStatus(user, status);

    res.status(200).json({
      message: `Status ${status} set successfully`,
    });
    return;
  }

  res.status(405).json({
    body: "Method not allowed",
  });
}

export default handler;
