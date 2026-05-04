"use client"; // <--- Add this at the very top of your form/page file

import { toast } from "sonner";
import { Dropzone } from "@/components/ui/dropzone";
import { applyForJobAction } from "@/lib/actions/applications";
import { Button } from "@/components/ui/button";
import { useActionState, useEffect } from "react";

export default function UploadCV({ params }: { params: { id: string } }) {
  const handleDrop = (files: File[]) => {
    console.log("File received:", files[0]);
  };

  const [state, formAction, isPending] = useActionState(
    applyForJobAction,
    null,
  );

  useEffect(() => {
    if (state?.success) {
      toast.success("Your application has been submitted successfully!");
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);


  return (
    <div className="p-8">
      <form action={formAction}>
        <input type="hidden" name="jobId" value={params.id} />
        <Dropzone
          accept={{ "application/pdf": [".pdf"] }}
          maxFiles={1}
          onDrop={handleDrop}
        />
        <Button type="submit" className="w-full mt-4" disabled={isPending}>
          {isPending ? "Submitting..." : "Apply Application"}
        </Button>
      </form>
    </div>
  );
}
