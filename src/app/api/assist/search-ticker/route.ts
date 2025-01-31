import { getCachedSearchTicker } from "@/data/services/search-ticker";
import { SearchTickerRequestSchema } from "@/data/schemas/dto";
import { formatZodError } from "@/lib/utils";

export async function POST(request: Request) {
  const body = await request.json();

  const result = SearchTickerRequestSchema.safeParse(body);

  if (!result.success) {
    return Response.json(formatZodError(result.error), { status: 400 });
  }

  const { tickerQuery } = result.data;
  const tokenAddress = await getCachedSearchTicker(tickerQuery);

  return Response.json({ tokenAddress });
}
