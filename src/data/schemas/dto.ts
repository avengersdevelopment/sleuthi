import { z } from "zod";
import { validateSolanaAddress } from "../../utils/address-validator";

export const SearchTickerRequestSchema = z.object({
  tickerQuery: z
    .string()
    .min(1, "Ticker query cannot be empty")
    .max(20, "Ticker query is too long")
    .trim(),
});

export type SearchTickerRequest = z.infer<typeof SearchTickerRequestSchema>;

export const TokenAddressRequestSchema = z.object({
  tokenAddress: z
    .string()
    .min(1, "Token address cannot be empty")
    .max(44, "Token address is too long")
    .trim(),
});

export type TokenAddressRequest = z.infer<typeof TokenAddressRequestSchema>;

export const TwitterSearchRequestSchema = z.object({
  q: z
    .string()
    .min(1, "Search query cannot be empty")
    .max(100, "Search query is too long")
    .trim(),
  limit: z
    .number()
    .optional()
    .transform((val) => val || 10)
    .pipe(z.number().min(1).max(100)),
});

export type TwitterSearchRequest = z.infer<typeof TwitterSearchRequestSchema>;

export const WalletAddressRequestSchema = z.object({
  walletAddress: z
    .string()
    .min(1, "Wallet address cannot be empty")
    .max(44, "Wallet address is too long")
    .trim()
    .refine(validateSolanaAddress, {
      message: "Invalid Solana wallet address. Please check and try again.",
    }),
});

export type WalletAddressRequest = z.infer<typeof WalletAddressRequestSchema>;

export const RektCheckerRequestSchema = z.object({
  walletAddress: z
    .string()
    .min(1, "Wallet address cannot be empty")
    .max(44, "Wallet address is too long")
    .trim()
    .refine(validateSolanaAddress, {
      message: "Invalid Solana wallet address. Please check and try again.",
    }),
});

export type RektCheckerRequest = z.infer<typeof RektCheckerRequestSchema>;

export const ChatMessageSchema = z.object({
  role: z.enum(["apiMessage", "userMessage"]),
  content: z.string(),
  error: z.boolean().optional(),
  timestamp: z.date().optional(),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const AskQuestionRequestSchema = z.object({
  question: z
    .string()
    .min(1, "Question cannot be empty")
    .max(1000, "Question is too long")
    .trim(),
  character: z.string().min(1, "Character cannot be empty").trim(),
  walletAddress: z
    .string()
    .min(1, "Wallet address cannot be empty")
    .max(44, "Wallet address is too long")
    .trim()
    .refine(validateSolanaAddress, {
      message: "Invalid Solana wallet address. Please check and try again.",
    }),
  sessionId: z.string().optional(),
  history: z
    .array(
      z.object({
        role: ChatMessageSchema.shape.role, // Ensure role is required
        content: ChatMessageSchema.shape.content.optional(), // Make content optional
      })
    )
    .optional(),
});

export type AskQuestionRequest = z.infer<typeof AskQuestionRequestSchema>;
