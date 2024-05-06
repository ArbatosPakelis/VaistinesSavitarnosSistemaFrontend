import { useEffect, useState, useRef } from "react";
import usePrivateApi from "../hooks/usePrivateApi.js";
import useAuth from "../hooks/useAuth.js";
import Header from "../components/header.jsx";
import UserRow from "../components/UserRow.js";

export default function AccountPage(req){
    const { auth} = useAuth();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
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
                setErrorMessage('Paskiros nebuvo rastos');
            }  else {
                setErrorMessage('Nepavyko atlikti paskirų paieškos')
            }
            //errorRef.current.focus();
        }
    }

    useEffect(() => {
        if(auth.id > 0)
        {
            fetchingAccounts();
        }
    }, []);


  return (
        <div style={{width:"100%"}}>
            <Header />
            <p className={successMessage ? "successMessage" : "offscreen"} aria-live="assertive">{successMessage}</p>
            <p className={errorMessage ? "errorMessage" : "offscreen"} aria-live="assertive">{errorMessage}</p>
            <h1 style={{color:"white"}}>Paskirų sąrašąas</h1>
            <div className="whole" style={{ position: "relative" }}>
                <div style={{ flexDirection: 'row', minHeight: 400 }}>
                    <div className="itemListContainer">
                        {data && data.users && data.users.length > 0 ? (
                            data.users.map((user, index) => (
                                <div key={index} className="userRowContainer">
                                    <UserRow name={"example"+index} user={user} type={user.user_types_fk} adress={user.adresses_fk}  setS={setSuccessMessage} setE={setErrorMessage} reloading={fetchingAccounts}/>
                                </div>
                            ))
                        ) : (
                            <p style={{color:"white"}}>nebuvo rasta jokių prekių</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}