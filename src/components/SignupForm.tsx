"use client";
import { useActionState } from "react";
import { signupAction } from "@/app/actions";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function SignupForm({
  ...props
}: React.ComponentProps<typeof Card>) {
  const [state, formAction, isPending] = useActionState(signupAction, null);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background text-foreground">
      <div className="w-full max-w-sm">
        <Card {...props}>
          {/* Title */}
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
              Enter your information below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction}>
              <FieldGroup>
                {/* Display error message if there is an error */}
                {state?.error && (
                  <p className="text-destructive text-sm font-medium bg-destructive/10 p-2 rounded">
                    {state.error}
                  </p>
                )}

                {/* Name */}
                <Field>
                  <FieldLabel htmlFor="name">Full Name</FieldLabel>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    required
                  />
                </Field>
                {/* Email */}
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                  <FieldDescription>
                    We&apos;ll use this to contact you.
                  </FieldDescription>
                </Field>
                {/* Password */}
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                  />
                </Field>
                {/* Confirm password */}
                <Field>
                  <FieldLabel htmlFor="confirm-password">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    required
                  />
                </Field>

                {/* Buttons group */}
                <FieldGroup>
                  <Field>
                    {/* Submit button */}
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isPending}
                    >
                      {isPending ? "Creating Account..." : "Create Account"}
                    </Button>

                    {/* Signup with google */}
                    <Button
                      variant="outline"
                      type="button"
                      className="w-full mt-2"
                    >
                      Sign up with Google
                    </Button>

                    <FieldDescription className="px-6 text-center mt-4">
                      Already have an account?{" "}
                      <a href="/login" className="underline">
                        Sign in
                      </a>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
