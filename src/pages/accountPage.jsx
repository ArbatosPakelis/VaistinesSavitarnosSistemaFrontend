import { useEffect, useState, useRef } from "react";
import defaultApi from "../apis/defaultApi.js";
import usePrivateApi from "../hooks/usePrivateApi.js";
import useAuth from "../hooks/useAuth.js";
import Header from "../components/header.jsx";
import UserRow from "../components/UserRow.js";

export default function AccountPage(req){
    const { auth} = useAuth();
    const [errorMessage, setErrorMessage] = useState('');
    const PrivateApi = usePrivateApi();
    const errorRef = useRef();
    const [data, setData] = useState("");

    async function fetchingAccounts() {
        try {
            // http request
            const response = await PrivateApi.get(`/api/v1/users/getAllAccounts`,
                {
                    headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.accessToken}`,
                    },
                }
                );
            setData(response.data);
        } catch (err) {
            if (!err?.response) {
                setErrorMessage('No Server Response');
            } else if (err.response?.status === 404) {
                setErrorMessage('Order not found');
            }  else {
                setErrorMessage('Failled loading your order')
            }
            //errorRef.current.focus();
        }
    }

    function findType(types, fk){
        let result;
        for(let k in types){
            if(types[k].id == fk)
            {
                result = types[k];
            }
        }
        if(result)
        {
            return result.type;
        }
        return `loading...`;
    }

    function findAdress(adresses, fk){
        if(fk === null)
        {
            return "adreso nėra";
        }
        let result;
        for(let k in adresses){
            if(adresses[k].id == fk)
            {
                result = adresses[k];
            }
        }
        if(result)
        {
            return `${result.country}; ${result.city}; ${result.street}`;
        }
        return `loading...`;
    }

    useEffect(() => {
        if(auth.id > 0)
        {
            fetchingAccounts();
        }
    }, []);

    useEffect(() => {
        console.log(data);
    }, [data]);


  return (
        <div style={{width:"100%"}}>
            <Header />
            <h1 style={{color:"white"}}>Paskirų sąrašąas</h1>
            <div className="whole" style={{ position: "relative" }}>
                <div style={{ flexDirection: 'row', minHeight: 400 }}>
                    <div className="itemListContainer">
                        {data && data.users && data.users.length > 0 ? (
                            data.users.map((user, index) => (
                                <div key={index} className="userRowContainer">
                                    <UserRow name={"example"+index} user={user} type={findType(data.types, user.user_types_fk)} adress={findAdress(data.adresses, user.adresses_fk)}/>
                                </div>
                            ))
                        ) : (
                            <p>nebuvo rasta jokių prekių</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}