import { NextUIProvider, Button, Checkbox, user } from "@nextui-org/react";
import { AiTwotoneEdit } from "react-icons/ai";
import InputWithChildren from "../../../InputWithChildren/InputWithChildren";
import useCreateOwnChat from "./CreateOwnChat.hook";
import styles from "./CreateOwnChat.module.css";

function CreateOwnChat() {
  const {
    userInput,
    onChangeSearchInput,
    isPrivate,
    setIsPrivate,
    onCreateChat,
  } = useCreateOwnChat();

  return (
    <NextUIProvider>
      <form className={styles.horizontalContainer} onSubmit={onCreateChat}>
        <div className={styles.verticalyContainer}>
          <InputWithChildren
            userInput={userInput}
            setUserInput={onChangeSearchInput}
            disabled={false}
            placeholder="Set a name for your chat"
          >
            <AiTwotoneEdit />
          </InputWithChildren>
          <Checkbox
            size="sm"
            isSelected={isPrivate}
            onChange={() => setIsPrivate(!isPrivate)}
          >
            {" make private"}
          </Checkbox>
        </div>
        <Button size="sm" type="submit">
          Create
        </Button>
      </form>
    </NextUIProvider>
  );
}

export default CreateOwnChat;
