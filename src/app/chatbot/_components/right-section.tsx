"use client";

import { WalletAddressRequestSchema } from "@/data/schemas/dto";
import { cn, formatZodError } from "@/lib/utils";
import {
  choco,
  hawk,
  ICharacter,
  river,
  useCharacterStore,
} from "@/store/character-store";
import { InitiatePredictionResponse } from "@/types";
import { AnimatePresence } from "framer-motion";
import {
  ArrowBigUpIcon,
  ChevronLeftIcon,
  Loader2Icon,
  WalletIcon,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import ChatList from "./chat-list";

const headerBgColor = {
  [hawk.name]: "bg-[#FFAFEC]",
  [choco.name]: "bg-[#5DD9C1]",
  [river.name]: "bg-[#FFC75F]",
};

const charBgColor = {
  [hawk.name]: "bg-[#D6FF38]",
  [choco.name]: "bg-[#FF6B6B]",
  [river.name]: "bg-[#81F495]",
};

const defaultTransition = {
  next: choco,
  nextTwo: river,
  chatOne: "choco",
  chatTwo: "river",
};

const characterTransitions = {
  [hawk.name]: {
    next: choco,
    nextTwo: river,
    chatOne: "choco",
    chatTwo: "river",
  },
  [choco.name]: {
    next: hawk,
    nextTwo: river,
    chatOne: "hawk",
    chatTwo: "river",
  },
  [river.name]: {
    next: choco,
    nextTwo: hawk,
    chatOne: "choco",
    chatTwo: "hawk",
  },
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

  const getTransition = () =>
    characterTransitions[character.name] || defaultTransition;

  const getCharImage = (chatType: "chatOne" | "chatTwo") =>
    `/assets/characters/chat-${getTransition()[chatType]}.png`;

  const changeCharacter = (nextCharacter: ICharacter) => {
    const currentCharacter = JSON.parse(
      localStorage.getItem("character-storage") || "{}",
    );

    const updatedCharacter = {
      ...currentCharacter,
      state: {
        ...currentCharacter.state,
        character: nextCharacter,
      },
    };

    localStorage.setItem("character-storage", JSON.stringify(updatedCharacter));

    window.location.href = `/chatbot?character=${nextCharacter.name}&walletAddress=${walletAddress}`;
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
          <div className="mb-4 flex items-center justify-between gap-4 md:mb-[2vw]">
            <div>
              <Link href="/">
                <button className="flex items-center gap-2 py-2 md:gap-[0.5vw] md:px-[2vw] md:py-[0.5vw]">
                  <ChevronLeftIcon className="h-[16px] w-auto md:h-[1.2vw]" />
                  <p className="font-avigea text-sm font-bold text-black md:text-[1.2vw]">
                    Back
                  </p>
                </button>
              </Link>
            </div>

            <div className="flex items-center md:hidden">
              <div
                className={cn(
                  "border-1 rounded-full border-black px-4 py-2 transition-all hover:opacity-50",
                  charBgColor[character.name],
                )}
              >
                <p className="font-inter text-sm text-black">{`Chat ${character.name}`}</p>
              </div>
              <div className="w-2 border-2 border-b border-black" />
              <button
                className="transition-all hover:scale-125"
                onClick={() => changeCharacter(getTransition().next)}
              >
                <Image
                  src={getCharImage("chatOne")}
                  width={480}
                  height={480}
                  alt=""
                  className="h-auto w-8 cursor-pointer"
                />
              </button>
              <div className="w-2 border-2 border-b border-black" />
              <button
                className="transition-all hover:scale-125"
                onClick={() => changeCharacter(getTransition().nextTwo)}
              >
                <Image
                  src={getCharImage("chatTwo")}
                  width={480}
                  height={480}
                  alt=""
                  className="h-auto w-8 cursor-pointer"
                />
              </button>
            </div>
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
            <div className="absolute left-4 top-3 md:left-[1.6vw] md:top-[1.2vw]">
              <WalletIcon className="h-[16px] w-auto text-black md:h-[1.6vw]" />
            </div>
            <AnimatePresence>
              {walletAddress && !isLoading && !isResolvingENS && (
                <div className="absolute right-4 top-3 transition-all hover:opacity-50 md:right-[1.6vw] md:top-[1.2vw]">
                  <button onClick={clearWalletAddress}>
                    <XIcon className="h-[16px] w-auto text-black md:h-[1.6vw]" />
                  </button>
                </div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {(isLoading || isResolvingENS) && (
                <div className="absolute right-4 top-3 transition-all hover:opacity-50 md:right-[1.6vw] md:top-[1.2vw]">
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
            className="group flex min-h-10 min-w-10 items-center justify-center rounded-full border border-[#FFFFFF]/25 bg-gradient-to-b from-[#0D0D0D] to-[#1F1F1F] transition-all hover:opacity-50 disabled:opacity-75 md:h-[4vw] md:w-[4vw]"
            disabled={!walletAddress || isLoadingChat}
          >
            <ArrowBigUpIcon className="h-4 w-auto text-white transition-all group-hover:rotate-90 md:h-[1.6vw]" />
          </button>
        </form>
      </div>
    </section>
  );
}
