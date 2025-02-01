"use client";

import { InitiatePredictionResponse } from "@/types";
import LeftSection from "./left-section";
import RightSection from "./right-section";

interface ContainerProps {
  walletAddress: string;
  firstAskQuestion: Promise<InitiatePredictionResponse>;
}

export default function Container({
  walletAddress,
  firstAskQuestion,
}: ContainerProps) {
  return (
    <section className="h-screen w-full">
      <div className="flex h-full w-full">
        <div className="grid h-full w-full grid-cols-2">
          <div className="col-span-2 hidden h-full w-full md:col-span-1 md:block">
            <LeftSection walletAddress={walletAddress} />
          </div>
          <div className="col-span-2 h-full w-full md:col-span-1">
            <RightSection
              walletAddress={walletAddress}
              firstAskQuestion={firstAskQuestion}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
