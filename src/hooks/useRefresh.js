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
        setAuth(prev =>{
            return {...prev,
                    accessToken: response.data.accessToken,
                    refreshToken: response.data.refreshToken,
                }
        })
        return response.data.accessToken;
    }
    return refresh;
}

export default useRefresh;