import { FcSearch } from "react-icons/fc";
import InputWithChildren from "../../../InputWithChildren/InputWithChildren";
import styles from "./JoinExistingChat.module.css";
import { Listbox, ListboxItem, NextUIProvider } from "@nextui-org/react";
import useJoinExistingChat from "./JoinExistingChat.hook";

function JoinExistingChat() {
  const {
    searchUserInput,
    onChangeSearchInput,
    joinChatPending,
    setJoinChatPending,
    userChats,
    chats,
    onChatClick,
  } = useJoinExistingChat();

  return (
    <NextUIProvider>
      <InputWithChildren
        userInput={searchUserInput}
        setUserInput={onChangeSearchInput}
        disabled={false}
        placeholder="Search public chats"
      >
        <FcSearch />
      </InputWithChildren>

      <div className={`${styles.chatList} ${styles.scroll}`}>
        <Listbox
          aria-label="Actions"
          disabledKeys={
            !joinChatPending
              ? chats
                  ?.filter(
                    (chat) =>
                      userChats?.some((someChat) => someChat.id === chat.id) ||
                      chat.private
                  )
                  .map((chat) => {
                    return chat.id;
                  })
              : chats?.map((chat) => {
                  return chat.id;
                })
          }
        >
          {chats
            ?.filter((chat) => chat.name.includes(searchUserInput, 0))
            .map((chat_ui) => (
              <ListboxItem
                className={styles.item}
                key={chat_ui.id}
                onClick={async () => {
                  setJoinChatPending(true);
                  await onChatClick(chat_ui).then(() =>
                    setJoinChatPending(false)
                  );
                }}
              >
                {chat_ui.name}
              </ListboxItem>
            ))}
        </Listbox>
      </div>
    </NextUIProvider>
  );
}

export default JoinExistingChat;
