import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { User } from "../models/User";
import { postRequest } from "../utils/Service";
import { environment } from "../environments/environment";
import { useAlert } from "../providers/AlertProvider";
import { Router } from "react-router-dom";

interface AuthContextValue {
  user: object | null;
  registerUser: (info: any) => void;
  loginUser: (info: any) => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [registerErr, setRegisterErr] = useState<string | null>(null);
  const [loginErr, setLoginErr] = useState<string | null>(null);


  const [isLoading, setIsLoading] = useState<boolean>(false);


  const { showAlert } = useAlert(); // Use the context hook

  const registerUser = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);
      setRegisterErr(null);

      const data = new FormData(e.currentTarget);

      const registerInfoConst = {
        username: data.get("username"),
        email: data.get("email"),
        password: data.get("password"),
      };

      const res = await postRequest(
        `${environment.BASE_URL}/users/register`,
        JSON.stringify(registerInfoConst)
      );

      setIsLoading(false);

      if (res.err) {
        showAlert(res.msg, "warning"); // Show the error message
        return;
      }
      showAlert('Succesfully registered ', "success")

      setUser(res); 
    },
    []
  );


  const loginUser = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
  
        setIsLoading(true);
        setRegisterErr(null);
  
        const data = new FormData(e.currentTarget);
  
        const loginInfo = {
          email: data.get("email"),
          password: data.get("password"),
        };
  
        const res = await postRequest(
          `${environment.BASE_URL}/users/login`,
          JSON.stringify(loginInfo)
        );
  
        setIsLoading(false);
  
        if (res.err) {
          showAlert(res.msg, "warning"); // Show the error message
          return;
        }
        showAlert(`Succesfully loggen in ${loginInfo.email} `, "success")
    
        document.cookie = `token=${res.cookie}`;
        
        setUser(res); 
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        registerUser,
        isLoading,
        loginUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
