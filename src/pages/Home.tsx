import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { Box, Center, Text } from "@chakra-ui/react";

import AppNavbar from "../components/AppNavbar";
import AppPrimaryButton from "../components/AppPrimaryButton";
import useAppToast from "../hooks/useAppToast.hook";
import WavePortal from "../../artifacts/contracts/WavePortal.sol/WavePortal.json";

function useWavePortalContract() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const wavePortalContract = new ethers.Contract(
    "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    WavePortal.abi,
    signer
  );
  return wavePortalContract;
}

type HomeState = {
  currentAccount: string;
  web3Enabled: boolean;
};

export default function Home() {
  const { ethereum } = window;
  const toast = useAppToast();
  const [state, setState] = useState<HomeState>({
    currentAccount: "",
    web3Enabled: false,
  });

  async function showNoWalletFoundToast() {
    toast.info({
      title: "No Wallet Found",
      description: "Make sure to have installed MetaMask or similar wallet",
    });
  }

  async function checkIfWalletIsConnected() {
    if (!ethereum) {
      showNoWalletFoundToast();

      return;
    }

    try {
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length > 0) {
        return setState({
          ...state,
          currentAccount: accounts[0],
        });
      }

      return setState({
        ...state,
        web3Enabled: true,
      });
    } catch (error) {}
  }

  async function connectWallet() {
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("connectWallet | accounts", accounts);

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

  async function wave() {
    if (!ethereum) {
      return showNoWalletFoundToast();
    }

    await connectWallet();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      WavePortal.abi,
      signer
    );
    const waveTxn = await contract.wave();
    console.log("⛏️ Mining...", waveTxn.hash);
    waveTxn.wait();
    console.log("Mined --", waveTxn.hash);

    const count = await contract.getTotalWaves();

    toast.info({
      title: "Total Waves",
      description: `Total Waves are ${count}`,
    });
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <Box height="100%">
      <AppNavbar onClickActionButton={() => connectWallet()} />

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

          <AppPrimaryButton onClick={() => wave()} size="lg">
            Wave
          </AppPrimaryButton>
        </Box>
      </Box>

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
