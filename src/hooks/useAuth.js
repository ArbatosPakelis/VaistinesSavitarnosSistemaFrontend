import { useContext } from "react";
import AuthContext from "../context/AuthProvider.js";

const useAuth = () => {
    const { auth, setAuth } = useContext(AuthContext);
    return { auth, setAuth }; // Return both auth and setAuth
}

export default useAuth;