import { db } from "@/src/db";
import { jobs, applications } from "@/src/db/schema";
import { count, countDistinct, isNotNull, isNull } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, FileStack, Trash2, Archive } from "lucide-react";

export default async function AdminDashboard() {
  // 1. Job Stats (Active and Deleted)
  const [activeJobsRes] = await db
    .select({ value: count() })
    .from(jobs)
    .where(isNull(jobs.deletedAt));
  const [deletedJobsRes] = await db
    .select({ value: count() })
    .from(jobs)
    .where(isNotNull(jobs.deletedAt));

  // 2. Application Stats (Active and Deleted)
  const [activeAppsRes] = await db
    .select({ value: count() })
    .from(applications)
    .where(isNull(applications.deletedAt));
  const [deletedAppsRes] = await db
    .select({ value: count() })
    .from(applications)
    .where(isNotNull(applications.deletedAt));

  // 3. Unique Users (From active applications only)
  const [uniqueUsersRes] = await db
    .select({ value: countDistinct(applications.userId) })
    .from(applications)
    .where(isNull(applications.deletedAt));

  const mainStats = [
    {
      title: "Active Jobs",
      value: activeJobsRes.value,
      icon: Briefcase,
    },
    {
      title: "Total Applications",
      value: activeAppsRes.value,
      icon: FileStack,
    },
    {
      title: "Unique Users",
      value: uniqueUsersRes.value,
      icon: Users,
    },
  ];

  const archiveStats = [
    {
      title: "Deleted Jobs",
      value: deletedJobsRes.value,
      icon: Trash2,
    },
    {
      title: "Archived Applications",
      value: deletedAppsRes.value,
      icon: Archive,
    },
  ];

  return (
    <div className="space-y-10 bg-background min-h-screen ">
      {/* title section */}
      <div className="w-full flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      {/* Main Statistics */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-1 bg-foreground rounded-full" />
          <h2 className="text-xl font-semibold tracking-tight">
            Main Statistics
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mainStats.map((stat) => (
            <Card key={stat.title} className="shadow-sm pt-6 w-full">
              <CardHeader className="flex items-center justify-between w-full">
                <CardTitle>{stat.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between w-full">
                <div className="text-4xl font-bold">{stat.value}</div>
                <stat.icon className="h-8 w-8" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Archive Statistics */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-1 bg-foreground rounded-full" />
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Archive Statistics
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl">
          {archiveStats.map((stat) => (
            <Card
              key={stat.title}
              className="border-dashed border-2 shadow-none bg-secondary-card"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold text-foreground uppercase tracking-wider">
                  Archive: {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between w-full">
                <div className="text-4xl font-semibold text-foreground">
                  {stat.value}
                </div>
                <stat.icon className="h-8 w-8 text-foreground" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
