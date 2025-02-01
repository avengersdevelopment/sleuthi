"use client";

import { cn } from "@/lib/utils";
import {
  choco,
  hawk,
  ICharacter,
  river,
  useCharacterStore,
} from "@/store/character-store";
import Image from "next/image";

const charBgColor = {
  [hawk.name]: "bg-[#D6FF38]",
  [choco.name]: "bg-[#FF6B6B]",
  [river.name]: "bg-[#81F495]",
};

const heroAsset = {
  [hawk.name]: "/assets/characters/hawk.gif",
  [choco.name]: "/assets/characters/choco.gif",
  [river.name]: "/assets/characters/river.gif",
};

const iconSpark = {
  [hawk.name]: "/assets/characters/spark-hawk.png",
  [choco.name]: "/assets/characters/spark-choco.png",
  [river.name]: "/assets/characters/spark-river.png",
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

interface LeftSectionProps {
  walletAddress: string;
}

export default function LeftSection({ walletAddress }: LeftSectionProps) {
  const { character } = useCharacterStore();

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
    <section
      className={cn("relative h-full w-full overflow-hidden", {
        "bg-[#F7F6F2]": character.name === hawk.name,
        "bg-[#FEF8E1]": character.name === choco.name,
        "bg-[#F4EEFE]": character.name === river.name,
      })}
    >
      <div
        className={cn("h-full w-full")}
        style={{
          backgroundImage: `url(${iconSpark[character.name]})`,
          backgroundSize: "20vw auto",
          backgroundPosition: "-4vw -4vw",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          className={cn("h-full w-full")}
          style={{
            backgroundImage: `url(/assets/chatbot/step.png)`,
            backgroundSize: "12vw auto",
            backgroundPosition: "85% 4vw",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="h-full w-full">
            <div className="flex h-full w-full flex-col items-center justify-center">
              <div className="mb-[4vw]">
                <Image
                  src={heroAsset[character.name]}
                  width={480}
                  height={480}
                  alt=""
                  className="-mt-[4vw] h-auto w-full scale-[1.6]"
                  priority
                />
              </div>
              <div className="mb-[1vw]">
                <p
                  className="font-avigea text-[6vw] text-black"
                  style={{ lineHeight: 1 }}
                >
                  Dr. {character.name}
                </p>
              </div>
              <div className="flex items-center">
                <div
                  className={cn(
                    "rounded-full border-[0.2vw] border-black px-[1.6vw] py-[0.8vw] transition-all hover:opacity-50",
                    charBgColor[character.name],
                  )}
                >
                  <p className="font-inter text-[1.2vw] text-black">{`Chat ${character.name}`}</p>
                </div>
                <div className="w-[1.6vw] border-[0.2vw] border-b border-black" />
                <button
                  className="transition-all hover:scale-125"
                  onClick={() => changeCharacter(getTransition().next)}
                >
                  <Image
                    src={getCharImage("chatOne")}
                    width={480}
                    height={480}
                    alt=""
                    className="h-auto w-[4vw] cursor-pointer"
                  />
                </button>
                <div className="w-[1.6vw] border-[0.2vw] border-b border-black" />
                <button
                  className="transition-all hover:scale-125"
                  onClick={() => changeCharacter(getTransition().nextTwo)}
                >
                  <Image
                    src={getCharImage("chatTwo")}
                    width={480}
                    height={480}
                    alt=""
                    className="h-auto w-[4vw] cursor-pointer"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
