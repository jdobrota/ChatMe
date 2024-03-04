"use client";

import React from "react";
import styles from "./Header.module.css";
import UserCard from "../UserCard/UserCard";
import { useSession } from "next-auth/react";

function Header() {
  const { status } = useSession();

  return (
    <header className={styles.header}>
      <p className={styles.appName}>{process.env.app_name}</p>

      {status === "authenticated" && <UserCard />}
    </header>
  );
}

export default Header;
