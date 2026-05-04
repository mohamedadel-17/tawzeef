"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import { signIn } from "@/src/auth";

// signup 
export async function signupAction(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const companyName = formData.get("companyName") as string;

  if (!name || !email || !password) {
    return { error: "All fields are required" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      companyName,
      role: "user",
    });
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "An unexpected error occurred" };
  }

  redirect("/login");
}
// end signup

// login
export async function loginAction(prevState: any, formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/home",
    });
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") {
      throw error;
    }
    return {
      error: "email or password is not valid",
    };
  }
}
// end login