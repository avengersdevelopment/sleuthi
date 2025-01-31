import { getTwitterAccount } from "@/data/services/twitter-account";
import { TwitterSearchRequestSchema } from "@/data/schemas/dto";
import { checkRateLimit } from "@/lib/ratelimit";
import { formatZodError } from "@/lib/utils";
import {
  type QueryTweetsResponse,
  type Scraper,
  SearchMode,
  type Tweet,
} from "agent-twitter-client";
import { unstable_cache } from "next/cache";

// Export the POST handler
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = TwitterSearchRequestSchema.safeParse(body);

    if (!result.success) {
      return Response.json(formatZodError(result.error), { status: 400 });
    }

    const { q, limit } = result.data;

    // Use cached function instead of direct calls
    const tweets = await getCachedTwitterSearch(q, limit);

    return Response.json(tweets);
  } catch (error) {
    console.error("[Twitter Scraper] Error processing request:", error);
    return Response.json({ error: "Failed to fetch tweets" }, { status: 500 });
  }
}

const getCachedTwitterSearch = (query: string, limit: number) => {
  return unstable_cache(
    async () => {
      const tweets = await tryFetchWithRotation(query, limit);
      return tweets;
    },
    ["twitter", "search", query, limit.toString()],
    {
      tags: ["twitter", `twitter_search_${query}_${limit}`],
      revalidate: 60 * 30, // Cache for 30 minutes
    },
  )();
};

async function tryFetchWithRotation(query: string, limit: number) {
  // Try accounts 1 through 11
  for (let accountNum = 1; accountNum <= 11; accountNum++) {
    try {
      const scraper = await getTwitterAccount(accountNum);

      // Check rate limit for each account
      await checkRateLimit(accountNum.toString(), 10, "1 m", "twitter_search"); // 10 requests per minute

      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timed out")), 15_000); // 15 seconds
      });

      // Race between the fetch and timeout
      return await Promise.race([
        fetchSearchTweets(scraper, query, limit),
        timeoutPromise,
      ]);
    } catch (error) {
      // If this is the last account and it failed, throw the error
      if (accountNum === 10) {
        throw error;
      }
      // Otherwise continue to next account
      // console.log(
      //   `Account ${accountNum} failed, trying next account...`,
      //   error,
      // );
    }
  }
}

// Function to fetch tweets with only essential fields
async function fetchSearchTweets(
  scraper: Scraper,
  query: string,
  limit: number,
): Promise<Partial<Tweet>[]> {
  let response: QueryTweetsResponse;
  let allTweets: Partial<Tweet>[] = [];

  const sanitizedQuery = query.replace(/[^a-zA-Z0-9]/g, " ");

  try {
    response = await scraper.fetchSearchTweets(
      `$${sanitizedQuery}`,
      limit,
      SearchMode.Top,
    );

    // Extract only essential fields from each tweet
    const filteredTweets = response.tweets.map((tweet) => ({
      id: tweet.id,
      text: tweet.text,
      username: tweet.username,
      retweets: tweet.retweets,
      timeParsed: tweet.timeParsed,
      views: tweet.views,
      likes: tweet.likes,
      // Only include mentions if they exist
      mentions: tweet.mentions?.length ? tweet.mentions : undefined,
      thread: tweet.thread?.length ? tweet.thread : undefined,
    }));

    allTweets = allTweets.concat(filteredTweets);
  } catch (error) {
    console.error("[Twitter Scraper] Error fetching tweets:", error);
    console.dir(error, { depth: 5 });
  }

  const sortedTweetsByEngagement = allTweets.sort((a, b) => {
    // Calculate total engagement score for each tweet
    const getEngagementScore = (tweet: Partial<Tweet>) => {
      const views = tweet.views ?? 0;
      const likes = tweet.likes ?? 0;
      const retweets = tweet.retweets ?? 0;

      // Weight different engagement types
      // Views typically have larger numbers, so we divide by 100 to normalize
      return views / 100 + likes * 2 + retweets * 3;
    };

    const scoreA = getEngagementScore(a);
    const scoreB = getEngagementScore(b);

    return scoreB - scoreA;
  });

  return sortedTweetsByEngagement.slice(0, limit);
}
