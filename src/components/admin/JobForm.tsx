"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useActionState, useTransition } from "react";
import { createJobAction } from "@/lib/actions/jobs";

const formSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters.")
    .max(64, "Title must be at most 32 characters."),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters.")
    .max(500, "Description must be at most 100 characters."),
  requirements: z
    .string()
    .min(20, "Requirements must be at least 20 characters.")
    .max(300, "Requirements must be at most 100 characters."),
  salary: z.string().min(1, "Salary range is required."),
  location: z
    .union([z.literal("Remote"), z.literal("On-site"), z.literal("Hybrid")])
    .catch("Remote"),
});

export default function JobForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      requirements: "",
      salary: "",
      location: "Remote",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("requirements", data.requirements);
    formData.append("salary", data.salary);
    formData.append("location", data.location);

    startTransition(() => {
      formAction(formData);
    });

    toast("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    });
  }
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState(createJobAction, null);

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Add New Job Application</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* Display error message if there is an error */}
            {state?.error && (
              <p className="text-destructive text-sm font-medium bg-destructive/10 p-2 rounded">
                {state.error}
              </p>
            )}

            {/* Job title */}
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="title">Job Title</FieldLabel>
                  <Input
                    {...field}
                    id="title"
                    name="title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Full Stack Developer"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* Job description */}
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="description"
                      name="description"
                      placeholder="Write a detailed description of the role, including daily tasks, requirements, and what you expect from the ideal candidate..."
                      rows={4}
                      className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value.length}/100 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription>
                    Include information about the tech stack, team structure,
                    and any specific benefits offered.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* Job requirements */}
            <Controller
              name="requirements"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="requirements">Requirements</FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="requirements"
                      name="requirements"
                      placeholder={`Write each requirement on a new line. For example:
- 3+ years of experience with React and Node.js. 
- Strong understanding of database design.
                      `}
                      rows={4}
                      className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {/* {field.value.length}/100 characters */}
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* location */}
              <Controller
                name="location"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="location">Location</FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full max-w-48">
                        <SelectValue placeholder="Select a location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>location</SelectLabel>
                          <SelectItem value="Remote">Remote</SelectItem>
                          <SelectItem value="On-site">On-site</SelectItem>
                          <SelectItem value="Hybrid">Hybrid</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* salary */}
              <Controller
                name="salary"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="salary">Salary</FieldLabel>
                    <Input
                      {...field}
                      id="salary"
                      name="salary"
                      placeholder="e.g. 15,000 - 20,000 EGP"
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
          <Field orientation="horizontal" className="justify-start mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding Job ..." : "Add Job"}
            </Button>
          </Field>
        </form>
      </CardContent>
    </Card>
  );
}
