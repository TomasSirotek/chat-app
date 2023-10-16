import { AuthContext } from "../context/AuthContexts";
import { useContext, useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import { getRequest } from "../utils/Service";
import { environment } from "../environments/environment";
import Link from "@mui/material/Link";
import React, { Suspense } from "react";
import { useImage } from "react-image";
import { UserAuthForm } from "@/components/ui/user-auth-form";
import { ReactSVG } from "react-svg";
import { Button } from "@/components/ui/button";

const Login = () => {
  const { isLoading, loginUser } = useContext(AuthContext) || {};
  const [error, setError] = useState("");

  const formRef = React.useRef<HTMLFormElement | null>(null);

  const [user, setUser] = useState<any[]>([]);

  const getUser = async () => {
    const res = await getRequest(`${environment.BASE_URL}/users/login`);

    if (res.err) {
      console.log(res.msg);
      return;
    }
    setUser(res.data);
  };

  const handleFormSubmit = (formData: any) => {
    if (loginUser) {
      loginUser(formData);
    }
  };
  return (
    <>
      <div className="container min-h-screen relative flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            Acme Inc
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;This library has saved me countless hours of work and
                helped me deliver stunning designs to my clients faster than
                ever before.&rdquo;
              </p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Login to your account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email below to create your account
              </p>
            </div>
            <UserAuthForm formRef={formRef} onSubmit={handleFormSubmit} />
            <p className="px-8 text-center text-sm text-muted-foreground">
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
