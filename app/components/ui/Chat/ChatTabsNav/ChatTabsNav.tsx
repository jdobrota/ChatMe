"use client";

import { Button, Tabs, Tab, Badge, NextUIProvider } from "@nextui-org/react";
import styles from "./ChatTabsNav.module.css";
import NewChatWindow from "../ChatWindow/NewChatWindow/NewChatWindow";
import { RiChatNewLine } from "react-icons/ri";
import { Chat } from "types/types";
import useChatTabsNav from "./ChatTabsNav.hook";

function ChatTabsNav({
  initialChats,
  initialChatId,
}: {
  initialChats: Chat[];
  initialChatId: string;
}) {
  const {
    userChats,
    userSettings,
    pendingClose,
    setPendingClose,
    modalVisible,
    setModalVisible,
    dispatchNewSelectedChat,
    onCloseChatTab,
  } = useChatTabsNav(initialChatId);

  return (
    <>
      {modalVisible ? (
        <NewChatWindow
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      ) : (
        <></>
      )}
      <NextUIProvider>
        <div className={styles.content + " " + styles.scroll}>
          <Tabs
            aria-label="Chats"
            selectedKey={userSettings?.lastChatOpened!}
            onSelectionChange={(e: any) => {
              if (e !== userSettings?.lastChatOpened!) {
                if (!pendingClose) dispatchNewSelectedChat(e);
              }
            }}
          >
            {(userChats || initialChats)?.map((chat) =>
              userSettings?.lastChatOpened! === chat.id ? (
                <Tab
                  className={chat.invite ? "bg-success-200" : ""}
                  aria-label={chat.id}
                  key={chat?.id}
                  title={
                    <>
                      {chat?.unreadMessages ? (
                        <Badge
                          content={chat?.unreadMessages}
                          color="danger"
                          placement="top-left"
                          size="sm"
                        >
                          <Badge
                            onClick={async () => {
                              setPendingClose(true);
                              await onCloseChatTab(chat).then(() =>
                                setPendingClose(false)
                              );
                            }}
                            content="X"
                            color="default"
                            placement="top-right"
                            size="sm"
                          >
                            <p className="mx-6">{chat?.name}</p>
                          </Badge>
                        </Badge>
                      ) : (
                        <Badge
                          onClick={async () => {
                            setPendingClose(true);
                            await onCloseChatTab(chat).then(() =>
                              setPendingClose(false)
                            );
                          }}
                          content="X"
                          color="default"
                          placement="top-right"
                          size="sm"
                        >
                          <p className="mx-6">{chat?.name}</p>
                        </Badge>
                      )}
                    </>
                  }
                ></Tab>
              ) : (
                <Tab
                  className={chat.invite ? "bg-success-200" : ""}
                  aria-label={chat.id}
                  key={chat?.id}
                  title={
                    <>
                      {chat?.unreadMessages ? (
                        <Badge
                          content={chat?.unreadMessages}
                          color="danger"
                          placement="top-left"
                          size="sm"
                        >
                          <p className="mx-6">{chat?.name}</p>
                        </Badge>
                      ) : (
                        <p className="mx-6">{chat?.name}</p>
                      )}
                    </>
                  }
                ></Tab>
              )
            )}
          </Tabs>
          <Button
            className={styles.newChatButton}
            onClick={() => setModalVisible(true)}
            size="sm"
          >
            <RiChatNewLine />
          </Button>
        </div>
        <hr className={styles.hr}></hr>
      </NextUIProvider>
    </>
  );
}

export default ChatTabsNav;
