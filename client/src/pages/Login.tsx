import axios from "@/api/axios";
import { UserAuthForm } from "@/components/ui/user-auth-form";
import { environment } from "@/environments/environment";
import useAuth from "@/hooks/useAuth";
import { User } from "@/models/User";
import { useAlert } from "@/providers/AlertProvider";
import { postRequest } from "@/utils/Service";
import Link from "@mui/material/Link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Login = () => {
  const { setLoggedUser, persist, setPersist } = useAuth() as any;
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const { showAlert } = useAlert() as any;

  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState<User | null>(null);
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const loginUser = useCallback(async (formData: FormData) => {
    const loginInfo = {
      email: formData.get("email") || "user@gmail.com",
      password: formData.get("password") || "React123456!",
    };

    setIsLoading(true);

    if (!loginInfo.email || !loginInfo.password) {
      showAlert("Please enter all fields", "warning");
      return;
    }

    try {
      const res = await axios.post(
        "/auth/login",
        JSON.stringify({
          email: loginInfo.email,
          password: loginInfo.password,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      showAlert(`Successfully logged in ${loginInfo.email}`, "success");


      const userData : User = {
        id: res.data?.id,
        username: res.data?.username,
        email: res.data?.email,
        password: res.data?.password,
        createdAt: res.data?.createdAt,
        accessToken: res.data?.accessToken,
      };
      console.log(userData)

      setLoggedUser({ 
        user: userData ,
        accessToken: res.data?.accessToken,
      });

      setIsLoading(false);
      navigate(from, { replace: true });
    
    } catch (error: any) {
      showAlert(error.message, "warning"); // Show the error message
      setIsLoading(false);
    }
  }, []);

  const togglePersist = () => {
    setPersist((prev: any) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

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
            <UserAuthForm
              isLoading={isLoading}
              onSubmit={loginUser}
              togglePersist={togglePersist}
            />
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
