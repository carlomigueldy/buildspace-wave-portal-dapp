import React from "react";
import { Box, Text, Spacer } from "@chakra-ui/react";

import AppPrimaryButton from "./AppPrimaryButton";

export default function AppNavbar() {
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

      <AppPrimaryButton>Send a Wave</AppPrimaryButton>
    </Box>
  );
}
