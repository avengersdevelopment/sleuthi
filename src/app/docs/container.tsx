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

const bgColors = {
  header: {
    [hawk.name]: "bg-[#FFAFEC]",
    [choco.name]: "bg-[#5DD9C1]",
    [river.name]: "bg-[#FFC75F]",
  },
  content: {
    [hawk.name]: "bg-[#F7F6F2]",
    [choco.name]: "bg-[#FEF8E1]",
    [river.name]: "bg-[#F4EEFE]",
  },
  active: {
    [hawk.name]: "bg-[#D6FF38]",
    [choco.name]: "bg-[#FF6B6B]",
    [river.name]: "bg-[#81F495]",
  },
};

export function Container() {
  const { character } = useCharacterStore();
  const [activeSidebar, setActiveSidebar] = useState<number>(0);

  const sparkAsset = {
    [hawk.name]: "/assets/characters/spark-hawk.png",
    [choco.name]: "/assets/characters/spark-choco.png",
    [river.name]: "/assets/characters/spark-river.png",
  };

  const renderSidebarItem = (item: SidebarItem, index: number) => {
    const isActive = activeSidebar === index;
    return (
      <div
        key={index}
        className={cn(
          "w-full cursor-pointer rounded-full bg-white py-[1.5vw] text-center",
          { [bgColors.active[character.name]]: isActive },
        )}
        onClick={() => setActiveSidebar(index)}
      >
        <p className="text-[8px] md:text-[1.25vw] font-semibold text-black">{item.title}</p>
      </div>
    );
  };

  const renderBackButton = () => (
    <Link href="/">
      <div className="absolute left-[2vw] top-[2.5vw] flex items-center gap-[1vw] hover:animate-shake md:left-[2vw] md:top-[1.25vw]">
        <Image
          src="/assets/docs/arrow-left.png"
          width={480}
          height={480}
          alt=""
          className="h-auto w-[4vw] md:w-[2vw]"
        />
        <p
          className="mt-[0.25vw] font-avigea text-xs font-bold text-black md:text-[1.25vw]"
          style={{ lineHeight: 0 }}
        >
          Back
        </p>
      </div>
    </Link>
  );

  const renderSparkImage = (position: "left" | "right") => (
    <Image
      src={sparkAsset[character.name]}
      width={480}
      height={480}
      alt=""
      className={cn("absolute h-auto w-[6vw]", {
        "bottom-[1.75vw] left-[5vw]": position === "left",
        "right-[5vw] top-[1.75vw]": position === "right",
      })}
    />
  );

  return (
    <main className="h-screen w-full">
      <div className="flex h-full w-full">
        <div className="hidden h-full w-[30%] flex-col bg-black md:flex">
          <div className="h-[40%] w-full content-center">
            <p className="text-center font-inter text-[3vw] font-bold text-white">
              sleuthi
            </p>
          </div>

          <div className="flex h-full w-full flex-col gap-[1.5vw] px-[2vw]">
            {sidebarItems.map(renderSidebarItem)}
          </div>
        </div>

        <div
          className={cn(
            "flex h-full w-full flex-col md:w-[70%]",
            bgColors.content[character.name],
          )}
        >
          <div
            className={cn(
              "relative h-[15%] w-full md:h-[25%]",
              bgColors.header[character.name],
            )}
          >
            <Image
              src="/assets/docs/bg-pattern.png"
              width={1000}
              height={1000}
              alt=""
              className="h-full w-full"
              priority
            />

            {renderBackButton()}

            <p className="absolute left-[36vw] top-[12vw] font-avigea text-[12px] text-black md:left-[25vw] md:top-[6vw] md:text-[2vw]">
              {sidebarItems[activeSidebar].title}
            </p>

            {renderSparkImage("left")}
            {renderSparkImage("right")}
          </div>

          <div className="flex h-full w-full flex-col overflow-y-auto p-[2vw] gap-[2vw]">
            <div className="grid w-full grid-cols-3 md:hidden gap-2">
              {sidebarItems.map(renderSidebarItem)}
            </div>
            {sidebarItems[activeSidebar].content}
          </div>
        </div>
      </div>
    </main>
  );
}
