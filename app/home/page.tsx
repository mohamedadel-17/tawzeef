import { JobUserCard } from "@/src/components/JobUserCard";
import { db } from "@/src/db";
import { jobs } from "@/src/db/schema";
import { desc } from "drizzle-orm";

export default async function HomePage() {
  const allJobs = await db.select().from(jobs).orderBy(desc(jobs.id));

  return (
    <div className="p-8 flex flex-col items-center">
      {/* nav bar */}
      <div className="w-full flex justify-between items-center">
        <h1 className="text-2xl font-bold">Home Page</h1>
      </div>
      {/* jobs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-6 px-4">
        {allJobs.map(
          (job) => (
            console.log("Rendering job:", job),
            (<JobUserCard key={job.id} job={job} />)
          ),
        )}
      </div>
      {allJobs.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          No jobs posted yet.
        </div>
      )}
    </div>
  );
}
