import * as React from "react";

import { Button } from "./button";
import { Label } from "./label";
import { Input } from "./input";
import { Loader } from "lucide-react";

import { FormEvent, useContext } from "react";
import { AuthContext } from "@/context/AuthContexts";

interface UserAuthFormProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSubmit"> {}

export function UserAuthForm({
  className,

  ...props
}: UserAuthFormProps) {
  const { isLoading, loginUser } = useContext(AuthContext) || {};

  const formRef = React.useRef<HTMLFormElement | null>(null);

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = formRef.current
      ? new FormData(formRef.current)
      : undefined;

    if (loginUser && formData) {
      loginUser(formData);
    }
  };

  return (
    <div className={className} {...props}>
      <form onSubmit={handleFormSubmit} ref={formRef}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
            />
            <Label className="sr-only" htmlFor="password">
              Email
            </Label>
            <Input
              id="password"
              name="password"
              placeholder="********"
              type="password"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            Sign In with Email
          </Button>
        </div>
      </form>
    </div>
  );
}
