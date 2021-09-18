import { Box, Button, Center, Spacer, Text } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import React, { useEffect, useState } from "react";
import AppNavbar from "../components/AppNavbar";
import AppPrimaryButton from "../components/AppPrimaryButton";

export default function Home() {
  const [currentAccount, setCurrentAccount] = useState<string>("");
  const toast = useToast();

  const { ethereum } = window;

  function checkIfWalletIsConnected() {
    setTimeout(() => {
      if (!ethereum) {
        toast({
          title: "No Wallet Found",
          description: "Connect to your Web 3 wallet to continue.",
          status: "info",
          duration: 6000,
          isClosable: true,
        });

        return;
      }

      ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: any) => {
          if (accounts.length > 0) {
            setCurrentAccount(accounts[0]);
          }
        })
        .catch((err: any) => console.error(err));
    }, 1000);
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <Box height="100%">
      <AppNavbar />

      <Box height="100vh" p={10}>
        <Center>
          <Box
            display="flex"
            justifyContent="center"
            flexDirection="column"
            alignItems="center"
          >
            <Text fontSize="7xl">Wave Portal 👋</Text>
            <Text fontSize="xl">This is my first Dycentralized App</Text>
          </Box>
        </Center>

        <Box
          marginTop="100px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDir="column"
        >
          <Text>There are no waves yet. Be the first to send a wave!</Text>

          <Box h="20px" />

          <AppPrimaryButton size="lg">Wave</AppPrimaryButton>
        </Box>
      </Box>

      {/* <Box p={10} height="250px">
        <Text fontWeight="bold">Socials</Text>
      </Box> */}
      <Box p={5} display="flex" justifyContent="center" alignItems="center">
        <Text>Built with ❤️ by</Text>
        <Box w="5px" />
        <Text fontWeight="bold">
          <a href="https://twitter.com/CarloMiguelDy" target="_blank">
            carlomigueldy.eth
          </a>
        </Text>
      </Box>
    </Box>
  );
}
