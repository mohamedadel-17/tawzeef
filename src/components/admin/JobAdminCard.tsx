"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { deleteJob } from "@/lib/actions/jobs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import JobEditForm from "@/src/components/admin/JobEditForm";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { toast } from "sonner";

export function JobAdminCard({ job }: { job: any }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDelete = async () => {
    try {
      await deleteJob(job.id);
      toast.success("Job deleted successfully", {
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Failed to delete", error);
    } finally {
      setIsDeleting(false);
    }
  };
  const [open, setOpen] = useState(false);
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
          {/* <Button type="button" variant="outline" disabled>
            Edit
          </Button> */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Edit</Button>
            </DialogTrigger>
            <DialogDescription className="sr-only">
              Form to edit a job.
            </DialogDescription>

            <DialogContent>
              <VisuallyHidden.Root>
                <DialogTitle>Edit Job</DialogTitle>
              </VisuallyHidden.Root>
              <JobEditForm job={job} onSuccess={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
          <Button type="button" onClick={handleDelete}>
            Delete
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
