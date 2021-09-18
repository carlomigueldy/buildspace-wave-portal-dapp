import React, { useEffect, useState } from "react";

import { Box, Center, Text } from "@chakra-ui/react";

import AppNavbar from "../components/AppNavbar";
import AppPrimaryButton from "../components/AppPrimaryButton";
import useAppToast from "../hooks/useAppToast.hook";

type HomeState = {
  currentAccount: string;
  web3Enabled: boolean;
};

export default function Home() {
  const [state, setState] = useState<HomeState>({
    currentAccount: "",
    web3Enabled: false,
  });
  const toast = useAppToast();

  const { ethereum } = window;

  function checkIfWalletIsConnected() {
    if (!ethereum) {
      toast.info({
        title: "No Wallet Found",
        description: "Make sure to have installed MetaMask or similar wallet",
      });

      return;
    }

    return setState({
      ...state,
      web3Enabled: true,
    });
  }

  async function connectWallet() {
    try {
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length > 0) {
        return setState({
          ...state,
          currentAccount: accounts[0],
        });
      }

      return toast.error({
        title: "No Accounts Found",
        description: "Can't find any accounts in your wallet",
      });
    } catch (error) {
      console.error(error);

      return toast.unexpectedError();
    }
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
            <Text fontSize="6xl">Wave Portal 👋</Text>
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
