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


interface AuthContextValue {
  user: User | null;
  setLoggedUser: any;
  refreshToken: string | null;
  setRefreshToken: any;
  persist: any;
  setPersist: any;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setLoggedUser] = useState<User | null>(null);
 const [refreshToken,setRefreshToken] = useState<string | null>(null);
  const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) || false);
  
  return (
    <AuthContext.Provider
      value={{
        user,
        setLoggedUser,
        persist,
        setPersist,
        setRefreshToken,
        refreshToken
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

