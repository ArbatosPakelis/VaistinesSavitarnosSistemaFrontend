import { useEffect, useState } from "react";
import usePrivateApi from "../hooks/usePrivateApi.js";
import useAuth from "../hooks/useAuth.js";

export default function MainPage(req){
    const { auth} = useAuth();
    const [errorMessage, setErrorMessage] = useState('');
    const PrivateApi = usePrivateApi();

    return (
        <>
            <h3>Welcome to the main page !</h3>
            { console.log(auth) }
        </>
    );
}