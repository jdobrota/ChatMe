import {
  NextUIProvider,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import React from "react";
import { CiMenuKebab } from "react-icons/ci";
import styles from "./FriendsUserCardOptions.module.css";

function FriendsUserCardOptions({
  removeFriendAction,
}: {
  removeFriendAction: () => void;
}) {
  return (
    <Dropdown>
      <DropdownTrigger>
        {
          <button>
            <CiMenuKebab size={20} />
          </button>
        }
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem
          key="remove_friend"
          className={styles.removeFriend}
          color="danger"
          onClick={removeFriendAction}
        >
          Remove friend
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export default FriendsUserCardOptions;
