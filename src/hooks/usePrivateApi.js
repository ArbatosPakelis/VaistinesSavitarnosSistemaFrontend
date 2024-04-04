import { PrivateApi } from "../apis/defaultApi.js";
import { useEffect } from "react";
import useRefresh from "./useRefresh.js";
import useAuth from "./useAuth.js";
import axios from "axios";
import { config } from "@fortawesome/fontawesome-svg-core";

const usePrivateApi = () =>{
    const refresh = useRefresh();
    const { auth } = useAuth();
    
    
    useEffect(() => {
        
        const requestIntercept = PrivateApi.interceptors.request.use(
            config => {
                if (!config.headers['Authorization'])
                {
                    config.headers['Authorization'] = `Bearer ${auth.accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)

        )

        const responseIntercept = PrivateApi.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if(error?.response?.status === 401 && !prevRequest?.sent)
                {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return PrivateApi(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            PrivateApi.interceptors.response.eject(requestIntercept);
            PrivateApi.interceptors.response.eject(responseIntercept);
        }
    }, [auth, refresh])

    return PrivateApi;
}

export default usePrivateApi;