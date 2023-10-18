import axios from "../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
    const { setLoggedUser, setPersist } = useAuth() as any;

    const logout = async () => {
        setLoggedUser(null); 
        try {
            await axios('/auth/logout', {
                withCredentials: true
            });

            setPersist(false);

        } catch (err) {
            console.error(err);
        }
    }

    return logout;
}

export default useLogout