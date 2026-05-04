"use client";

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

export function JobUserCard({ job }: { job: any }) {
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
              {job.location}
            </Badge>
          </CardAction>
        </div>
        <CardDescription className="text-md text-foreground">
          {job.salary}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-4 text-sm text-muted-foreground">
          {job.description}
        </p>
      </CardContent>
      <CardFooter>
        <Link className="w-full" href={`/home/apply/${job.id}`}>
          <Button className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
