import { db } from "@/src/db";
import { jobs } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import UploadCV from "@/src/components/user/UploadCV";

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ applyId: string }>;
}) {
  const { applyId } = await params;
  const job = await db
    .select()
    .from(jobs)
    .where(eq(jobs.id, Number(applyId)))
    .get();

  if (!job) return <div>The job does not exist</div>;
  return (
    <div className="container mx-auto p-8">
      <div className="flex flex-col lg:flex-row gap-12 items-start justify-center">
      {job && (
        // Left Side: Job Details
        <div className="p-8 flex gap-8">
          <div className="w-[500px] flex flex-col items-start gap-4">
            <h1 className="text-2xl font-bold">{job.title}</h1>
            <div className="flex items-center justify-between gap-4">
              <p className="text-muted-foreground">{job.salary}</p>
              <Badge className="text-sm">{job.location}</Badge>
            </div>
            <div className="flex items-center gap-1">
              <p className="text-lg">{job.companyName}</p>
              <img
                src="https://img.icons8.com/?size=100&id=98A4yZTt9abw&format=png&color=000000"
                alt="icon"
                className="w-5 h-5"
              />
            </div>
            <h2 className="text-xl font-semibold">Job Description</h2>
            <p>{job.description}</p>
            <h2 className="text-xl font-semibold">Requirements</h2>
            {job.requirements.split("\n").map((line, index) => {
              const cleanLine = line.replace(/^[\s-*]+/, "").trim();
              if (!cleanLine) return null;
              return <p key={index}>• {cleanLine}</p>;
            })}
            <Badge
              variant="outline"
              className="text-sm text-muted-foreground px-3"
            >
              job posted {formatTimeAgo(job.createdAt)}
            </Badge>
          </div>

          {/* Right Side: Application Box */}
          <div className="sticky top-8 bg-white border border-gray-200 rounded-xl p-6 shadow-sm w-full lg:w-[400px]">
            <h2 className="text-xl font-bold mb-4">Apply for this position</h2>

            <p className="text-gray-600 text-sm mb-6">
              Submit your application to {job.companyName} for the {job.title}{" "}
              role.
            </p>

            <UploadCV params={{ id: applyId }} />
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

function formatTimeAgo(date: Date | null) {
  if (!date) return "Unknown date";

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const units = [
    { name: "year", seconds: 31536000 },
    { name: "month", seconds: 2592000 },
    { name: "day", seconds: 86400 },
    { name: "hour", seconds: 3600 },
    { name: "minute", seconds: 60 },
    { name: "second", seconds: 1 },
  ];

  for (const unit of units) {
    const interval = Math.floor(diffInSeconds / unit.seconds);
    if (interval >= 1) {
      return `${interval} ${unit.name}${interval > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}
