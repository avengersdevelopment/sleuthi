"use client";

import { choco, hawk, river, useCharacterStore } from "@/store/character-store";
import { cn } from "@/utils/classname";
import Image from "next/image";

export const Section1 = () => {
  const { character, setCharacter } = useCharacterStore();

  const characterTransitions = {
    [hawk.name]: { next: choco, nextTwo: river, chatOne: "choco", chatTwo: "river" },
    [choco.name]: { next: hawk, nextTwo: river, chatOne: "hawk", chatTwo: "river" },
    [river.name]: { next: choco, nextTwo: hawk, chatOne: "choco", chatTwo: "hawk" },
  };

  const defaultTransition = { next: choco, nextTwo: river, chatOne: "choco", chatTwo: "river" };

  const getTransition = () => characterTransitions[character.name] || defaultTransition;

  const getNextOneChar = () => `/assets/homepage/section-1/chat-${getTransition().chatOne}.png`;
  const getNextTwoChar = () => `/assets/homepage/section-1/chat-${getTransition().chatTwo}.png`;
  
  const nextOneCharClicked = () => setCharacter(getTransition().next);
  const nextTwoCharClicked = () => setCharacter(getTransition().nextTwo);

  const bgColorMap = {
    [hawk.name]: "bg-[#D6FF38]",
    [choco.name]: "bg-[#FF6B6B]",
    [river.name]: "bg-[#81F495]",
  };

  return (
    <section
      className={cn(`flex h-screen w-full justify-center pb-[10%] pt-[5%]`)}
    >
      <div className="relative flex h-full w-[90vw]">
        <p className="font-arkipelago absolute -left-[2.5vw] -top-[2vw] -rotate-[25deg] text-[3vw] text-black">
          Whats up...
        </p>

        <Image
          src={"/assets/homepage/section-1/icon-star.png"}
          width={480}
          height={480}
          alt=""
          className="absolute -right-[3.5vw] -top-[3vw] h-auto w-[8vw]"
          priority
        />

        <div className="flex h-full w-[60%] flex-col justify-between pt-[4vw]">
          <div className="flex w-full flex-col">
            <p
              className="font-avigea text-[8vw] text-black"
              style={{ lineHeight: 1 }}
            >
              Hello I&apos;m
              <br />
              sleuthi
            </p>
            <p
              className="font-inter w-[80%] text-[1.5vw] text-black"
              style={{ lineHeight: 1.2 }}
            >
              {`Hey, I'm ${character.name}! Your friendly AI assistant, ready to fetch
            info with a smile! Let's get chatting!`}
            </p>
          </div>

          <div className="flex items-center">
            <div
              className={cn(
                "rounded-full border-[0.25vw] border-black px-[1.5vw] py-[1vw]",
                bgColorMap[character.name]
              )}
            >
              <p className="font-inter text-[2vw] text-black">{`Chat ${character.name}`}</p>
            </div>
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

        <div className="h-full w-[40%] border border-black">
          {/* CHARACTER */}
        </div>
      </div>
    </section>
  );
};
