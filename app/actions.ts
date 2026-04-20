"use server";

import { db } from "@/src/db";
import { jobs, users } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/src/auth";
import { revalidatePath } from "next/cache";

// Action functions for handling user signup and login
//* signup
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

//* login
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

//* create job
export async function createJobAction(prevState: any, formData: FormData) {
  console.log("⛔️ Received data:", formData);
  const session = await auth();
  const user = session?.user;
  console.log("⛔️ Session data:", session);
  if (!user || !user.email) {
    return { error: "You must be logged in to create a job" };
  }
  const currentUser = await db.query.users.findFirst({
    where: eq(users.email, user.email),
  });
  const companyName = currentUser?.companyName || "Unknown Company";

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const requirements = formData.get("requirements") as string;
  const salary = formData.get("salary") as string;
  const location = formData.get("location") as string;

  if (!title || !description || !requirements || !salary || !location) {
    return { error: "All fields are required" };
  }
  try {
    await db.insert(jobs).values({
      title,
      companyName,
      description,
      requirements,
      location,
      salary,
    });
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "An unexpected error occurred" };
  }
  revalidatePath("/admin");

  redirect("/admin");
}

//* get jobs
export async function getJobsAction() {
  const jobsList = await db.query.jobs.findMany();
  return jobsList;
}