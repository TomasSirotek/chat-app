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

interface AuthContextValue {
  user: object | null;
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

  const { showAlert } = useAlert(); // Use the context hook

  const registerUser = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);
      setRegisterErr(null);

      const data = new FormData(e.currentTarget);

      const registerInfo3 = {
        ...registerInfo,
        username: data.get("username"),
        email: data.get("email"),
        password: data.get("password"),
      };

      const res = await postRequest(
        `${environment.BASE_URL}/users/register`,
        JSON.stringify(registerInfo3)
      );

      setIsLoading(false);

      if (res.err) {
        showAlert(res.msg, "warning"); // Show the error message
        return;
      }
      showAlert('Succesfully registeref ', "success")
      // TODO: check if this is the correct way to store user in local storage
      localStorage.setItem("user", JSON.stringify(res));
      setUser(res); // stored in local storage
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        registerInfo,
        registerUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
