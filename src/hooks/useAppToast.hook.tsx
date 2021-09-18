import { useToast } from "@chakra-ui/react";

export type UseAppToastOptions = {
  title: string;
  description?: string;
};

export default function useAppToast() {
  const toast = useToast();
  const duration = 6000;
  const isClosable = true;

  return {
    info: ({ title, description }: UseAppToastOptions) => {
      return toast({
        title,
        description,
        duration,
        isClosable,
        status: "info",
      });
    },
    success: ({ title, description }: UseAppToastOptions) => {
      return toast({
        title,
        description,
        duration,
        isClosable,
        status: "success",
      });
    },
    warning: ({ title, description }: UseAppToastOptions) => {
      return toast({
        title,
        description,
        duration,
        isClosable,
        status: "warning",
      });
    },
    error: ({ title, description }: UseAppToastOptions) => {
      return toast({
        title,
        description,
        duration,
        isClosable,
        status: "error",
      });
    },
    unexpectedError: () => {
      return toast({
        title: "Error",
        description: "Unexpected error occurred",
        status: "error",
        duration,
        isClosable,
      });
    },
  };
}
