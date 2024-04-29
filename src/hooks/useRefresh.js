import { json } from "react-router-dom";
import defaultApi from "../apis/defaultApi.js";
import useAuth from "./useAuth.js";

const useRefresh = () => {
    const { auth, setAuth} = useAuth();

    const refresh = async() => {

        const response = await defaultApi.post("/api/v1/users/tokens",
            JSON.stringify({}),
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.refreshToken}`,
                },
                withCredentials: true,
            }
        );
        
        const storedSessionData = localStorage.getItem('auth');
        let jsonData = JSON.parse(storedSessionData);

        if (jsonData) {
            jsonData.accessToken = response.data.accessToken;
            jsonData.refreshToken = response.data.refreshToken;
            localStorage.removeItem('auth'); 
            window.localStorage.setItem("auth", JSON.stringify(jsonData));
        }
        else{
            setAuth(prev =>{
                return {...prev,
                        accessToken: response.data.accessToken,
                        refreshToken: response.data.refreshToken,
                    }
            })
        }
        return response.data.accessToken;
    }
    return refresh;
}

export default useRefresh;