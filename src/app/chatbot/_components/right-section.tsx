"use client";

import React from "react";

import { WalletAddressRequestSchema } from "@/data/schemas/dto";
import { cn, formatZodError } from "@/lib/utils";
import { river, choco, hawk, useCharacterStore } from "@/store/character-store";
import { useCallback, useState } from "react";

const headerBgColorMap = {
  [hawk.name]: "bg-[#FFAFEC]",
  [choco.name]: "bg-[#5DD9C1]",
  [river.name]: "bg-[#FFC75F]",
};

interface RightSectionProps {
  walletAddress: string;
  firstAskQuestion: Promise<string>;
}

export default function RightSection({
  walletAddress,
  firstAskQuestion,
}: RightSectionProps) {
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
    <section className="w-full">
      <div className={cn("p-[2vw]", headerBgColorMap[character.name])}></div>
    </section>
  );
}
