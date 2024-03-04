"use client";

import React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { signOut, useSession } from "next-auth/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Image,
} from "@nextui-org/react";
import styles from "./UserCard.module.css";

function UserCard() {
  const { data: session } = useSession();

  return (
    <NextUIProvider>
      <Dropdown>
        <DropdownTrigger>
          {
            <Button
              size="sm"
              variant="solid"
              radius="full"
              color="primary"
              className={styles.button}
            >
              {session?.user?.name!}
              <Image
                width={32}
                height={32}
                alt="Profile picture"
                src={session?.user?.image!}
              />
            </Button>
          }
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          {/* <DropdownItem key="new">Settings</DropdownItem>
          <DropdownItem key="copy">Set nickname</DropdownItem> */}
          <DropdownItem
            key="signout"
            className="text-danger"
            color="danger"
            onClick={() => signOut()}
          >
            Sign out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </NextUIProvider>
  );
}

export default UserCard;
