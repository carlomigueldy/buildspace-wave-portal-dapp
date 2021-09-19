import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
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
import AppFooter from "../components/AppFooter";
import { TESTNET_WAVE_PORTAL_ADDRESS } from "../constants";

const WAVE_PORTAL_ADDRESS = import.meta.env.PROD
  ? TESTNET_WAVE_PORTAL_ADDRESS
  : "0x5FbDB2315678afecb367f032d93F642f64180aa3";

console.log({ WAVE_PORTAL_ADDRESS, TESTNET_WAVE_PORTAL_ADDRESS });

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
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [transactionLoading, setTransactionLoading] = useState<boolean>(false);
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
  const {
    isOpen: isSuccessModalOpen,
    onOpen: openSuccessModal,
    onClose: closeSuccessModal,
  } = useDisclosure();
  const contract = ethereum ? useWavePortalContract() : null;

  useEffect(() => {
    checkIfWalletIsConnected();
    getWaves();
    // getTotalWaves();
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

    if (!form.displayName) {
      return openFormModal();
    }

    await connectWallet();

    const waveTxn = await contract?.wave({
      display_name: form.displayName,
      message: form.message,
      created_at: new Date().getTime(),
    });
    setTransactionLoading(true);
    console.log("⛏️ Mining...", waveTxn.hash);
    await waveTxn.wait();
    console.log("Mined --", waveTxn.hash);
    setTransactionLoading(false);
    setForm(formDefaultValue);
    closeFormModal();
    getWaves();
    setShowConfetti(true);
    openSuccessModal();

    setTimeout(() => {
      setShowConfetti(false);
    }, 60000);
  }

  async function getWaves() {
    try {
      setLoading(true);
      const waves = await contract?.getWaves();
      console.log("waves", waves);
      setState({
        ...state,
        totalWaves: waves.length,
        waves,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function submitForm() {
    if (!form.displayName) {
      return toast.warning({
        title: "Must have a display name",
      });
    }

    return wave();
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
              <Text fontSize="lg">
                This is my first Dycentralized App & there are{" "}
                {state.totalWaves?.toString()} total waves!
              </Text>
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
                        {d.display_name ?? "Anonymous"} sent a wave 👋
                      </Text>
                      <Text fontSize="xs">{d.owner.toString()}</Text>

                      <Box height={10} />

                      <Text fontSize="md">{d.message}</Text>
                    </Box>
                  );
                })}
              </Box>
            </>
          )}
        </Box>

        <AppFooter />
      </Box>

      {showConfetti ? <Confetti width={width} height={height} /> : null}

      {/* Form Modal */}
      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={closeFormModal}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Send a Wave</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {transactionLoading ? (
              <>
                <div style={{ width: "480px" }}>
                  <iframe
                    allow="fullscreen"
                    frameBorder="0"
                    height="320"
                    src="https://giphy.com/embed/u2wg2uXJbHzkXkPphr/video"
                    width="400px"
                  ></iframe>
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button color="white" onClick={closeFormModal}>
              Cancel
            </Button>
            <AppPrimaryButton onClick={submitForm}>Save</AppPrimaryButton>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Success Modal */}
      <Modal
        closeOnOverlayClick={false}
        isOpen={isSuccessModalOpen}
        onClose={closeSuccessModal}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cheers 🎉</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text>
              You have successfully sent a wave to the smart contract! 🙌
            </Text>

            <Box h={2} />

            <iframe
              src="https://giphy.com/embed/10hO3rDNqqg2Xe"
              width="400px"
              height="252px"
              frameBorder="0"
              className="giphy-embed"
              allowFullScreen
            ></iframe>
            <p>
              <a href="https://giphy.com/gifs/carnaval-carnival-dance-10hO3rDNqqg2Xe">
                via GIPHY
              </a>
            </p>
          </ModalBody>

          <ModalFooter>
            <Button color="white" onClick={closeSuccessModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
