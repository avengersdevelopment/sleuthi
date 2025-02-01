"use client";

import { choco, hawk, river, useCharacterStore } from "@/store/character-store";
import { useConfig } from "@/store/config";
import { cn } from "@/utils/classname";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationItem {
  title: string;
  link: string;
}

export const navigations: NavigationItem[] = [
  {
    title: "Home",
    link: "/",
  },
  {
    title: "Docs",
    link: "/docs",
  },
  {
    title: "Chatbot",
    link: "/chatbot",
  },
];

export const Header = () => {
  const pathname = usePathname();
  const { character } = useCharacterStore();
  const buyUrl = useConfig()((state) => state.config?.buy_url);

  const buyButton = {
    [hawk.name]: "/assets/homepage/header/btn-buy-hawk.png",
    [choco.name]: "/assets/homepage/header/btn-buy-choco.png",
    [river.name]: "/assets/homepage/header/btn-buy-river.png",
  };

  return (
    <header className="sticky top-0 z-50 flex w-full justify-center rounded-xl border border-black backdrop-blur-sm">
      <div className="flex w-[90vw] items-center justify-between px-[2vw] py-[1vh]">
        <Link href={"/"}>
          <p className="text-2xl font-bold text-black md:text-[1.5vw]">
            sleuthi
          </p>
        </Link>

        <div className="flex items-center gap-[3vw]">
          {navigations.map((navigation, index) => {
            const isActive = pathname === navigation.link;

            return (
              <Link key={index} href={navigation.link}>
                <p
                  className={cn(
                    "text-xs text-black md:text-[1vw]",
                    isActive ? "font-bold" : "font-normal",
                  )}
                >
                  {navigation.title}
                </p>
              </Link>
            );
          })}

          <Link href={buyUrl || ""}>
            <Image
              src={buyButton[character.name]}
              width={480}
              height={480}
              alt=""
              className="h-auto w-[20vw] md:w-[10vw] hover:animate-shake"
            />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
