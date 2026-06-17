"use server";

import { db } from "@/server/db";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

export async function registerUser(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!username || !email || !password) {
    return { error: "Missing required fields" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  // Check if user exists
  const existingUser = await db.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    return { error: "Username or email already in use" };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  // Create user
  await db.user.create({
    data: {
      username,
      email,
      passwordHash,
      profile: {
        create: {
          displayName: username,
        }
      }
    },
  });

  // redirect to login
  redirect("/login");
}

export async function loginUser(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Missing required fields" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    throw error;
  }
}
