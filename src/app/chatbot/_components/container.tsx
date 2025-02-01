"use client";

import { WalletAddressRequestSchema } from "@/data/schemas/dto";
import { formatZodError } from "@/lib/utils";
import { useCharacterStore } from "@/store/character-store";
import { useCallback, useState } from "react";
import LeftSection from "./left-section";

interface ContainerProps {
  walletAddress: string;
  firstAskQuestion: Promise<string>;
}

export default function Container({
  walletAddress,
  firstAskQuestion,
}: ContainerProps) {
  const { character } = useCharacterStore();

  const [inputWalletAddress, setInputWalletAddress] = useState<string>(
    walletAddress ?? "",
  );

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isResolvingENS, setIsResolvingENS] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingChat, setIsLoadingChat] = useState<boolean>(false);

  const [inputMessage, setInputMessage] = useState<string>("");
  const [quickSelect, setQuickSelect] = useState<string | null>(null);

  const validateWalletAddress = useCallback(async () => {
    try {
      setIsLoading(true);

      const validate = WalletAddressRequestSchema.safeParse({
        walletAddress: inputWalletAddress,
      });

      if (!validate?.success) {
        setErrorMessage(formatZodError(validate?.error).details?.[0].message);
        setIsLoading(false);
        return;
      }

      window.location.href = `/chatbot?walletAddress=${validate.data.walletAddress}&character=${character.name}`;
    } catch (error) {
      setErrorMessage("Failed to resolve ENS name");
      setIsLoading(false);
    } finally {
      setIsResolvingENS(false);
    }
  }, [inputWalletAddress, character]);

  const clearWalletAddress = () => {
    setIsLoading(true);
    setInputWalletAddress("");
    setErrorMessage(null);

    window.location.href = `/chatbot?character=${character.name}`;
  };

  return (
    <section className="h-screen w-full">
      <div className="flex h-full w-full">
        <div className="grid h-full w-full grid-cols-2">
          <div className="col-span-2 h-full w-full md:col-span-1">
            <LeftSection />
          </div>
        </div>
      </div>
    </section>
  );
}
