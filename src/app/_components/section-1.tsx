"use client";

import { choco, hawk, river, useCharacterStore } from "@/store/character-store";
import { cn } from "@/utils/classname";
import Image from "next/image";

export const Section1 = () => {
  const { character, setCharacter } = useCharacterStore();

  function getNextOneChar() {
    switch (character.name) {
      case hawk.name: {
        return "/assets/homepage/section-1/chat-choco.png";
      }
      case choco.name: {
        return "/assets/homepage/section-1/chat-hawk.png";
      }
      case river.name: {
        return "/assets/homepage/section-1/chat-choco.png";
      }
      default: {
        return "/assets/homepage/section-1/chat-choco.png";
      }
    }
  }

  function getNextTwoChar() {
    switch (character.name) {
      case hawk.name: {
        return "/assets/homepage/section-1/chat-river.png";
      }
      case choco.name: {
        return "/assets/homepage/section-1/chat-river.png";
      }
      case river.name: {
        return "/assets/homepage/section-1/chat-hawk.png";
      }
      default: {
        return "/assets/homepage/section-1/chat-river.png";
      }
    }
  }

  function nextOneCharClicked() {
    switch (character.name) {
      case hawk.name: {
        setCharacter(choco);
        return;
      }
      case choco.name: {
        setCharacter(hawk);
        return;
      }
      case river.name: {
        setCharacter(choco);
        return;
      }
      default: {
        setCharacter(choco);
        return;
      }
    }
  }

  function nextTwoCharClicked() {
    switch (character.name) {
      case hawk.name: {
        setCharacter(river);
        return;
      }
      case choco.name: {
        setCharacter(river);
        return;
      }
      case river.name: {
        setCharacter(hawk);
        return;
      }
      default: {
        setCharacter(river);
        return;
      }
    }
  }

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
                {
                  "bg-[#D6FF38]": character.name === hawk.name,
                  "bg-[#FF6B6B]": character.name === choco.name,
                  "bg-[#81F495]": character.name === river.name,
                },
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

        <div className="h-full w-[40%] border border-black"></div>
      </div>
    </section>
  );
};
