"use client";

import { BsFillChatDotsFill } from "react-icons/bs";
import styles from "./ChatUserInput.module.css";
import { NextUIProvider, Button } from "@nextui-org/react";
import useChatUserInput from "./ChatUserInput.hook";
import { Emoji } from "types/types";
import { BsEmojiHeartEyes } from "react-icons/bs";
import EmojiPicker from "./EmojiPicker/EmojiPicker";
import TextAreaWithChildren from "../TextAreaWithChildren/TextAreaWithChildren";

function ChatUserInput({
  initialEmojis,
}: {
  initialEmojis: Record<string, Emoji[]>;
}) {
  const {
    userInput,
    addEmoji,
    onChangeUserInput,
    onSendMessage,
    onKeyPress,
    status,
    disabled,
    toggleEmojiPicker,
    setToggleEmojiPicker,
  } = useChatUserInput();

  return (
    <form className={styles.form} onSubmit={onSendMessage} autoComplete="off">
      <div className={styles.userInputContainer}>
        <TextAreaWithChildren
          disabled={status === "unauthenticated" || disabled}
          userInput={userInput}
          setUserInput={onChangeUserInput}
          placeholder="ChatMe!"
          onPressEnter={onKeyPress}
          className="max-h-min"
        >
          <BsFillChatDotsFill className={styles.userInputIcon} />
        </TextAreaWithChildren>
      </div>
      <button
        type="button"
        className={styles.emoji}
        onClick={() => setToggleEmojiPicker(!toggleEmojiPicker)}
      >
        <BsEmojiHeartEyes />
      </button>
      <NextUIProvider>
        <Button
          size="sm"
          type="submit"
          disabled={!userInput.length}
          className={styles.sendBtn}
        >
          Send
        </Button>
      </NextUIProvider>
      {toggleEmojiPicker && (
        <EmojiPicker initialEmojis={initialEmojis} addEmoji={addEmoji} />
      )}
    </form>
  );
}

export default ChatUserInput;
