import React from "react";
import { Input } from "@nextui-org/input";
import { NextUIProvider } from "@nextui-org/react";

function InputWithChildren({
  children,
  userInput,
  setUserInput,
  placeholder,
  disabled,
  className,
}: {
  children: React.ReactNode;
  userInput: string;
  setUserInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <NextUIProvider>
      <Input
        type="text"
        value={userInput}
        onChange={setUserInput}
        placeholder={placeholder}
        startContent={children}
        disabled={disabled}
        size="sm"
        variant="faded"
        className={className}
      />
    </NextUIProvider>
  );
}

export default InputWithChildren;
