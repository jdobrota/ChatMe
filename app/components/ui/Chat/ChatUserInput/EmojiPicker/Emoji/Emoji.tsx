import React from "react";

function Emoji({
  style,
  onClick,
  character,
}: {
  style: string;
  onClick: () => void;
  character: string;
}) {
  return (
    <li className={style} onClick={onClick}>
      {character}
    </li>
  );
}

export default Emoji;
