import { db } from "@/src/db";
import { jobs, applications } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import Analysis from "@/src/models/Analysis";
import connectMongo from "@/src/lib/mongodb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusSwitcher } from "@/src/components/admin/StatusSwitcher";
import { Badge } from "@/components/ui/badge";

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

  return (
    <div className="p-8 flex flex-col items-center">
      {/* nav bar */}
      <div className="flex justify-between items-center w-full">
        <div>
          <h1 className="text-3xl font-bold">Application #{appId}</h1>
          <p className="text-muted-foreground">
            Submitted on: {application.createdAt?.toLocaleDateString()}
          </p>
        </div>
        <StatusSwitcher
          id={appIdNum}
          currentStatus={application.status || "Under Review"}
        />
      </div>

      <Tabs defaultValue="job" className="w-full">
        <TabsList>
          <TabsTrigger value="job">Job Details</TabsTrigger>
          <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
        </TabsList>

        {/* Job Details Tab */}
        <TabsContent value="job" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{job?.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-semibold text-lg text-primary">
                {job?.companyName}
              </p>
              <Badge variant="secondary">{job?.location}</Badge>
              <p className="mt-4 text-muted-foreground">{job?.description}</p>
              <div className="pt-4 border-t">
                <h4 className="font-bold">Requirements:</h4>
                <p className="text-sm">{job?.requirements}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Analysis Tab */}
        <TabsContent value="analysis">
          {aiFeedback ? (
            <Card>
              <CardHeader>
                <CardTitle>AI Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-bold text-primary">Recommendation</h4>
                  <p>{aiFeedback.aiFeedback.recommendation}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Strengths</h4>
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
              </CardContent>
            </Card>
          ) : (
            <p>No AI analysis found for this application.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
