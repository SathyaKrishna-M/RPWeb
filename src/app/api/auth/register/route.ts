import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { validateRegistration } from "@/lib/validation"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = validateRegistration(body)

    if (!result.ok) {
      return new NextResponse(result.error, { status: 400 })
    }

    const { name, email, password } = result

    const exist = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })

    if (exist) {
      return new NextResponse("An account with that email already exists.", { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name: name || null,
        email,
        passwordHash: hashedPassword,
      },
      // Never select passwordHash here — this object is sent to the browser.
      select: { id: true, name: true, email: true },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("REGISTRATION_ERROR", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
