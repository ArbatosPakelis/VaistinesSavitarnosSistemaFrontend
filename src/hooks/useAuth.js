import { useContext, useEffect } from "react";
import AuthContext from "../context/AuthProvider.js";


const useAuth = () => {
    let { auth, setAuth } = useContext(AuthContext);

    if(!auth)
    {
        const storedSessionData = localStorage.getItem('auth');
        if(!storedSessionData){
            return { auth, setAuth}
        }
        auth = JSON.parse(storedSessionData);
        return {auth, setAuth};
    }
    
  
    return { auth, setAuth };
  };

export default useAuth;