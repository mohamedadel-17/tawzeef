import JobForm from "@/src/components/JobForm";
import { db } from "@/src/db";
import { jobs } from "@/src/db/schema";
import { desc } from "drizzle-orm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { JobAdminCard } from "@/src/components/JobAdminCard";

export default async function HomeAdminPage() {
  const allJobs = await db.select().from(jobs).orderBy(desc(jobs.id));

  return (
    <div className="p-8 flex flex-col items-center">
      {/* nav bar */}
      <div className="w-full flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        {/* add new job button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Add New Job</Button>
          </DialogTrigger>
          <DialogDescription className="sr-only">
            Form to create a new job listing for applicants.
          </DialogDescription>

          <DialogContent>
            <JobForm />
          </DialogContent>
        </Dialog>
      </div>
      {/* jobs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-6 px-4">
        {allJobs.map(
          (job) => (
            console.log("Rendering job:", job),
            (<JobAdminCard key={job.id} job={job} />)
          ),
        )}
      </div>
      0
      {allJobs.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          No jobs posted yet.
        </div>
      )}
    </div>
  );
}
