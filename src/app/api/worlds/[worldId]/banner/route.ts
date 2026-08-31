import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * Serves an uploaded world banner.
 *
 * Public for the same reason the avatar route is: it is referenced by an
 * `<img src>`, which cannot carry a session. It exposes only a picture the
 * world's own members chose to display, at a cuid-based URL.
 */
export async function GET(_request: Request, ctx: RouteContext<"/api/worlds/[worldId]/banner">) {
  const { worldId } = await ctx.params

  const banner = await prisma.worldBanner.findUnique({
    where: { worldId },
    select: { data: true, mime: true, updatedAt: true },
  })

  if (!banner) return new NextResponse("Not found", { status: 404 })

  return new NextResponse(Buffer.from(banner.data), {
    headers: {
      "Content-Type": banner.mime,
      "Content-Length": String(banner.data.length),
      // The URL carries a version from updatedAt, so a given URL always returns
      // the same bytes and can be cached hard.
      "Cache-Control": "public, max-age=31536000, immutable",
      ETag: `"${banner.updatedAt.getTime()}"`,
    },
  })
}
