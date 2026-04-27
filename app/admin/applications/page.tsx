import { ApplicationsCard } from "@/src/components/ApplicationsCard";
import { db } from "@/src/db";
import { applications, jobs } from "@/src/db/schema";
import { desc } from "drizzle-orm";

export default async function ApplicationsPage() {
  const allApplications = await db
    .select()
    .from(applications)
    .orderBy(desc(applications.id));

  return (
    <div className="flex flex-col items-center">
      {/* title page */}
      <div className="w-full flex justify-between items-center">
        <h1 className="text-2xl font-bold">Applications</h1>
      </div>
      {/* jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 w-full mt-6 px-4">
        {allApplications.map(
          (application) => (
            console.log("Rendering application:", application),
            (
              <ApplicationsCard
                key={application.id}
                application={application}
              />
            )
          ),
        )}
      </div>
      {allApplications.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          No jobs posted yet.
        </div>
      )}
    </div>
  );
}
