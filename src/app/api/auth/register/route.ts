import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!email || !password) {
      return new NextResponse("Missing info", { status: 400 })
    }

    const exist = await prisma.user.findUnique({
      where: {
        email: email
      }
    })

    if (exist) {
      return new NextResponse("Email already exists", { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("REGISTRATION_ERROR", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
