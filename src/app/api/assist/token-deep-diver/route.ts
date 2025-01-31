import { getCachedTokenOverview } from "@/data/services/token-overview";
import { getCachedTokenSecurity } from "@/data/services/token-security";
import { TokenAddressRequestSchema } from "@/data/schemas/dto";
import { formatZodError } from "@/lib/utils";

export async function POST(request: Request) {
  const body = await request.json();

  const result = TokenAddressRequestSchema.safeParse(body);

  if (!result.success) {
    return Response.json(formatZodError(result.error), { status: 400 });
  }

  const { tokenAddress } = result.data;

  const [overview, security] = await Promise.all([
    getCachedTokenOverview(tokenAddress),
    getCachedTokenSecurity(tokenAddress),
  ]);

  if (!overview || !security) {
    return Response.json(
      {
        error: "Token not found",
      },
      { status: 404 },
    );
  }

  return Response.json({
    overview,
    security,
  });
}
