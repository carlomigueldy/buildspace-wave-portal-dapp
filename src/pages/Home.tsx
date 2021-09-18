import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import {
  Box,
  Button,
  Center,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";

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
  displayName: string;
};

type FormState = {
  displayName: string;
  message: string;
};

const formDefaultValue = {
  displayName: "",
  message: "",
};

export default function Home() {
  const { ethereum } = window;
  const toast = useAppToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [form, setForm] = useState<FormState>(formDefaultValue);
  const [state, setState] = useState<HomeState>({
    totalWaves: 0,
    currentAccount: "",
    web3Enabled: false,
    waves: [],
    displayName: "",
  });
  const {
    isOpen,
    onOpen: openFormModal,
    onClose: closeFormModal,
  } = useDisclosure();
  const contract = ethereum ? useWavePortalContract() : null;

  useEffect(() => {
    checkIfWalletIsConnected();
    getWaves();
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

      console.log("checkIfWalletIsConnected | ethereum is undefined");

      return;
    }

    try {
      const accounts = await ethereum.request({ method: "eth_accounts" });
      console.log(`checkIfWalletIsConnected | accounts`, accounts);

      if (accounts.length > 0) {
        setState({
          ...state,
          currentAccount: accounts[0],
        });
        console.log(`checkIfWalletIsConnected | state`, state);

        return;
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

    if (await hasWaved()) {
      return toast.info({
        title: "Already Sent a Wave",
        description: "You have already sent a wave.",
      });
    }

    if (!form.displayName) {
      return openFormModal();
    }

    await connectWallet();

    const waveTxn = await contract?.wave({
      display_name: form.displayName,
      message: form.message,
      created_at: new Date().getTime(),
    });
    console.log("⛏️ Mining...", waveTxn.hash);
    waveTxn.wait();
    console.log("Mined --", waveTxn.hash);
    getTotalWaves();
    setForm(formDefaultValue);
    closeFormModal();
  }

  async function getTotalWaves() {
    const totalWaves = await contract?.getTotalWaves();
    setState({
      ...state,
      totalWaves,
    });
  }

  async function hasWaved(): Promise<boolean> {
    return await contract?.hasWaved();
  }

  async function getWaves() {
    try {
      setLoading(true);
      const waves = await contract?.getWaves();
      console.log("waves", waves);
      setState({
        ...state,
        waves,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Box height="100%">
        <AppNavbar
          actionButtonLabel={
            !state.currentAccount ? "Connect Wallet" : "Send Wave"
          }
          onClickActionButton={!state.currentAccount ? connectWallet : wave}
        />

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

          {loading ? (
            <Center>Loading...</Center>
          ) : (
            <>
              {" "}
              <Box
                marginTop="30px"
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDir="column"
              >
                {state.waves?.length == 0 ? (
                  <>
                    {" "}
                    <Text>
                      There are no waves yet. Be the first to send a wave!
                    </Text>
                    <Box h="20px" />
                    <AppPrimaryButton onClick={() => wave()} size="lg">
                      Wave
                    </AppPrimaryButton>
                  </>
                ) : null}

                {state.waves?.map((d, index) => {
                  return (
                    <Box
                      bgColor="primary"
                      m={2}
                      p={5}
                      borderRadius="md"
                      width={500}
                      key={index}
                    >
                      <Text fontSize="xl" fontWeight="semibold">
                        {d.display_name}
                      </Text>
                      <Text fontSize="md">{d.owner.toString()}</Text>

                      <Box height={10} />

                      <Text fontSize="md">{d.message}</Text>
                      {/* <pre>
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
                      </pre> */}
                    </Box>
                  );
                })}
              </Box>
            </>
          )}
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

      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={closeFormModal}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create your account</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Input
              mb={2}
              placeholder="Your Display Name"
              onChange={(event) =>
                setForm({ ...form, displayName: event.target?.value })
              }
            />
            <Textarea
              placeholder="Your message"
              onChange={(event) =>
                setForm({ ...form, message: event.target?.value })
              }
            ></Textarea>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={wave} mr={3}>
              Save
            </Button>
            <Button onClick={closeFormModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
