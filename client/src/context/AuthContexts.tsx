import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { User } from "../models/User";
import { getRequest, postRequest } from "../utils/Service";
import { environment } from "../environments/environment";
import { useAlert } from "../providers/AlertProvider";
import { useNavigate } from "react-router-dom";

interface AuthData {
  username: string;
  accessToken: string;
}

interface AuthContextValue {
  auth: AuthData | null;
  setAuth: (data: AuthData | null) => void;
  persist: any;
  setPersist: any;
  user: User | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthData | null>(null);

  const persistData = localStorage.getItem("persist");
  let initialPersist = false;

  if (persistData) {
    try {
      initialPersist = JSON.parse(persistData);
    } catch (error) {
      console.error("Error parsing 'persist' from localStorage:", error);
    }
  }

  const [persist, setPersist] = useState(initialPersist);
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        auth,
        setAuth,
        persist,
        setPersist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

// const navigate = useNavigate();

// const [user, setUser] = useState<User | null>(null);

// const [registerErr, setRegisterErr] = useState<string | null>(null);

// const [isLoading, setIsLoading] = useState<boolean>(false);

// const { showAlert, hideAlert } = useAlert(); // Use the context hook

// useEffect(() => {
//   async function autoLogin() {
//     const res = await getRequest( `${environment.BASE_URL}/users/refresh`);

//     if (res.err) {
//       showAlert(res.msg, "warning"); // Show the error message
//       setUser(null);
//       navigate("/login");
//       return;
//     }
//     showAlert(res.message, "success");
//     setUser(res);
//     navigate("/");
//   }
//   autoLogin();
// }, []);

// // logout user
// const logoutUser = useCallback(async () => {

//   const res = await getRequest(
//     `${environment.BASE_URL}/users/logout`,
//   );

//   if (res.err) {
//     showAlert(res.msg, "warning"); // Show the error message
//     return;
//   }
//   showAlert(res.message, "success");
//   setUser(null);
//   navigate("/login");
// }, []);

// //TODO: Fix this LATER
// const registerUser = useCallback(
//   async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setRegisterErr(null);

//     const data = new FormData(e.currentTarget);

//     const registerInfoConst = {
//       username: data.get("username"),
//       email: data.get("email"),
//       password: data.get("password"),
//     };

//     const res = await postRequest(
//       `${environment.BASE_URL}/users/register`,
//       JSON.stringify(registerInfoConst)
//     );

//     setIsLoading(false);

//     if (res.err) {
//       showAlert(res.msg, "warning"); // Show the error message
//       return;
//     }
//     showAlert(res.message, "success");

//     setUser(res);
//   },
//   []
// );

// const loginUser = useCallback(async (formData: FormData) => {

//   setRegisterErr(null);

//   const loginInfo = {
//     email: formData.get("email") || 'user@gmail.com',
//     password: formData.get("password") || "React123456!",
//   };

//   if (!loginInfo.email || !loginInfo.password) {
//     showAlert("Please enter all fields", "warning");
//     return;
//   }

//   setIsLoading(true);

//   const res = await postRequest(
//     `${environment.BASE_URL}/users/login`,
//     JSON.stringify(loginInfo)
//   );

//   setIsLoading(false);

//   if (res.err) {
//     showAlert(res.msg, "warning"); // Show the error message
//     return;
//   }
//   showAlert(`Successfully logged in ${loginInfo.email}`, "success");

//   const userData = {
//     id: res._id,
//     username: res.name,
//     email: "res.email",
//     password: "res.password",
//     created_at: "Date.now()",
//   };

//   setUser(userData);
//   navigate("/");
// }, []);
