import React from "react";
import { Box, Text, Spacer } from "@chakra-ui/react";

import AppPrimaryButton from "./AppPrimaryButton";

export type AppNavbarProps = {
  actionButtonLabel?: string;
  onClickActionButton?(): void;
};

export default function AppNavbar({
  onClickActionButton,
  actionButtonLabel,
}: AppNavbarProps) {
  return (
    <Box
      height="60px"
      pos="sticky"
      top="0"
      display="flex"
      alignItems="center"
      zIndex="50"
      // bgColor="rgba(0, 0, 0, 0.5)"
      backdropFilter="blur(12px)"
      width="100%"
      padding={[0, 10, 0, 10]}
    >
      <Text fontSize="xl" color="white" fontWeight="bold">
        {"{ DyApp }"}
      </Text>

      <Spacer />

      <AppPrimaryButton onClick={onClickActionButton}>
        {actionButtonLabel ?? "Action"}
      </AppPrimaryButton>
    </Box>
  );
}
