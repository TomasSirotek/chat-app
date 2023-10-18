import * as React from "react";

import { Button } from "./button";
import { Label } from "./label";
import { Input } from "./input";
import { Loader } from "lucide-react";

import { FormEvent, useContext, useRef } from "react";
import { Checkbox } from "./checkbox";
// import { AuthContext } from "@/context/AuthContexts";


interface UserAuthFormProps {
  className?: string;
  onSubmit: (formData: FormData) => void; // Define onSubmit prop as a function
  isLoading: boolean;
  togglePersist: () => void;
}

export function UserAuthForm({
  className,
  onSubmit,
  isLoading,
  togglePersist,
  ...props
}: UserAuthFormProps) {

  const formRef = useRef<HTMLFormElement>(null);

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = formRef.current ? new FormData(formRef.current) : undefined;
    if (formData) {
      onSubmit(formData); // Call the parent's onSubmit function
    }
  };


 
  // const { isLoading, loginUser } = useContext(AuthContext) || {};

  // const formRef = React.useRef<HTMLFormElement | null>(null);

  // const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   const formData = formRef.current
  //     ? new FormData(formRef.current)
  //     : undefined;

  //   if (loginUser && formData) {
  //     loginUser(formData);
  //   }
  // };

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
          <div className="items-top flex space-x-2">
      <Checkbox id="persist" onClick={togglePersist}/>
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor="persist"
          className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
         Remember me
        </label>
        
      </div>
      
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
