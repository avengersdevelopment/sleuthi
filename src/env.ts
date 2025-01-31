// src/env.mjs
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    NODE_ENV: z.enum(["development", "production"]),
    API_KEY: z.string().min(1),
    BIRDEYE_API_KEY: z.string().min(1),
    AI_API_KEY: z.string().min(1),
    AI_API_URL: z.string().url(),
    UPSTASH_REDIS_URL: z.string().url(),
    UPSTASH_REDIS_TOKEN: z.string().min(1),
    EDGE_CONFIG: z.string().url(),

    TWITTER_USERNAME_1: z.string().min(1),
    TWITTER_PASSWORD_1: z.string().min(1),
    TWITTER_EMAIL_1: z.string().min(1),
    TWITTER_TWO_FACTOR_SECRET_1: z.string().min(1),

    TWITTER_USERNAME_2: z.string().min(1),
    TWITTER_PASSWORD_2: z.string().min(1),
    TWITTER_EMAIL_2: z.string().min(1),
    TWITTER_TWO_FACTOR_SECRET_2: z.string().min(1),

    TWITTER_USERNAME_3: z.string().min(1),
    TWITTER_PASSWORD_3: z.string().min(1),
    TWITTER_EMAIL_3: z.string().min(1),
    TWITTER_TWO_FACTOR_SECRET_3: z.string().min(1),

    TWITTER_USERNAME_4: z.string().min(1),
    TWITTER_PASSWORD_4: z.string().min(1),
    TWITTER_EMAIL_4: z.string().min(1),
    TWITTER_TWO_FACTOR_SECRET_4: z.string().min(1),

    TWITTER_USERNAME_5: z.string().min(1),
    TWITTER_PASSWORD_5: z.string().min(1),
    TWITTER_EMAIL_5: z.string().min(1),
    TWITTER_TWO_FACTOR_SECRET_5: z.string().min(1),

    TWITTER_USERNAME_6: z.string().min(1),
    TWITTER_PASSWORD_6: z.string().min(1),
    TWITTER_EMAIL_6: z.string().min(1),
    TWITTER_TWO_FACTOR_SECRET_6: z.string().min(1),

    TWITTER_USERNAME_7: z.string().min(1),
    TWITTER_PASSWORD_7: z.string().min(1),
    TWITTER_EMAIL_7: z.string().min(1),
    TWITTER_TWO_FACTOR_SECRET_7: z.string().min(1),

    TWITTER_USERNAME_8: z.string().min(1),
    TWITTER_PASSWORD_8: z.string().min(1),
    TWITTER_EMAIL_8: z.string().min(1),
    TWITTER_TWO_FACTOR_SECRET_8: z.string().min(1),

    TWITTER_USERNAME_9: z.string().min(1),
    TWITTER_PASSWORD_9: z.string().min(1),
    TWITTER_EMAIL_9: z.string().min(1),
    TWITTER_TWO_FACTOR_SECRET_9: z.string().min(1),

    TWITTER_USERNAME_10: z.string().min(1),
    TWITTER_PASSWORD_10: z.string().min(1),
    TWITTER_EMAIL_10: z.string().min(1),
    TWITTER_TWO_FACTOR_SECRET_10: z.string().min(1),

    TWITTER_USERNAME_11: z.string().min(1),
    TWITTER_PASSWORD_11: z.string().min(1),
    TWITTER_EMAIL_11: z.string().min(1),
    TWITTER_TWO_FACTOR_SECRET_11: z.string().min(1),
  },
  /*
   * Environment variables available on the client (and server).
   *
   * 💡 You'll get type errors if these are not prefixed with NEXT_PUBLIC_.
   */
  client: {
    NEXT_PUBLIC_ETHEREUM_RPC_URL: z.string().url(),
  },
  /*
   * Due to how Next.js bundles environment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   *
   * 💡 You'll get type errors if not all variables from `server` & `client` are included here.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    API_KEY: process.env.API_KEY,
    BIRDEYE_API_KEY: process.env.BIRDEYE_API_KEY,
    AI_API_KEY: process.env.AI_API_KEY,
    AI_API_URL: process.env.AI_API_URL,
    UPSTASH_REDIS_URL: process.env.UPSTASH_REDIS_URL,
    UPSTASH_REDIS_TOKEN: process.env.UPSTASH_REDIS_TOKEN,
    EDGE_CONFIG: process.env.EDGE_CONFIG,

    TWITTER_USERNAME_1: process.env.TWITTER_USERNAME_1,
    TWITTER_PASSWORD_1: process.env.TWITTER_PASSWORD_1,
    TWITTER_EMAIL_1: process.env.TWITTER_EMAIL_1,
    TWITTER_TWO_FACTOR_SECRET_1: process.env.TWITTER_TWO_FACTOR_SECRET_1,

    TWITTER_USERNAME_2: process.env.TWITTER_USERNAME_2,
    TWITTER_PASSWORD_2: process.env.TWITTER_PASSWORD_2,
    TWITTER_EMAIL_2: process.env.TWITTER_EMAIL_2,
    TWITTER_TWO_FACTOR_SECRET_2: process.env.TWITTER_TWO_FACTOR_SECRET_2,

    TWITTER_USERNAME_3: process.env.TWITTER_USERNAME_3,
    TWITTER_PASSWORD_3: process.env.TWITTER_PASSWORD_3,
    TWITTER_EMAIL_3: process.env.TWITTER_EMAIL_3,
    TWITTER_TWO_FACTOR_SECRET_3: process.env.TWITTER_TWO_FACTOR_SECRET_3,

    TWITTER_USERNAME_4: process.env.TWITTER_USERNAME_4,
    TWITTER_PASSWORD_4: process.env.TWITTER_PASSWORD_4,
    TWITTER_EMAIL_4: process.env.TWITTER_EMAIL_4,
    TWITTER_TWO_FACTOR_SECRET_4: process.env.TWITTER_TWO_FACTOR_SECRET_4,

    TWITTER_USERNAME_5: process.env.TWITTER_USERNAME_5,
    TWITTER_PASSWORD_5: process.env.TWITTER_PASSWORD_5,
    TWITTER_EMAIL_5: process.env.TWITTER_EMAIL_5,
    TWITTER_TWO_FACTOR_SECRET_5: process.env.TWITTER_TWO_FACTOR_SECRET_5,

    TWITTER_USERNAME_6: process.env.TWITTER_USERNAME_6,
    TWITTER_PASSWORD_6: process.env.TWITTER_PASSWORD_6,
    TWITTER_EMAIL_6: process.env.TWITTER_EMAIL_6,
    TWITTER_TWO_FACTOR_SECRET_6: process.env.TWITTER_TWO_FACTOR_SECRET_6,

    TWITTER_USERNAME_7: process.env.TWITTER_USERNAME_7,
    TWITTER_PASSWORD_7: process.env.TWITTER_PASSWORD_7,
    TWITTER_EMAIL_7: process.env.TWITTER_EMAIL_7,
    TWITTER_TWO_FACTOR_SECRET_7: process.env.TWITTER_TWO_FACTOR_SECRET_7,

    TWITTER_USERNAME_8: process.env.TWITTER_USERNAME_8,
    TWITTER_PASSWORD_8: process.env.TWITTER_PASSWORD_8,
    TWITTER_EMAIL_8: process.env.TWITTER_EMAIL_8,
    TWITTER_TWO_FACTOR_SECRET_8: process.env.TWITTER_TWO_FACTOR_SECRET_8,

    TWITTER_USERNAME_9: process.env.TWITTER_USERNAME_9,
    TWITTER_PASSWORD_9: process.env.TWITTER_PASSWORD_9,
    TWITTER_EMAIL_9: process.env.TWITTER_EMAIL_9,
    TWITTER_TWO_FACTOR_SECRET_9: process.env.TWITTER_TWO_FACTOR_SECRET_9,

    TWITTER_USERNAME_10: process.env.TWITTER_USERNAME_10,
    TWITTER_PASSWORD_10: process.env.TWITTER_PASSWORD_10,
    TWITTER_EMAIL_10: process.env.TWITTER_EMAIL_10,
    TWITTER_TWO_FACTOR_SECRET_10: process.env.TWITTER_TWO_FACTOR_SECRET_10,

    TWITTER_USERNAME_11: process.env.TWITTER_USERNAME_11,
    TWITTER_PASSWORD_11: process.env.TWITTER_PASSWORD_11,
    TWITTER_EMAIL_11: process.env.TWITTER_EMAIL_11,
    TWITTER_TWO_FACTOR_SECRET_11: process.env.TWITTER_TWO_FACTOR_SECRET_11,

    NEXT_PUBLIC_ETHEREUM_RPC_URL: process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL,
  },
});
