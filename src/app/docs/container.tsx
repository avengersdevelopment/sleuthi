"use client";

import { choco, hawk, river, useCharacterStore } from "@/store/character-store";
import { cn } from "@/utils/classname";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface SidebarItem {
  title: string;
  content: JSX.Element;
}

const sidebarItems: SidebarItem[] = [
  {
    title: "DATA AGGREGATION 1",
    content: (
      <p className="font-inter text-[1.25vw]">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur
        adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
        in reprehenderit in voluptate ve
        <br />
        <br />
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur
        adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
        in reprehenderit in voluptate ve
        <br />
        <br />
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur
        adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
        in reprehenderit in voluptate ve
      </p>
    ),
  },
  {
    title: "DATA AGGREGATION 2",
    content: <p>Lorem</p>,
  },
  {
    title: "DATA AGGREGATION 3",
    content: <p>Lorem</p>,
  },
  {
    title: "DATA AGGREGATION 4",
    content: <p>Lorem</p>,
  },
  {
    title: "DATA AGGREGATION 5",
    content: <p>Lorem</p>,
  },
  {
    title: "DATA AGGREGATION 6",
    content: <p>Lorem</p>,
  },
];

export function Container() {
  const { character } = useCharacterStore();
  const [activeSidebar, setActiveSidebar] = useState<number>(0);

  const sparkAsset = {
    [hawk.name]: "/assets/characters/spark-hawk.png",
    [choco.name]: "/assets/characters/spark-choco.png",
    [river.name]: "/assets/characters/spark-river.png",
  };

  return (
    <main className="h-screen w-full">
      <div className="flex h-full w-full">
        <div className="flex h-full w-[30%] flex-col bg-black">
          <div className="h-[40%] w-full content-center">
            <p className="text-center font-inter text-[3vw] font-bold text-white">
              sleuthi
            </p>
          </div>

          <div className="flex h-full w-full flex-col gap-[1.5vw] px-[2vw]">
            {sidebarItems.map((item, index) => {
              const isActive = activeSidebar === index;

              return (
                <div
                  key={index}
                  className={cn(
                    "w-full cursor-pointer rounded-full bg-white py-[1.5vw] text-center",
                    {
                      "bg-[#D6FF38]": isActive && character.name === hawk.name,
                      "bg-[#FF6B6B]": isActive && character.name === choco.name,
                      "bg-[#81F495]": isActive && character.name === river.name,
                    },
                  )}
                  onClick={() => setActiveSidebar(index)}
                >
                  <p className="text-[1.25vw] font-semibold text-black">
                    {item.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className={cn("flex h-full w-[70%] flex-col", {
            "bg-[#F7F6F2]": character.name === hawk.name,
            "bg-[#FEF8E1]": character.name === choco.name,
            "bg-[#F4EEFE]": character.name === river.name,
          })}
        >
          <div
            className={cn("relative h-[25%] w-full", {
              "bg-[#FFAFEC]": character.name === hawk.name,
              "bg-[#5DD9C1]": character.name === choco.name,
              "bg-[#FFC75F]": character.name === river.name,
            })}
          >
            <Image
              src={"/assets/docs/bg-pattern.png"}
              width={1000}
              height={1000}
              alt=""
              className="h-full w-full"
              priority
            />

            <Link href={"/"}>
              <div className="absolute left-[2vw] top-[1.25vw] flex items-center gap-[1vw] hover:animate-shake">
                <Image
                  src={"/assets/docs/arrow-left.png"}
                  width={480}
                  height={480}
                  alt=""
                  className="h-auto w-[2vw]"
                />

                <p
                  className="mt-[0.25vw] font-avigea text-[1.25vw] font-bold text-black"
                  style={{ lineHeight: 0 }}
                >
                  Back
                </p>
              </div>
            </Link>

            <p className="absolute left-[25vw] top-[6vw] font-avigea text-[2vw] text-black">
              {sidebarItems[activeSidebar].title}
            </p>

            <Image
              src={sparkAsset[character.name]}
              width={480}
              height={480}
              alt=""
              className="absolute bottom-[1.75vw] left-[5vw] h-auto w-[6vw]"
            />

            <Image
              src={sparkAsset[character.name]}
              width={480}
              height={480}
              alt=""
              className="absolute right-[5vw] top-[1.75vw] h-auto w-[6vw]"
            />
          </div>

          <div className="flex h-full w-full flex-col overflow-y-auto p-[2vw]">
            {sidebarItems[activeSidebar].content}
          </div>
        </div>
      </div>
    </main>
  );
}
