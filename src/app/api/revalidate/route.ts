import { revalidateTag } from "next/dist/server/web/spec-extension/revalidate";

export const runtime = "edge";

export async function POST(request: Request) {
  const { tags } = await request.json();
  const tagsToRevalidate = Array.isArray(tags) ? tags : [tags];

  for (const tag of tagsToRevalidate) {
    revalidateTag(tag);
  }

  return Response.json({
    message: `Revalidated tags: ${tagsToRevalidate.join(", ")}`,
    revalidated: true,
    now: Date.now(),
  });
}
