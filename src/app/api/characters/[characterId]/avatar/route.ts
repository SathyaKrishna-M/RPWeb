import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * Serves an uploaded avatar.
 *
 * Deliberately public and unauthenticated: it is referenced by `<img src>` all
 * over the app, including inside message lists, and an authenticated fetch
 * cannot be expressed there. The id is a cuid, the response is a small square
 * picture a character chose to show, and nothing else is exposed.
 */
export async function GET(_request: Request, ctx: RouteContext<"/api/characters/[characterId]/avatar">) {
  const { characterId } = await ctx.params

  const avatar = await prisma.characterAvatar.findUnique({
    where: { characterId },
    select: { data: true, mime: true, updatedAt: true },
  })

  if (!avatar) return new NextResponse("Not found", { status: 404 })

  return new NextResponse(Buffer.from(avatar.data), {
    headers: {
      "Content-Type": avatar.mime,
      "Content-Length": String(avatar.data.length),
      // The URL carries a version derived from updatedAt, so a given URL always
      // returns the same bytes and can be cached hard.
      "Cache-Control": "public, max-age=31536000, immutable",
      ETag: `"${avatar.updatedAt.getTime()}"`,
    },
  })
}
