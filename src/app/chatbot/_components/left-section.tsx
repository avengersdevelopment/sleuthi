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

const bgColorMap = {
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

export default function LeftSection() {
  const { character, setCharacter } = useCharacterStore();

  const getTransition = () =>
    characterTransitions[character.name] || defaultTransition;

  const getCharImage = (chatType: "chatOne" | "chatTwo") =>
    `/assets/characters/chat-${getTransition()[chatType]}.png`;

  const changeCharacter = (nextCharacter: ICharacter) => {
    setCharacter(nextCharacter);
    window.location.href = `/chatbot?character=${nextCharacter.name}`;
  };

  return (
    <div
      className={cn("relative h-full w-full overflow-hidden", {
        "bg-[#F7F6F2]": character.name === hawk.name,
        "bg-[#FEF8E1]": character.name === choco.name,
        "bg-[#F4EEFE]": character.name === river.name,
      })}
    >
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="-mb-[2vw]">
          <Image
            src={heroAsset[character.name]}
            width={480}
            height={480}
            alt=""
            className="-mt-[4vw] h-auto w-full"
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
              "rounded-full border-[0.2vw] border-black px-[1.5vw] py-[1vw]",
              bgColorMap[character.name],
            )}
          >
            <p className="font-inter text-[1.8vw] text-black">{`Chat ${character.name}`}</p>
          </div>
          <div className="w-[1.5vw] border-[0.2vw] border-b border-black" />
          <button onClick={() => changeCharacter(getTransition().next)}>
            <Image
              src={getCharImage("chatOne")}
              width={480}
              height={480}
              alt=""
              className="h-auto w-[5vw] cursor-pointer"
            />
          </button>
          <div className="w-[1.5vw] border-[0.2vw] border-b border-black" />
          <button onClick={() => changeCharacter(getTransition().nextTwo)}>
            <Image
              src={getCharImage("chatTwo")}
              width={480}
              height={480}
              alt=""
              className="h-auto w-[5vw] cursor-pointer"
            />
          </button>
        </div>
      </div>
      <div className="absolute left-[-4vw] top-[-4vw]">
        <Image
          src={iconSpark[character.name]}
          width={480}
          height={480}
          alt=""
          className="h-auto w-[20vw]"
        />
      </div>
      <div className="absolute right-[4vw] top-[4vw]">
        <Image
          src={"/assets/chatbot/step.png"}
          width={480}
          height={480}
          alt=""
          className="h-auto w-[12vw]"
        />
      </div>
    </div>
  );
}
