import { getServerSession } from "next-auth";
import React from "react";
import { Chat, Emoji, Message } from "types/types";
import { prepareUi } from "utils/chatActionsDB";
import FriendsWindow from "./components/ui/Chat/FriendsWindow/FriendsWindow";
import MainChat from "./components/ui/Chat/MainChat";

async function HomePage() {
  const session = await getServerSession();

  const [messages, chats, lastChatOpened, emojis] = await prepareUi(session!);
  return (
    <div className="flex flex-row w-[90svw] h-[90svh] justify-center pt-2 overflow-hidden">
      <MainChat
        initialMessages={messages as Message[]}
        initialChats={chats as Chat[]}
        initialChatId={lastChatOpened as string}
        initialEmojis={emojis as Record<string, Emoji[]>}
      />
      <FriendsWindow />
    </div>
  );
}

export default HomePage;
