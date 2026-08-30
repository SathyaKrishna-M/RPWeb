import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Used by Render's health check. Reports unhealthy when the database is
// unreachable, so a broken deploy is not rolled out as if it were fine.
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ status: "ok" })
  } catch (error) {
    console.error("HEALTH_CHECK_FAILED", error)
    return NextResponse.json({ status: "error", database: "unreachable" }, { status: 503 })
  }
}
