"use client";

import {
  NextUIProvider,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@nextui-org/react";
import CreateOwnChat from "./CreateOwnChat/CreateOwnChat";
import JoinExistingChat from "./JoinExistingChat/JoinExistingChat";
import useNewChatWindow from "./NewChatWindow.hook";
import styles from "./NewChatWindow.module.css";

function NewChatWindow({
  modalVisible,
  setModalVisible,
}: {
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
}) {
  const {
    createOwnChat,
    onCreateOwnChat,
    joinExistingChat,
    onJoinExistingChat,
  } = useNewChatWindow();

  return (
    <NextUIProvider>
      <Modal
        backdrop="blur"
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <ModalContent className={styles.modal}>
          <ModalHeader>
            <p>Join an existing chat or create your own!</p>
          </ModalHeader>
          <ModalBody>
            {createOwnChat ? (
              <CreateOwnChat />
            ) : (
              <Button onClick={() => onCreateOwnChat()} size="sm">
                Create my own
              </Button>
            )}
            <hr></hr>
            {joinExistingChat ? (
              <JoinExistingChat />
            ) : (
              <Button onClick={() => onJoinExistingChat()} size="sm">
                Join existing chat
              </Button>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </NextUIProvider>
  );
}

export default NewChatWindow;
