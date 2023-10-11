import { ReactNode, createContext, useCallback, useContext, useState } from "react";
import { User } from "../models/User";
import { postRequest } from "../utils/Service";
import { environment } from "../environments/environment";
import {  useAlert } from "../providers/AlertProvider";

interface AuthContextValue {
  user: object | null;
  updateRegisterInfo: (info: any) => void;
  registerUser: (info: any) => void;
  registerInfo: object;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {

  const [user, setUser] = useState<User | null>(null);
  const [registerErr, setRegisterErr] = useState<string | null>(null);
  
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [registerInfo, setRegisterInfo] = useState({
    username: "",
    email: "",
    password: "",
  });


  
  const updateRegisterInfo = useCallback((info: any) => {
    console.log(info);
    setRegisterInfo(info);
  }, []);
  
  const { showAlert } = useAlert(); // Use the context hook

  const registerUser = useCallback(async (e: any) => {

    console.log(registerInfo);
    e.preventDefault();
    setIsLoading(true);
    setRegisterErr(null);



    const res = await postRequest(
      `${environment.BASE_URL}/users/register`,
      JSON.stringify(registerInfo)
    );

    setIsLoading(false);

   

    if (res.err)  {
        showAlert(res.msg,'warning'); // Show the error message
      return;
    }
    // TODO: check if this is the correct way to store user in local storage
    localStorage.setItem("user", JSON.stringify(res));
    setUser(res); // stored in local storage
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        registerInfo,
        updateRegisterInfo,
        registerUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
