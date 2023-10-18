
import AuthContext from "@/context/AuthContexts";
import { useContext, useDebugValue } from "react";


const useAuth = () => {
    const { user } = useContext(AuthContext) as any;
    useDebugValue(user, auth => auth?.user ? "Logged In" : "Logged Out")
    return useContext(AuthContext);
}

export default useAuth;