"use client";
import { ChatMessage } from "@/data/schemas/dto";
import { cn } from "@/lib/utils";
import { choco, hawk, river, useCharacterStore } from "@/store/character-store";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

const chatBgColor = {
  [hawk.name]: "bg-[#D6FF38]",
  [choco.name]: "bg-[#FF6B6B]",
  [river.name]: "bg-[#81F495]",
};

interface ChatItemProps {
  item: ChatMessage;
  isPending: boolean;
}

export default function ChatItem({ item, isPending }: ChatItemProps) {
  const { character } = useCharacterStore();

  if (item?.role === "apiMessage") {
    return (
      <motion.div
        className={cn("flex gap-2", isPending && "animate-pulse")}
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.25,
          ease: "easeOut",
        }}
      >
        <div
          className={cn(
            "max-w-[80%] rounded-[1.2vw] px-2 py-2 md:max-w-[80%] md:px-[1.6vw] md:py-[1.2vw]",
            chatBgColor[character.name],
          )}
        >
          <motion.div
            className="text-sm text-black md:text-[1.2vw]"
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <ReactMarkdown
              remarkPlugins={[gfm]}
              className={cn(
                "prose font-sora max-w-none text-sm text-black md:text-[1.2vw] [&_strong]:text-black",
                item?.error && "text-red-600",
              )}
              components={{
                a: ({ node, ...props }) => (
                  <a target="_blank" rel="noopener noreferrer" {...props} />
                ),
              }}
            >
              {item?.content}
            </ReactMarkdown>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn("flex justify-end gap-2", isPending && "animate-pulse")}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-[1.2vw] px-2 py-2 md:max-w-[80%] md:px-[1.6vw] md:py-[1.2vw]",
          chatBgColor[character.name],
        )}
      >
        <motion.div
          className="text-sm text-black md:text-[1.2vw]"
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <ReactMarkdown
            className={cn(
              "prose font-sora max-w-none text-sm text-black md:text-[1.2vw] [&_strong]:text-black",
              item?.error && "text-red-600",
            )}
            components={{
              a: ({ node, ...props }) => (
                <a target="_blank" rel="noopener noreferrer" {...props} />
              ),
            }}
          >
            {item?.content}
          </ReactMarkdown>
        </motion.div>
      </div>
    </motion.div>
  );
}
