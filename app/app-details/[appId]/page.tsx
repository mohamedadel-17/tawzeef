import { db } from "@/src/db";
import { jobs, applications, users } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import Analysis from "@/src/models/Analysis";
import connectMongo from "@/src/lib/mongodb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusSwitcher } from "@/src/components/admin/StatusSwitcher";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function ApplicationDetailsPage({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;
  const appIdNum = Number(appId);

  await connectMongo();
  const [application, aiFeedback] = await Promise.all([
    db.select().from(applications).where(eq(applications.id, appIdNum)).get(),
    Analysis.findOne({ applicationId: appIdNum }).lean(),
  ]);

  if (!application) return <div>Application not found</div>;

  const job = await db
    .select()
    .from(jobs)
    .where(eq(jobs.id, Number(application.jobId)))
    .get();

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, Number(application.userId)))
    .get();

  if (!user) {
    return <div>Error</div>;
  }

  return (
    <div className="p-8 flex flex-col items-center">
      {/* nav bar */}
      <div className="flex justify-between items-center w-full">
        <div className="space-y-1 mb-4">
          <h1 className="text-3xl font-bold">Application #{appId}</h1>
          <h3 className="text-xl font-semibold">Job Title: {job?.title}</h3>
          <p className="text-muted-foreground">
            Submitted on: {application.createdAt?.toLocaleDateString()}
          </p>
        </div>
        <StatusSwitcher
          id={appIdNum}
          currentStatus={application.status || "Under Review"}
        />
      </div>

      <Tabs defaultValue="analysis" className="w-full">
        <div className="w-full flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
            <TabsTrigger value="user">User Information</TabsTrigger>
            <TabsTrigger value="job">Job Details</TabsTrigger>
          </TabsList>

          {/* Download CV */}
          {aiFeedback?.cvUrl && (
            <Button asChild variant="default" className="mt-2">
              <a
                href={aiFeedback.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open CV
              </a>
            </Button>
          )}
        </div>

        {/* AI Analysis Tab */}
        <TabsContent value="analysis">
          {aiFeedback ? (
            <Card>
              <CardHeader>
                <CardTitle>AI Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-bold text-primary">Summary</h4>
                  <p>{aiFeedback.aiFeedback.summary}</p>
                </div>
                <div>
                  <h3 className="font-bold text-primary">
                    Decision: {aiFeedback.aiFeedback.status}
                  </h3>
                  <div className="p-4">
                    <h4 className="font-bold text-primary">Decision Summary</h4>
                    <p>{aiFeedback.aiFeedback.decisionSummary}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-green-500">Strengths</h4>
                  <ul className="list-disc pl-5">
                    {aiFeedback.aiFeedback.strengths.map(
                      (s: string, i: number) => (
                        <li key={i}>{s}</li>
                      ),
                    )}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-destructive">Weaknesses</h4>
                  <ul className="list-disc pl-5">
                    {aiFeedback.aiFeedback.weaknesses.map(
                      (w: string, i: number) => (
                        <li key={i}>{w}</li>
                      ),
                    )}
                  </ul>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <h4 className="font-bold text-primary">Improvement Tip</h4>
                  <p>{aiFeedback.aiFeedback.improvementTip}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <p>No AI analysis found for this application.</p>
          )}
        </TabsContent>

        {/* User Information Tab */}
        <TabsContent value="user" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Name: {user.name}</CardTitle>
              <p className="text-muted-foreground">Email: {user.email}</p>
            </CardHeader>
          </Card>
        </TabsContent>

        {/* Job Details Tab */}
        <TabsContent value="job" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{job?.title}</CardTitle>
              <div className="flex items-center justify-between gap-4">
                <p className="text-muted-foreground">Salary: {job?.salary}</p>
                <Badge className="text-sm">{job?.location}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <h4 className="font-bold">Description:</h4>
              <p className="mt-4 text-muted-foreground">{job?.description}</p>
              <div className="pt-4 border-t">
                <h4 className="font-bold">Requirements:</h4>
                {job?.requirements &&
                  job.requirements.split("\n").map((line, index) => {
                    const cleanLine = line.replace(/^[\s-*]+/, "").trim();
                    if (!cleanLine) return null;
                    return <p key={index}>• {cleanLine}</p>;
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
