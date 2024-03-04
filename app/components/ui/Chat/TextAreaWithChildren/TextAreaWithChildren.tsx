import React from "react";
import { Textarea } from "@nextui-org/react";
import { NextUIProvider } from "@nextui-org/system";

function TextAreaWithChildren({
  children,
  userInput,
  setUserInput,
  placeholder,
  disabled,
  onPressEnter,
  className,
}: {
  children: React.ReactNode;
  userInput: string;
  setUserInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  disabled?: boolean;
  onPressEnter: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
}) {
  return (
    <NextUIProvider>
      <Textarea
        type="text"
        value={userInput}
        onChange={setUserInput}
        placeholder={placeholder}
        startContent={children}
        disabled={disabled}
        minRows={1}
        size="sm"
        variant="faded"
        onKeyPress={onPressEnter}
        className={className}
      />
    </NextUIProvider>
  );
}

export default TextAreaWithChildren;
