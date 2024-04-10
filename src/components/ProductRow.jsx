import { useEffect, useState } from "react";
import usePrivateApi from "../hooks/usePrivateApi.js";
import useAuth from "../hooks/useAuth.js";

export default function ProductRow(req){
    const { auth} = useAuth();
    const [errorMessage, setErrorMessage] = useState('');
    const PrivateApi = usePrivateApi();

    return (
        <>
            <div className="ProductRow">{req.name}</div>
        </>
    );
}