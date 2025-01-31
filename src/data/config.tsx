export const CHARACTERS = [
  {
    theme: "dark",
    id: "Good_Blade",
    name: "Good_Blade",
  },
  {
    theme: "dark",
    id: "Evil_Blade",
    name: "Evil_Blade",
  },
  {
    theme: "light",
    id: "Wise_Blade",
    name: "Wise_Blade",
  },
] as const;

export const FAQ_OPTIONS = [
  "The Memecoin Philosophy",
  "Pre-Trading Checklist: 10-Second Rule",
  "Detailed Steps for Memecoin Analysis",
  "Market Cap & Liquidity-Based Strategy for Meme Coins",
  "Entry and Exit Strategies",
  "Psychological Guidelines",
  "Tools to Use",
] as const;

export const QUICK_CHAT_OPTIONS = [
  "My Top 5 Fumbles",
  "My Top 5 Biggest REKT (Loss)",
  "Analyze my Past 5 Trades",
  "Give me info on $MOODENG",
  "What do you think of $MOG?",
] as const;

export const FOUNDERS = [
  {
    name: "dev",
    imageSrc: "dev.jpg",
  },
] as const;

export const CHATFLOW_MAPPING = {
  INTENT_RECOGNIZER: "53266e69-191e-4380-afbe-269553afa095",
  FAQ: "18f5c766-4cc5-427c-a126-dee1314df67b",
  LOSS: "1241f612-1a59-4bd3-8119-d92a567f6470",
  FUMBLE: "2adc98a4-1c1b-443a-ab58-8c1f64783e32",
  TRADES: "26841154-823b-4213-8916-24d6ec99ffcd",
  ANALYSIS: "1978b4fb-4005-4223-ac45-9ab331a89347",
};
