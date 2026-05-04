"use server";

import { auth } from "@/src/auth.config";
import { db } from "@/src/db";
import { jobs, users } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// create job
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
// end create job function

// get jobs
// export async function getJobsAction() {
//   const jobsList = await db.query.jobs.findMany();
//   return jobsList;
// }
// end get jobs function