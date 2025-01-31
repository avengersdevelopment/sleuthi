import type { IntentRecognizerResponse } from "@/app/types";
import { CHARACTERS, CHATFLOW_MAPPING } from "@/data/config";
import { AskQuestionRequestSchema } from "@/data/schemas/dto";
import { env } from "@/env";
import { checkRateLimit } from "@/lib/ratelimit";
import { FlowiseClient } from "flowise-sdk";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { question, character, walletAddress, sessionId, history } =
    AskQuestionRequestSchema.parse(await req.json());

  await checkRateLimit(walletAddress, 10, "1 m", "chat_ask");

  const characterName = CHARACTERS.find((c) => c.id === character)?.name;

  const client = new FlowiseClient({
    baseUrl: env.AI_API_URL,
    apiKey: env.AI_API_KEY,
  });

  const historyString = history
    ?.map(
      (message) =>
        `[${message.role}] ${message.content
          .replace(/[\n\r]/g, " ") // Replace newlines with spaces
          .replace(/[^\x20-\x7E]/g, "") // Remove non-printable characters
          .replace(/"/g, '\\"') // Escape double quotes
          .replace(/[{}]/g, "") // Remove curly braces to avoid variable interpolation
          .trim()}`,
    )
    .join(", ");

  const intentRecognizerPrediction = (await client.createPrediction({
    chatflowId: CHATFLOW_MAPPING.INTENT_RECOGNIZER,
    question,
    overrideConfig: {
      ...(sessionId ? { sessionId } : {}),
      vars: {
        wallet_address: walletAddress,
        character: characterName,
        history: historyString,
      },
    },
  })) as IntentRecognizerResponse;

  const intent = intentRecognizerPrediction.json.intent;

  if (!intent || !CHATFLOW_MAPPING[intent]) {
    console.error(`Intent: ${intent} not found`);
    return new NextResponse(`Intent: ${intent} not found`, { status: 400 });
  }

  const prediction = await client.createPrediction({
    chatflowId: CHATFLOW_MAPPING[intent],
    question,
    streaming: true,
    overrideConfig: {
      sessionId: intentRecognizerPrediction.sessionId,
      vars: {
        wallet_address: walletAddress,
        character: characterName,
        chat_history: historyString,
      },
    },
  });

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of prediction) {
        if (typeof chunk.data === "string" && chunk.data !== "[DONE]") {
          controller.enqueue(
            new TextEncoder().encode(
              chunk.data.replace(/\[object Object\]/g, ""),
            ),
          );
        }
      }
      controller.close();
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/plain",
      "Transfer-Encoding": "chunked",
    },
  });
};
