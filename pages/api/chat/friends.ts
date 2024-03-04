import { NextApiRequest, NextApiResponse } from "next";
import { User } from "types/types";
import {
  deleteFriendFromUserSettings,
  getFriendsForUser,
  handleFriendRequest,
} from "utils/chatActionsDB";

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

    const returnUsers = await getFriendsForUser(user);

    res.status(200).json({
      users: returnUsers,
    });
    return;
  }

  if (req.method === "POST") {
    const user = req.query.user as string;
    const targetUser = req.body;

    const response = await handleFriendRequest(targetUser, user);
    const returnUsers = await getFriendsForUser(user);

    res.status(202).json({
      users: returnUsers,
    });
    return;
  }

  if (req.method === "PATCH") {
    const user = req.query.user as string;
    const targetUser = req.body;
    const accept = req.query.accept as string;

    const response = await handleFriendRequest(targetUser, user, accept);
    const returnUsers = await getFriendsForUser(user);

    res.status(202).json({
      users: returnUsers,
    });
    return;
  }

  if (req.method === "DELETE") {
    const user = req.query.user as string;
    const targetUser = req.body;

    const response = await deleteFriendFromUserSettings(targetUser, user);
    const returnUsers = await getFriendsForUser(user);

    res.status(202).json({
      users: returnUsers,
    });
    return;
  }

  res.status(405).json({
    body: "Method not allowed",
  });
}

export default handler;
