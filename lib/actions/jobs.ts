// create job, update job, delete job, 
"use server";

import { auth } from "@/src/auth.config";
import { db } from "@/src/db";
import { applications, jobs, users } from "@/src/db/schema";
import { and, eq, isNull } from "drizzle-orm";
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
      ownerId: Number(user.id),
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
  revalidatePath("/admin/jobs");

  redirect("/admin/jobs");
}
// end create job function

// update job
export async function updateJobAction(prevState: any, formData: FormData) {
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

  const id = formData.get("id") as unknown as number;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const requirements = formData.get("requirements") as string;
  const salary = formData.get("salary") as string;
  const location = formData.get("location") as string;

  if (!title || !description || !requirements || !salary || !location || !id) {
    return { error: "All fields are required" };
  }
  try {
    await db.update(jobs).set({
      title,
      ownerId: Number(user.id),
      companyName,
      description,
      requirements,
      location,
      salary,
    }).where(eq(jobs.id, Number(id)));

  } catch (error) {
    if (error instanceof Error) {
      console.log("⛔️ update job error: ", error.message);
      return { error: "Unexpected error. Please try again later" };
    }
    return { error: "An unexpected error occurred" };
  }

  revalidatePath("/admin/jobs");
  return { success: "Job updated successfully!" }
}
// end update job

// delete job 
export async function deleteJob(jobId: number) {

  return await db.transaction(async (tx) => {
    try {
      // update all applications currently "under review" to "rejected" 
      await tx
        .update(applications)
        .set({
          status: "Rejected",
          deletedAt: new Date()
        })
        .where(
          and(
            eq(applications.jobId, jobId),
            eq(applications.status, "Under Review"),
            isNull(applications.deletedAt)
          )
        );

      // perform a soft delete
      // on applications
      await tx
        .update(applications)
        .set({ deletedAt: new Date() })
        .where(eq(applications.jobId, jobId));
      // on jobs
      await tx
        .update(jobs)
        .set({ deletedAt: new Date() })
        .where(eq(jobs.id, jobId));

      revalidatePath("/admin/jobs");

      return { success: true, message: "Job deleted and applications notified." };
    } catch (error) {
      console.error("Transaction failed:", error);
      tx.rollback();
      return { success: false, error: "Failed to delete job." };
    }
  });
}
// end delete job