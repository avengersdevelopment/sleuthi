"use client";

import { hawk, choco, river } from "@/store/character-store";
import { useCharacterStore } from "@/store/character-store";
import { cn } from "@/utils/classname";
import Image from "next/image";
import React from "react";
import Marquee, { MarqueeProps } from "react-fast-marquee";

interface RunningTextProps {
  image?: JSX.Element;
  coinName: string;
  count: number;
  marqueProps?: MarqueeProps;
}

export default function RunningText({
  image,
  marqueProps,
  coinName,
  count,
}: RunningTextProps) {
  const { character } = useCharacterStore();

  return (
    <div className="z-40 w-full">
      <Marquee
        className={cn("border-y-[0.15vw] border-black py-6", {
          "bg-[#D6FF38]": character.name === hawk.name,
          "bg-[#FF6B6B]": character.name === choco.name,
          "bg-[#81F495]": character.name === river.name,
        })}
        {...marqueProps}
      >
        {Array.from({ length: count }).map((_, index) => (
          <div className="flex items-center gap-[2vw] pr-[2vw]" key={index}>
            {image}
            <h2 className="text-[2vw] font-bold text-black">{coinName}</h2>
          </div>
        ))}
      </Marquee>
    </div>
  );
}
