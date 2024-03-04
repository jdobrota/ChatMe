import { useState } from "react";

type useNewChatWindowType = {
  createOwnChat: boolean;
  onCreateOwnChat: () => void;
  joinExistingChat: boolean;
  onJoinExistingChat: () => void;
};

function useNewChatWindow() {
  const [createOwnChat, setCreateOwnChat] = useState<boolean>(false);
  const [joinExistingChat, setJoinExistingChat] = useState<boolean>(false);

  function onCreateOwnChat() {
    setCreateOwnChat(true);
    setJoinExistingChat(false);
  }

  function onJoinExistingChat() {
    setCreateOwnChat(false);
    setJoinExistingChat(true);
  }

  return {
    createOwnChat,
    onCreateOwnChat,
    joinExistingChat,
    onJoinExistingChat,
  } as useNewChatWindowType;
}

export default useNewChatWindow;
