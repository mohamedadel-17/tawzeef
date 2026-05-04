"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field } from "@/components/ui/field"

export function JobAdminCard({ job }: { job: any }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{job.title}</CardTitle>
        <CardDescription className="text-md text-foreground">
          {job.location}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-4 text-sm text-muted-foreground">
          {job.description}
        </p>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => alert("Edit")} disabled>
            Edit
          </Button>
          <Button type="submit" form="form-rhf-demo">
            View Details
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
