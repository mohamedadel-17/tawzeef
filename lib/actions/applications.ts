"use server";

import PDFParser from "pdf2json";
import Groq from "groq-sdk";
import { db } from "@/src/db";
import { jobs, users, applications } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/src/auth";
import { revalidatePath } from "next/cache";
import connectDB from "@/src/lib/mongodb";
import Analysis from "@/src/models/Analysis";
import { redirect } from "next/navigation";

// apply for a job
export const applyForJobAction = async (prevState: any, formData: FormData) => {
  const session = await auth();
  console.log("⛔️ Full Session User:", session?.user);
  const user = session?.user;
  console.log("⛔️ Check this ID:", session?.user?.id);
  if (!user || !user.id) {
    return { error: "You must be logged in to apply for a job" };
  }
  const userIdRaw = user?.id;
  const userId = Number(userIdRaw);

  if (!userIdRaw || isNaN(userId)) {
    console.error("⛔️ Error: User ID is missing or invalid. ID:", userIdRaw);
    return { error: "User session not found or invalid ID." };
  }
  const jobId = parseInt(formData.get("jobId") as string);

  //* Extract the uploaded file from the form data
  const file = formData.get("cv") as File;
  if (!file || file.size === 0) return { error: "Please upload the file" };
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const cvText = await new Promise<string>((resolve, reject) => {
    const pdfParser = new (PDFParser as any)(null, 1);
    pdfParser.on("pdfParser_dataError", (errData: any) =>
      reject(errData.parserError)
    );
    pdfParser.on("pdfParser_dataReady", () => {
      resolve(pdfParser.getRawTextContent());
    });
    pdfParser.parseBuffer(buffer);
  });
  if (!cvText) return { error: "Failed to extract text from the PDF" };
  console.log("⛔️ Extracted CV Text:", cvText);


  const [job] = await db.select().from(jobs).where(eq(jobs.id, Number(jobId)));
  if (!job) return { error: "Job not found" };

  //* AI prompt
  const prompt = `Role: Expert Technical Recruiter
  Act as an experienced HR Specialist. Analyze the "Job Description" and my "Resume" provided below. Please provide a structured evaluation including:
      Matching Score: A percentage out of 100%.
      Verdict: (Accepted / Needs Review / Rejected).
      Decision Summary: Brief bullet points explaining the strengths and missing requirements.
      Improvement Tip: One specific action to improve the score.
  Data:
      Job title: ${job.title}
      Job Description: ${job.description}
      Job Requirements: ${job.requirements}
      Resume: ${cvText}

    Return ONLY a valid JSON object with the following structure:
    {
      "score": number,
      "status": "Accepted" | "Needs Review" | "Rejected",
      "summary": "General summary of experiences",
      "strengths": ["Strength 1", "Strength 2"],
      "weaknesses": ["Weakness 1", "Weakness 2"],
      "decisionSummary": "Why was this decision made regarding the applicant?",
      "improvementTip": "Specific advice for the applicant to improve their future prospects",
    }
  `

  //* AI evaluation (Groq)
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.1-8b-instant",
    response_format: { type: "json_object" },
  });
  const aiResponse = JSON.parse(chatCompletion.choices[0].message.content!);
  console.log("⛔️ AI Response:", aiResponse);

  const score = Number(aiResponse.score) || 0;
  const summary = Array.isArray(aiResponse.summary)
    ? aiResponse.summary.join(". ")
    : aiResponse.summary;
  const tip = aiResponse.improvementTip;


  console.log("⛔️ Final Evaluation - Score:", score);
  console.log(parseInt(session.user?.id as string), Number(jobId));

  // Store application in SQLite
  const [newApplication] = await db.insert(applications).values({
    userId: userId,
    jobId: Number(jobId),
    aiScore: score,
    status: "Under Review"
  }).returning({ insertedId: applications.id });

  // MongoDB storage for analysis
  try {
    await connectDB();

    await Analysis.create({
      applicationId: newApplication.insertedId,
      cvText: cvText,
      aiFeedback: {
        summary: aiResponse.summary,
        strengths: aiResponse.strengths,
        weaknesses: aiResponse.weaknesses,
        decisionSummary: aiResponse.decisionSummary,
        improvementTip: aiResponse.improvementTip
      },
      rawAiResponse: aiResponse
    });
  } catch (error) {
    console.error("⛔️ Error saving analysis to MongoDB:", error);
  }

  return { success: "Application submitted successfully!" };
}
// end apply for a job

// get applications for a special user
export async function getUserApplications() {
  // get user id
  const session = await auth();
  console.log("⛔️ Full Session User:", session?.user);
  const user = session?.user;
  console.log("⛔️ Check this ID:", session?.user?.id);
  if (!user || !user.id) {
    return [];
  }
  const userIdRaw = user?.id;
  const userId = Number(userIdRaw);

  if (!userIdRaw || isNaN(userId)) {
    console.error("⛔️ Error: User ID is missing or invalid. ID:", userIdRaw);
    return [];
  }

  const sqData = await db
    .select({
      id: applications.id,
      jobId: applications.jobId,
      status: applications.status,
      aiScore: applications.aiScore,
      createdAt: applications.createdAt,
      jobTitle: jobs.title,
      companyName: jobs.companyName,
    })
    .from(applications)
    .innerJoin(jobs, eq(applications.jobId, jobs.id))
    .where(eq(applications.userId, userId));

  if (!sqData || sqData.length === 0) return [];

  await connectDB();
  const combinedData = await Promise.all(
    sqData.map(async (app) => {
      const mongoData = await Analysis.findOne({ applicationId: app.id });

      return {
        ...app,
        aiDetails: mongoData ? { improvementTip: mongoData.aiFeedback.improvementTip } : null,
      };
    })
  );
  
  return combinedData;
}
// end get applications for a special user

// change status for specific application
export async function updateStatusAction(id: number, newStatus: string) {
  // Update the status in the SQLite database
  await db
    .update(applications)
    .set({ status: newStatus as "Under Review" | "Accepted" | "Rejected" })
    .where(eq(applications.id, id));

  // Refresh the page to show the updated status
  revalidatePath(`/applications/${id}`);
}
// end change status for specific application