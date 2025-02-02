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
  INTENT_RECOGNIZER: "11e15183-836c-4019-afc0-d6b6537e13d6",
  FAQ: "3c5a868d-0dd8-4764-af12-f314a5c47b50",
  LOSS: "0372bea4-27f8-4605-a883-8d23394c4823",
  FUMBLE: "bbf31c1d-4d1d-4f71-9f19-2ac86a53451d",
  TRADES: "cd9ece01-9591-4a74-9d2f-3d1b1f466c25",
  ANALYSIS: "15576910-5cc3-469d-ab8e-04e29bee9f66",
};
