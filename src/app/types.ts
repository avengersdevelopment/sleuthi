import type { CHATFLOW_MAPPING } from "@/data/config";

export interface AgentMessage {
  agentName: string;
  messages: unknown[];
  nodeName: string;
  nodeId: string;
  usedTools?: unknown[];
  sourceDocuments?: unknown[];
  artifacts?: unknown[];
  state?: Record<string, unknown>;
}

export interface InitiatePredictionResponse {
  text: string;
  question: string;
  chatId: string;
  chatMessageId: string;
  isStreamValid: boolean;
  sessionId: string;
  memoryType: string;
}

export interface IntentRecognizerResponse {
  json: {
    intent: keyof typeof CHATFLOW_MAPPING;
  };
  question: string;
  chatId: string;
  chatMessageId: string;
  isStreamValid: boolean;
  sessionId: string;
}
