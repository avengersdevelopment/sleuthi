"use client";

import { choco, hawk, river, useCharacterStore } from "@/store/character-store";
import { cn } from "@/utils/classname";
import Image from "next/image";

export const Section2 = () => {
  const { character } = useCharacterStore();

  const getAssetPath = (
    type: "item" | "pattern",
    id?: number,
    side?: "left" | "right",
  ) => {
    const base = `/assets/homepage/section-2`;
    const suffix = character.name.toLowerCase();

    if (type === "item") {
      return `${base}/item-${id}-${suffix}.png`;
    }
    return `${base}/pattern-${side}-${suffix}.png`;
  };

  const getBgColor = (type: "header" | "card") => {
    const colors = {
      header: {
        [hawk.name]: "bg-[#FFAFEC]",
        [choco.name]: "bg-[#5DD9C1]",
        [river.name]: "bg-[#FFC75F]",
      },
      card: {
        [hawk.name]: "bg-[#F7F6F2]",
        [choco.name]: "bg-[#FFF8E1]",
        [river.name]: "bg-[#F4EEFF]",
      },
    };
    return colors[type][character.name] || colors[type][hawk.name];
  };

  const ServiceCard = ({ id }: { id: number }) => (
    <div
      className={cn(
        "flex h-full flex-col items-center rounded-3xl border-[0.25vw] border-black px-[2vw] py-[1.5vw]",
        getBgColor("card"),
      )}
    >
      <Image
        src={getAssetPath("item", id)}
        width={480}
        height={480}
        alt=""
        className="mb-[2vw] h-auto w-[15vw]"
        priority
      />

      <p
        className="font-avigea mb-[1vw] text-center text-[2vw] text-black"
        style={{ lineHeight: 1 }}
      >
        DYNAMIC TICKER DATA AGGREGATION
      </p>

      <p
        className="font-inter text-center text-[1vw] text-black"
        style={{ lineHeight: 1 }}
      >
        Blade distills the strategies of the top 100 elite traders into
      </p>
    </div>
  );

  const ServiceCard2 = ({ id }: { id: number }) => (
    <div
      className={cn(
        "flex h-full items-center rounded-3xl border-[0.25vw] border-black px-[2vw] py-[1.5vw]",
        getBgColor("card"),
      )}
    >
      <Image
        src={getAssetPath("item", id)}
        width={480}
        height={480}
        alt=""
        className="h-auto w-[14vw] mr-[1vw]"
        priority
      />

      <div className="flex w-full flex-col">
        <p
          className="font-avigea text-[2vw] text-black mb-[2vw]"
          style={{ lineHeight: 1 }}
        >
          DYNAMIC TICKER DATA AGGREGATION
        </p>

        <p
          className="font-inter text-[1vw] text-black"
          style={{ lineHeight: 1 }}
        >
          Blade distills the strategies of the top 100 elite traders into
        </p>
      </div>
    </div>
  );

  return (
    <section className="flex h-full w-full justify-center bg-black pb-[4vw]">
      <div className="flex flex-col items-center">
        <div className={cn("flex h-full w-full", getBgColor("header"))}>
          <Image
            src={getAssetPath("pattern", undefined, "left")}
            width={480}
            height={480}
            alt=""
            className="h-auto w-[35vw]"
          />

          <div className="flex w-[30vw] justify-center">
            <p
              className="font-avigea mt-[3vw] text-center text-[5vw] text-black"
              style={{ lineHeight: 1 }}
            >
              Our Tech
              <br />
              Services
            </p>
          </div>

          <Image
            src={getAssetPath("pattern", undefined, "right")}
            width={480}
            height={480}
            alt=""
            className="h-auto w-[35vw]"
          />
        </div>

        <div className="-mt-[14vw] mb-[2vw] grid w-[80vw] grid-cols-3 gap-x-[2vw]">
          {[1, 2, 3].map((id) => (
            <ServiceCard key={id} id={id} />
          ))}
        </div>

        <div className="grid w-[80vw] grid-cols-2 gap-x-[2vw]">
          {[4, 5].map((id) => (
            <ServiceCard2 key={id} id={id} />
          ))}
        </div>
      </div>
    </section>
  );
};
