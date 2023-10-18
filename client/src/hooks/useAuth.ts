
import AuthContext from "@/context/AuthContexts";
import { useContext, useDebugValue } from "react";


const useAuth = () => {
    const { auth } = useContext(AuthContext) as any;
    useDebugValue(auth, auth => auth?.user ? "Logged In" : "Logged Out")
    return useContext(AuthContext);
}

export default useAuth;