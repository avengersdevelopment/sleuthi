import { getInitialMessage } from "@/utils/chat";
import Container from "./_components/container";

interface PageProps {
  searchParams: {
    walletAddress: string;
    character: string;
  };
}

export default async function Page({ searchParams }: PageProps) {
  const { walletAddress, character } = searchParams;

  const firstAskQuestion = getInitialMessage({
    character: character ?? "Brown",
    walletAddress,
  });

  return (
    <Container
      walletAddress={walletAddress}
      firstAskQuestion={firstAskQuestion}
    />
  );
}
