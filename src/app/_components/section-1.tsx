"use client";

import { choco, hawk, river, useCharacterStore } from "@/store/character-store";
import { cn } from "@/utils/classname";
import Image from "next/image";
import Link from "next/link";

export const Section1 = () => {
  const { character, setCharacter } = useCharacterStore();

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

  const defaultTransition = {
    next: choco,
    nextTwo: river,
    chatOne: "choco",
    chatTwo: "river",
  };

  const getTransition = () =>
    characterTransitions[character.name] || defaultTransition;

  const getNextOneChar = () =>
    `/assets/characters/chat-${getTransition().chatOne}.png`;
  const getNextTwoChar = () =>
    `/assets/characters/chat-${getTransition().chatTwo}.png`;

  const nextOneCharClicked = () => setCharacter(getTransition().next);
  const nextTwoCharClicked = () => setCharacter(getTransition().nextTwo);

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

  return (
    <section className={cn(`flex h-full w-full justify-center py-[10%] overflow-hidden`)}>
      <div className="relative flex md:flex-row items-center flex-col h-full w-[90vw]">
        <p className="absolute -left-[2.5vw] -top-[2vw] -rotate-[25deg] font-arkipelago text-[3vw] text-black">
          Whats up...
        </p>

        <Image
          src={"/assets/homepage/section-1/icon-star.png"}
          width={480}
          height={480}
          alt=""
          className="absolute -right-[3.5vw] -top-[3vw] h-auto w-[8vw] md:block hidden"
          priority
        />

        <div className="flex h-full w-[80vw] md:w-[60%] flex-col justify-between pt-[4vw] z-50">
          <div className="flex w-full flex-col">
            <p
              className="font-avigea text-5xl md:text-[8vw] text-black"
              style={{ lineHeight: 1 }}
            >
              Hello I&apos;m
              <br />
              sleuthi
            </p>
            <p
              className="w-[80%] font-inter text-xs mb-[2vw] md:text-[1.5vw] text-black"
              style={{ lineHeight: 1.2 }}
            >
              {`Hey, I'm ${character.name}! Your friendly AI assistant, ready to fetch
            info with a smile! Let's get chatting!`}
            </p>
          </div>

          <div className="flex items-center">
            <Link href={"/chatbot"}>
              <div
                className={cn(
                  "rounded-full border-[0.25vw] border-black px-[1.5vw] py-[1vw] hover:animate-shake",
                  bgColorMap[character.name],
                )}
              >
                <p className="font-inter text-[2vw] text-black">{`Chat ${character.name}`}</p>
              </div>
            </Link>
            <div className="w-[2vw] border-[0.25vw] border-b border-black" />
            <Image
              src={getNextOneChar()}
              width={480}
              height={480}
              alt=""
              className="h-auto w-[6vw] cursor-pointer"
              onClick={nextOneCharClicked}
            />
            <div className="w-[2vw] border-[0.25vw] border-b border-black" />
            <Image
              src={getNextTwoChar()}
              width={480}
              height={480}
              alt=""
              className="h-auto w-[6vw] cursor-pointer"
              onClick={nextTwoCharClicked}
            />
          </div>
        </div>

        <div className="h-full w-[40%] md:mt-0 mt-[5vh] z-40">
          <Image
            src={heroAsset[character.name]}
            width={480}
            height={480}
            alt=""
            className="-mt-[4vw] h-auto w-full md:scale-150 scale-[3]"
            priority
          />
        </div>
      </div>
    </section>
  );
};
