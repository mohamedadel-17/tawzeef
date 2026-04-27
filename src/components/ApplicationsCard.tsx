import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { db } from "../db";
import { jobs } from "../db/schema";
import { eq } from "drizzle-orm";

export async function ApplicationsCard({ application }: { application: any }) {
  const job = await db
    .select()
    .from(jobs)
    .where(eq(jobs.id, application.jobId))
    .get();

  if (!job) return <div>Job not found</div>;
  return (
    <Card className="w-full pt-6">
      {/* <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <img
        src="https://avatar.vercel.sh/shadcn1"
        alt="Logo"
        className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
      /> */}
      <CardHeader className="flex flex-col">
        <div className="flex items-center justify-between w-full">
          <CardTitle>{job.title}</CardTitle>
          <CardAction>
            <Badge variant="secondary" className="text-sm">
              {application.status}
            </Badge>
          </CardAction>
        </div>
        <CardDescription className="text-md text-foreground">
          <p className="text-muted-foreground text-sm">
            {new Date(application.createdAt).toDateString()}
          </p>
          <p>AI Score: {application.aiScore} %</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-4 text-sm text-muted-foreground">
          {job.description}
        </p>
      </CardContent>
      <CardFooter>
        <Link className="w-full" href={`/home/apply/${job.id}`}>
          <Button className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
