import React from "react";
import { Box, Text, Spacer } from "@chakra-ui/react";

import AppPrimaryButton from "./AppPrimaryButton";

export type AppNavbarProps = {
  onClickActionButton?(): void;
};

export default function AppNavbar({ onClickActionButton }: AppNavbarProps) {
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
      p={[0, 5, 0, 5]}
    >
      <Text fontSize="xl" color="white" fontWeight="bold">
        {"{ DyApp }"}
      </Text>

      <Spacer />

      <AppPrimaryButton onClick={onClickActionButton}>
        Connect Wallet
      </AppPrimaryButton>
    </Box>
  );
}
