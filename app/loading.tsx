"use client";

import React from "react";
import { Spinner } from "@nextui-org/react";
import { NextUIProvider } from "@nextui-org/system";

function Loading() {
  return (
    <NextUIProvider>
      <Spinner className="fixed left-1/2 top-1/2" />
    </NextUIProvider>
  );
}

export default Loading;
