import { Box, Text } from "@chakra-ui/react";
import React from "react";

export default function AppFooter() {
  return (
    <Box p={5} display="flex" justifyContent="center" alignItems="center">
      <Text>Built with ❤️ by</Text>
      <Box w="5px" />
      <Text fontWeight="bold">
        <a href="https://twitter.com/CarloMiguelDy" target="_blank">
          carlomigueldy.eth
        </a>
      </Text>
    </Box>
  );
}
