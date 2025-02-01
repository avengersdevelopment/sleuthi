"use client";

import { WalletAddressRequestSchema } from "@/data/schemas/dto";
import { cn, formatZodError } from "@/lib/utils";
import { choco, hawk, river, useCharacterStore } from "@/store/character-store";
import { InitiatePredictionResponse } from "@/types";
import { AnimatePresence } from "framer-motion";
import {
  ArrowBigUpIcon,
  ChevronLeftIcon,
  Loader2Icon,
  WalletIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import ChatList from "./chat-list";

const headerBgColor = {
  [hawk.name]: "bg-[#FFAFEC]",
  [choco.name]: "bg-[#5DD9C1]",
  [river.name]: "bg-[#FFC75F]",
};

interface RightSectionProps {
  walletAddress: string;
  firstAskQuestion: Promise<InitiatePredictionResponse>;
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
    <section className="relative h-screen w-full bg-black">
      <div
        className={cn(
          "bg-[url('/assets/chatbot/line.png')] bg-cover bg-center bg-no-repeat p-4 md:px-[1.6vw] md:py-[1.2vw]",
          headerBgColor[character.name],
        )}
      >
        <div>
          <div className="mb-4 md:mb-[2vw]">
            <Link href="/">
              <button className="flex items-center gap-2 px-4 py-2 md:gap-[0.5vw] md:px-[2vw] md:py-[0.5vw]">
                <ChevronLeftIcon className="h-[16px] w-auto md:h-[1.2vw]" />
                <p className="font-avigea text-sm font-bold text-black md:text-[1.2vw]">
                  Back
                </p>
              </button>
            </Link>
          </div>
          <div className="relative w-full">
            <input
              type="text"
              placeholder="enter your solana wallet address..."
              className="w-full rounded-full bg-[#F7F6F2] px-10 py-2.5 text-sm placeholder:text-black focus:outline-none disabled:opacity-75 md:px-[4vw] md:py-[1.2vw] md:text-[1.2vw]"
              value={inputWalletAddress || walletAddress}
              disabled={isLoading || isResolvingENS || !!walletAddress}
              onChange={(e) => setInputWalletAddress(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  validateWalletAddress();
                }
              }}
            />
            <div className="absolute left-4 top-3 md:left-[1.6vw] md:top-[1.4vw]">
              <WalletIcon className="h-[16px] w-auto text-black md:h-[1.6vw]" />
            </div>
            <AnimatePresence>
              {walletAddress && !isLoading && !isResolvingENS && (
                <div className="absolute right-4 top-3 md:right-[1.6vw] md:top-[1.4vw]">
                  <button onClick={clearWalletAddress}>
                    <XIcon className="h-[16px] w-auto text-black md:h-[1.6vw]" />
                  </button>
                </div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {(isLoading || isResolvingENS) && (
                <div className="absolute right-4 top-3 md:right-[1.6vw] md:top-[1.4vw]">
                  <Loader2Icon className="h-[16px] w-auto animate-spin text-black md:h-[1.6vw]" />
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <ChatList
        walletAddress={walletAddress}
        firstAskQuestion={firstAskQuestion}
        errorMessage={errorMessage}
        quickSelect={quickSelect}
        setQuickSelect={setQuickSelect}
        isLoadingChat={isLoadingChat}
        setIsLoadingChat={setIsLoadingChat}
      />
      <div className="absolute bottom-0 left-0 z-20 w-full">
        <form
          onSubmit={(e) => {
            e.preventDefault();

            setQuickSelect(inputMessage);
            setInputMessage("");
          }}
          className="flex items-center gap-2 p-4"
        >
          <input
            type="text"
            placeholder="ask me anything..."
            className="form- w-full rounded-full bg-[#F7F6F2] px-4 py-2.5 text-sm placeholder:text-black focus:outline-none disabled:opacity-75 md:w-[calc(100%-4vw)] md:px-[2vw] md:py-[1.2vw] md:text-[1.2vw]"
            disabled={!walletAddress || isLoadingChat}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <button
            type="submit"
            className="flex min-h-10 min-w-10 items-center justify-center rounded-full border border-[#FFFFFF]/25 bg-gradient-to-b from-[#0D0D0D] to-[#1F1F1F] disabled:opacity-75 md:h-[4vw] md:w-[4vw]"
            disabled={!walletAddress || isLoadingChat}
          >
            <ArrowBigUpIcon className="h-4 w-auto text-white md:h-[1.6vw]" />
          </button>
        </form>
      </div>
    </section>
  );
}
