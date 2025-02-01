"use client";

import { InitiatePredictionResponse } from "@/app/types";
import { ChatMessage } from "@/data/schemas/dto";
import {
  Fragment,
  use,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import ChatItem from "./chat-item";

interface ChatListProps {
  walletAddress: string;
  firstAskQuestion: Promise<InitiatePredictionResponse>;
  errorMessage: string | null;
  quickSelect: string | null;
  setQuickSelect: (value: string) => void;
  isLoadingChat: boolean;
  setIsLoadingChat: (value: boolean) => void;
}

export default function ChatList({
  walletAddress,
  firstAskQuestion,
  errorMessage,
  quickSelect,
  setQuickSelect,
  setIsLoadingChat,
}: ChatListProps) {
  const firstAskQuestionResponse = use(firstAskQuestion);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const finishRef = useRef<HTMLDivElement | null>(null);

  const [isPending, startTransition] = useTransition();

  const [messages, setMessages] = useState<ChatMessage[]>([
    ...(firstAskQuestionResponse
      ? [
          {
            role: "apiMessage",
            content: firstAskQuestionResponse?.text,
            error: false,
            timestamp: new Date(),
          } as ChatMessage,
        ]
      : []),
  ]);

  const handleSubmit = async (messageOverride?: string) => {
    const messageToSubmit = messageOverride || "";

    setMessages((prev) => [
      ...prev,
      {
        role: "userMessage",
        content: messageToSubmit,
        error: false,
        timestamp: new Date(),
      },
    ]);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "apiMessage",
          content: "Thinking...",
          error: false,
          timestamp: new Date(),
        },
      ]);
    }, 200);

    startTransition(async () => {
      try {
        if (!walletAddress) return;

        const response = await fetch("/ask-question", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: messageToSubmit,
            character: localStorage.getItem("currentChar") + "_Blade",
            walletAddress,
            sessionId: firstAskQuestionResponse.sessionId,
            history: messages.slice(-4).map((message) => ({
              role: message.role,
              content: message.content,
            })),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch response");
        }

        const reader = response.body?.getReader();
        if (!reader) {
          return;
        }

        const decoder = new TextDecoder();
        let data = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          const decodedChunk = decoder.decode(value);
          data += decodedChunk;

          setMessages((prev) => [
            ...prev.slice(0, -1),
            {
              role: "apiMessage",
              content: data,
              error: false,
              timestamp: new Date(),
            },
          ]);
        }
      } catch (error) {
        setMessages((prev) => [
          ...prev.slice(0, -1),
          {
            role: "apiMessage",
            content: "Sorry, Sleuthi AI is busy. Please try again.",
            error: true,
            timestamp: new Date(),
          },
        ]);
      } finally {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }
    });
  };

  useEffect(() => {
    finishRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [walletAddress]);

  useEffect(() => {
    if (errorMessage) {
      setMessages([
        {
          role: "apiMessage",
          content: errorMessage,
          error: true,
          timestamp: new Date(),
        },
      ]);
    }
  }, [errorMessage, walletAddress]);

  useEffect(() => {
    if (quickSelect) {
      handleSubmit(quickSelect);
    }

    setQuickSelect("");
  }, [quickSelect]);

  useEffect(() => {
    if (isPending) {
      setIsLoadingChat(true);
    } else {
      setIsLoadingChat(false);
    }
  }, [isPending]);

  return (
    <div className="h-[calc(100%-12vw)] w-full">
      <div className="h-full w-full overflow-y-hidden">
        <div className="h-full overflow-y-auto px-[1.6vw] pb-[4vw]">
          <div className="flex flex-col gap-[0.8vw] py-[1.6vw]">
            {messages?.map((item, index) => (
              <Fragment key={index}>
                <ChatItem item={item} isPending={isPending} />
              </Fragment>
            ))}
          </div>
          <div ref={finishRef} />
        </div>
      </div>
    </div>
  );
}
