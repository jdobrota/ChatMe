"use client";

import { NextUIProvider, Card, CardBody } from "@nextui-org/react";
import React from "react";

function MyCard({
  children,
  cardStyle,
  bodyStyle,
  providerStyle,
  shadow = true,
}: {
  children: React.ReactNode;
  cardStyle: string;
  bodyStyle?: string;
  providerStyle?: string;
  shadow?: boolean;
}) {
  return (
    <NextUIProvider className={providerStyle}>
      <Card
        isBlurred={true}
        shadow={shadow ? "sm" : "none"}
        className={cardStyle}
      >
        <CardBody className={bodyStyle}>{children}</CardBody>
      </Card>
    </NextUIProvider>
  );
}

export default MyCard;
