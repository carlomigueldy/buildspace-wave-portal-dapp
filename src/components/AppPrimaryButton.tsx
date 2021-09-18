import React from "react";
import { Button, ThemingProps } from "@chakra-ui/react";

export type AppPrimaryButtonProps = {
  children?: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg";
};

export default function AppPrimaryButton({
  children,
  size,
}: AppPrimaryButtonProps) {
  return (
    <Button
      bgColor="primary"
      borderRadius="md"
      // boxShadow="0px 0px 10px 2px rgba(50, 56, 168, 0.5)"
      color="white"
      size={size ?? "md"}
    >
      {children}
    </Button>
  );
}
