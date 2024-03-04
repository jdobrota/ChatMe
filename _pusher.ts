import Pusher from "pusher";
import ClientPusher from "pusher-js";

export const serverPusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

export const clientPusherChatWindow = new ClientPusher("969f4bd8075efa78f427", {
  cluster: "eu",
  forceTLS: true,
});

export const clientPusherChatTabs = new ClientPusher("969f4bd8075efa78f427", {
  cluster: "eu",
  forceTLS: true,
});
