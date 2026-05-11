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
import { db } from "@/src/db";
import { jobs } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import Analysis from "@/src/models/Analysis";
import connectMongo from "@/src/lib/mongodb";
import { cn } from "@/lib/utils";

const statusConfig = {
  Accepted: "bg-green-100 text-green-700 border-green-200",
  Rejected: "bg-red-100 text-red-700 border-red-200",
  "Under Review": "bg-yellow-100 text-yellow-700 border-yellow-200",
};

export async function ApplicationCard({ application }: { application: any }) {
  const currentStatusStyle =
    statusConfig[application.status as keyof typeof statusConfig] ||
    "bg-gray-100 text-gray-700 border-gray-200";
  try {
    const job = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, application.jobId))
      .get();

    if (!job) return null;

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
            <CardTitle className="text-xl font-bold">{job.title}</CardTitle>
            <CardAction>
              <Badge
                variant="secondary"
                className={cn("text-sm", currentStatusStyle)}
              >
                {application.status}
              </Badge>
            </CardAction>
          </div>
          <CardDescription className="text-md text-foreground">
            <p>AI Score: {application.aiScore} %</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Applied: {new Date(application.createdAt).toDateString()}
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild variant="default" className="mt-2 w-full cursor-pointer">
            <a
              href={application.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open CV
            </a>
          </Button>
        </CardFooter>
      </Card>
    );
  } catch (err) {
    if (err instanceof Error) {
      console.log("⛔️ err in app card:", err.message);
    }
    return null;
  }
}
