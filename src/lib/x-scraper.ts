// Create a new instance of the Scraper class

import { Scraper } from "agent-twitter-client";

// Now it's working on Next.js 15.0.3 thanks to the serverExternalPackages in next.config.ts - https://github.com/PLhery/node-twitter-api-v2/issues/531
export const scraper = new Scraper({
  fetch: fetch,
});
