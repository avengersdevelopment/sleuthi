import { env } from "@/env";
import { redis } from "@/lib/redis";
import { Scraper } from "agent-twitter-client";

// Type for account credentials
interface TwitterCredentials {
  username: string;
  password: string;
  email: string;
  twoFactorSecret: string;
}

// Helper to get all accounts
const getAccounts = (): TwitterCredentials[] => {
  const accounts: TwitterCredentials[] = [];
  for (let i = 1; i <= 11; i++) {
    const username = env[`TWITTER_USERNAME_${i}` as keyof typeof env];
    const password = env[`TWITTER_PASSWORD_${i}` as keyof typeof env];
    const email = env[`TWITTER_EMAIL_${i}` as keyof typeof env];
    const twoFactorSecret =
      env[`TWITTER_TWO_FACTOR_SECRET_${i}` as keyof typeof env];
    if (username && password && email && twoFactorSecret) {
      accounts.push({ username, password, email, twoFactorSecret });
    }
  }
  return accounts;
};

export const getTwitterAccount = async (number: number) => {
  const scraper = new Scraper({
    fetch: fetch,
  });

  const accounts = getAccounts();
  const account = accounts[number];

  // Try to use cached cookies first
  const cacheKey = `twitter_cookies_${account.username}`;
  const cachedCookies = await redis.get<string[]>(cacheKey);

  if (cachedCookies) {
    try {
      await scraper.setCookies(cachedCookies);

      const isLoggedIn = await scraper.isLoggedIn();
      if (isLoggedIn) {
        return scraper;
      }
    } catch (error) {
      console.error(
        `[Twitter Scraper] Error with cached cookies for ${account.username}:`,
        error,
      );
    }
  }

  // Perform fresh login if needed
  await scraper.login(
    account.username,
    account.password,
    account.email,
    account.twoFactorSecret,
  );

  // Cache the new cookies
  const cookies = await scraper.getCookies();
  await redis.set(cacheKey, cookies.map(String), {
    ex: 24 * 60 * 60, // Cache for 24 hours
  });

  return scraper;
};
