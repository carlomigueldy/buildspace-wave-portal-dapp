import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { Box, Center, Text } from "@chakra-ui/react";

import AppNavbar from "../components/AppNavbar";
import AppPrimaryButton from "../components/AppPrimaryButton";
import useAppToast from "../hooks/useAppToast.hook";
import WavePortal from "../../artifacts/contracts/WavePortal.sol/WavePortal.json";

const WAVE_PORTAL_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function useWavePortalContract() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    WAVE_PORTAL_ADDRESS,
    WavePortal.abi,
    signer
  );
  return contract;
}

type Wave = {
  index: number;
  owner: string;
  display_name: string;
  message: string;
  created_at: number;
};

type HomeState = {
  totalWaves: number;
  currentAccount: string;
  web3Enabled: boolean;
  waves: Wave[];
};

export default function Home() {
  const { ethereum } = window;
  const contract = useWavePortalContract();
  const toast = useAppToast();
  const [state, setState] = useState<HomeState>({
    totalWaves: 0,
    currentAccount: "",
    web3Enabled: false,
    waves: [],
  });

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

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
    } catch (error) {
      console.error(error);
    }
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

    const waveTxn = await contract.wave({
      created_at: new Date().getTime(),
      message: "Hello World",
      display_name: "Carlo Miguel Dy",
    });

    console.log("⛏️ Mining...", waveTxn.hash);
    waveTxn.wait();
    console.log("Mined --", waveTxn.hash);
    getTotalWaves();
  }

  async function getTotalWaves() {
    const totalWaves = await contract.getTotalWaves();
    setState({
      ...state,
      totalWaves,
    });
  }

  async function hasWaved(): Promise<boolean> {
    return await contract.hasWaved();
  }

  async function getWaves() {
    const waves = await contract.getWaves();
    console.log("waves", waves);
    setState({
      ...state,
      waves,
    });
  }

  return (
    <Box height="100%">
      <AppNavbar onClickActionButton={() => connectWallet()} />

      <Box minHeight="100vh" p={10}>
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

          <Box h="20px" />
          <AppPrimaryButton onClick={() => hasWaved()}>
            hasWaved
          </AppPrimaryButton>
          <Box h="20px" />
          <AppPrimaryButton onClick={() => getWaves()}>
            getWaves
          </AppPrimaryButton>

          {state.waves.map((d, index) => {
            return (
              <Box key={index}>
                <pre>
                  {JSON.stringify(
                    {
                      index: Number(d.index.toString()),
                      display_name: d.display_name,
                      created_at: new Date(
                        Number(d.created_at.toString()) * 1000
                      ),
                      message: d.message,
                      owner: d.owner.toString(),
                    },
                    null,
                    2
                  )}
                </pre>
              </Box>
            );
          })}
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
