"use client";

import { cn } from "@/utils/classname";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Loading = ({ children }: { children: React.ReactNode }) => {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 4) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  if (progress === 4) {
    return children;
  }

  return (
    <>
      <section className="fixed left-0 top-0 z-[100] h-screen w-full">
        <div className="h-full w-full bg-black">
          <div className="flex h-full w-full flex-col items-center justify-center">
            <div className="mb-[2vw] flex items-center gap-4">
              <div
                className={cn(
                  progress >= 1 ? "opacity-100" : "opacity-0",
                  "transition-opacity",
                )}
              >
                <Image
                  src={"/assets/loading/step.png"}
                  width={480}
                  height={480}
                  alt=""
                  className="h-[8vw] w-auto"
                />
              </div>
              <div
                className={cn(
                  progress >= 2 ? "opacity-75" : "opacity-0",
                  "transition-opacity",
                )}
              >
                <Image
                  src={"/assets/loading/step.png"}
                  width={480}
                  height={480}
                  alt=""
                  className="h-[8vw] w-auto"
                />
              </div>
              <div
                className={cn(
                  progress >= 3 ? "opacity-50" : "opacity-0",
                  "transition-opacity",
                )}
              >
                <Image
                  src={"/assets/loading/step.png"}
                  width={480}
                  height={480}
                  alt=""
                  className="h-[8vw] w-auto"
                />
              </div>
            </div>
            <div className="rounded-full bg-white px-[1.6vw] py-[0.8vw]">
              <p className="text-[1.2vw] font-normal text-black">
                Almost there... Hang on!
              </p>
            </div>
          </div>
        </div>
      </section>
      {children}
    </>
  );
};

export default Loading;
