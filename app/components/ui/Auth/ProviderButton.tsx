"use client";

import { NextUIProvider } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { FcGoogle } from "react-icons/fc";
import React from "react";
import { signIn } from "next-auth/react";
import styles from "./ProviderButton.module.css";

function ProviderButton({
  name: provider_name,
  id: provider_id,
}: {
  name: string;
  id: string;
}) {
  const icon = provider_name === "Google" ? <FcGoogle /> : <></>;

  return (
    <div className={styles.provider}>
      <NextUIProvider>
        <Button
          onClick={() =>
            signIn(provider_id, {
              callbackUrl: process.env.VERCEL_URL || "http://localhost:3000",
            })
          }
        >
          {icon}
          {` Sign in with ${provider_name}`}
        </Button>
      </NextUIProvider>
    </div>
  );
}

export default ProviderButton;
