"use client";

import { choco, hawk, river, useCharacterStore } from "@/store/character-store";
import { cn } from "@/utils/classname";
import Image from "next/image";
import Link from "next/link";
import { navigations } from "./header";
import { usePathname } from "next/navigation";
import { useConfig } from "@/store/config";

export const Footer = () => {
  const pathname = usePathname();
  const { character } = useCharacterStore();

  const xCoinUrl = useConfig()((state) => state.config?.x_coin_url);

  const iconSpark = {
    [hawk.name]: "/assets/characters/spark-hawk.png",
    [choco.name]: "/assets/characters/spark-choco.png",
    [river.name]: "/assets/characters/spark-river.png",
  };

  return (
    <footer className="flex h-full w-full justify-center bg-black pb-[3vw]">
      <div
        className={cn(
          "flex h-full w-[90vw] overflow-hidden items-center rounded-3xl py-[0.5vw]",
          {
            "bg-[#FFAFEC]": character.name === hawk.name,
            "bg-[#5DD9C1]": character.name === choco.name,
            "bg-[#FFC75F]": character.name === river.name,
          },
        )}
      >
        <Image
          src={iconSpark[character.name]}
          width={480}
          height={480}
          alt=""
          className="-ml-[7vw] mr-[4vw] h-auto w-[15vw]"
        />

        <div className="flex h-full w-min flex-col justify-center mr-[3vw]">
          <div className="flex w-full items-center gap-[2vw]">
            <p className="font-inter text-[3vw] font-bold text-black">
              sleuthi
            </p>
            <div className="w-full border-b-[0.25vw] border-black" />
          </div>

          <div className="mb-[2vw] flex gap-[3vw]">
            {navigations.map((navigation, index) => {
              const isActive = pathname === navigation.link;

              return (
                <Link key={index} href={navigation.link}>
                  <p
                    className={cn(
                      "text-[1.5vw] text-black",
                      isActive ? "font-bold" : "font-normal",
                    )}
                  >
                    {navigation.title}
                  </p>
                </Link>
              );
            })}
          </div>

          <Link href={xCoinUrl || ""}>
            <Image
              src={"/assets/homepage/footer/btn-x.png"}
              width={480}
              height={480}
              alt=""
              className="h-auto w-[4vw] hover:animate-shake"
              priority
            />
          </Link>
        </div>

        <Image
          src={"/assets/homepage/footer/paw.png"}
          width={800}
          height={800}
          alt=""
          className="h-auto w-full mr-[2vw]"
          priority
        />
      </div>
    </footer>
  );
};

export default Footer;
