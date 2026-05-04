"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";
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

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background text-foreground">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card>
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
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
                  </Field>
                  {/* Password */}
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <Input id="password" name="password" type="password" required />
                  </Field>
                  <Field>
                    {/* login */}
                    <Button type="submit" disabled={isPending}>
                      {isPending ? "Logging in..." : "Login"}
                    </Button>
                    {/* login with google */}
                    <Button variant="outline" type="button">
                      Login with Google
                    </Button>
                    <FieldDescription className="text-center">
                      Don&apos;t have an account? <a href="/signup">Sign up</a>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
