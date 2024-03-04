import MyCard from "app/components/ui/Card/MyCard";
import React, { useState } from "react";
import { Emoji as EmojiType } from "types/types";
import Emoji from "./Emoji/Emoji";
import styles from "./EmojiPicker.module.css";

function EmojiPicker({
  initialEmojis,
  addEmoji,
}: {
  initialEmojis: Record<string, EmojiType[]>;
  addEmoji: (emoji: string) => void;
}) {
  const [category, setCategory] = useState<string>("");
  const [findEmoji, setFindEmoji] = useState<string>("");

  function onSetCategory(categoryParam: string) {
    setCategory((prev) => (prev === categoryParam ? "" : categoryParam));
  }

  return (
    <MyCard cardStyle={styles.card}>
      <input
        type="text"
        placeholder="Find emoji"
        className="text-xs rounded-md"
        onChange={(e) => setFindEmoji(e.target.value)}
        value={findEmoji}
      ></input>
      <ul className={styles.category}>
        {Object.keys(initialEmojis).map((record) => (
          <Emoji
            style={`${styles.emoji} ${
              category === record ? styles.activeCategory : ""
            } ${styles.emojiCategory}`}
            key={initialEmojis[record][0].unicodeName}
            onClick={() => onSetCategory(record)}
            character={initialEmojis[record][0].character}
          />
        ))}
      </ul>
      <hr />
      <ul className={styles.emojiList}>
        {category.length
          ? initialEmojis[category]
              .filter((emoji) =>
                findEmoji.length ? emoji.unicodeName.includes(findEmoji) : emoji
              )
              .map((emoji) => (
                <Emoji
                  style={`${styles.emoji}`}
                  key={emoji.unicodeName}
                  onClick={() => addEmoji(emoji.character)}
                  character={emoji.character}
                />
              ))
          : Object.values(initialEmojis)
              .flat()
              .filter((emoji) =>
                findEmoji.length ? emoji.unicodeName.includes(findEmoji) : emoji
              )
              .map((emoji) => (
                <Emoji
                  style={`${styles.emoji}`}
                  key={emoji.unicodeName}
                  onClick={() => addEmoji(emoji.character)}
                  character={emoji.character}
                />
              ))}
      </ul>
    </MyCard>
  );
}

export default EmojiPicker;
