"use client";

import Header from "@/components/header";
import { Section1 } from "@/app/_components/section-1";
import { Section2 } from "@/app/_components/section-2";
import { Section3 } from "@/app/_components/section-3";
import { Section4 } from "@/app/_components/section-4";
import Footer from "@/components/footer";
import RunningText from "@/components/running-text";
import Image from "next/image";
import { useConfig } from "@/store/config";
import { choco, hawk, river, useCharacterStore } from "@/store/character-store";
import { cn } from "@/utils/classname";

export default function Container() {
  // Example useConfig :
  // const xCoinUrl = useConfig()((state) => state.config.x_coin_url);
  // const buyUrl = useConfig()((state) => state.config.buy_url);
  const { character } = useCharacterStore();

  return (
    <main
      className={cn("relative h-full w-full", {
        "bg-[#F7F6F2]": character.name === hawk.name,
        "bg-[#FEF8E1]": character.name === choco.name,
        "bg-[#F4EEFE]": character.name === river.name,
      })}
    >
      <Header />
      <Section1 />
      <RunningText
        marqueProps={{ direction: "right" }}
        image={
          <Image
            src={"/assets/homepage/running-text/paw.png"}
            width={480}
            height={480}
            alt=""
            className="h-auto w-[2vw]"
          />
        }
        coinName="sleuthi"
        count={100}
      />
      <Section2 />
      <Footer />
    </main>
  );
}
