import { NextApiRequest, NextApiResponse } from "next";
import { User } from "types/types";
import { getAllUsers } from "utils/chatActionsDB";

type Data = {
  message?: string;
  users?: User[];
};

type ErrorData = {
  body: string;
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
  if (req.method === "GET") {
    const user = req.query.user as string;

    const returnUsers = await getAllUsers(user);

    res.status(200).json({
      users: returnUsers,
    });
    return;
  }

  res.status(405).json({
    body: "Method not allowed",
  });
}

export default handler;
