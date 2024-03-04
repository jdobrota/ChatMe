import { NextUIProvider, AvatarGroup, Avatar } from "@nextui-org/react";
import React from "react";
import { Message } from "types/types";

function SeenByUsers({
  seenByUsers = [],
  message,
}: {
  seenByUsers: string[];
  message: Message;
}) {
  return (
    <NextUIProvider>
      <AvatarGroup isBordered size="sm">
        {seenByUsers
          ?.filter((seen) => seen !== message.profilePic)
          .map((user) => (
            <Avatar size="sm" key={user} src={user} />
          ))}
      </AvatarGroup>
    </NextUIProvider>
  );
}

export default SeenByUsers;
