import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation} from 'react-router-dom';
import usePrivateApi from "../hooks/usePrivateApi.js";
import useAuth from "../hooks/useAuth.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash} from "@fortawesome/free-solid-svg-icons"

export default function UserRow(req){
    const [dateTime1, setDateTime1] = useState();
    const [dateTime2, setDateTime2] = useState();
    const navigate = useNavigate();
    const [settings, setSettings] = useState({});
    const PrivateApi = usePrivateApi();
    const { auth} = useAuth();

    async function fetchingSettings() {
        try {
            // http request
            const response = await PrivateApi.get(`/api/v1/users/getAccountSettings`,
                {
                    headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.accessToken}`,
                    },
                }
            );
            setSettings(response.data);
        } catch (err) {
            if (!err?.response) {
                req.setE('No Server Response');
            } else if (err.response?.status === 404) {
                req.setE('Parinktys nebuvo rastos');
            }  else {
                req.setE('Nepavyko gauti paskirų parinkčių')
            }
        }
    }

    async function updateAdress(event) {
        req.user.adresses_fk = event.target.value;
        updateAccount();
    }

    async function updateRole(event) {
        req.user.user_types_fk = event.target.value;
        updateAccount();
    }

    async function updateAccount() {
        try {
            // http request
            const response = await PrivateApi.put(`/api/v1/users/updateAccount`,
                JSON.stringify({
                    user: req.user
                }),
                {
                    headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.accessToken}`,
                    },
                }
            );
            if(response.status == 200){
                req.reloading();
                req.setE("");
                req.setS("Paskira sėkmingai atnaujinta");
            }
        } catch (err) {
            req.setS("");
            if (!err?.response) {
                req.setE('No Server Response');
            } else if (err.response?.status === 404) {
                req.setE('Nepavyko rasti paskiros');
            }  else {
                req.setE('Nepavyko atnaujinti paskiros')
            }
        }
    }

    async function handleDelete() {
        const confirmed = window.confirm("Ar tikrai norite ištrinti šią paskirą?");
        if(confirmed)
        {
            try {
                const id = req.user?.id
                // http request
                const response = await PrivateApi.delete(`/api/v1/users/deleteAccount/${id}`,
                    {
                        headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${auth.accessToken}`,
                        },
                    }
                );
                if(response.status == 200){
                    req.reloading();
                    req.setE("");
                    req.setS("");
                    
                }
                console.log(response.data);
            } catch (err) {
                req.setS("");
                if (!err?.response) {
                    req.setE('No Server Response');
                } else if (err.response?.status === 404) {
                    req.setE('Nepavyko rasti paskiros');
                }  else {
                    req.setE('Nepavyko atnaujinti paskiros')
                }
            }
        }
        else
        {
            req.setE('Ištrinimas buvo atšauktas');
        }
    }

    useEffect(() => {
        setDateTime1(new Date(req.user.createdAt))
        setDateTime2(new Date(req.user.updatedAt))
        fetchingSettings();
    }, []);

    return (
        <>
            <div className="UserRow">
                <div className="UserCol">
                    <p>
                        <b>Naudotojo vardas</b>
                        <span>{req.user ? req.user.username : "loading..."}</span>
                    </p>
                </div>
                <div className="UserCol">
                    <p>
                        <b>Būsena</b>
                        <span>{req.user ? req.user.status : "loading..."}</span>
                    </p>
                </div>
                <div className="UserCol">
                    <p>
                        <b>Privertimas prisijungti</b>
                        <span>{req.user ? String(req.user.ForceRelogin) : "loading..."}</span>
                    </p>
                </div>
                <div className="UserCol">
                    <p>
                        <b>Naudotojo tipas</b>
                        <div>
                            { settings.roles ? (
                                <>
                                    <select value={req.type} onChange={updateRole}>
                                        {settings.roles.map(row => (
                                            <option key={row.type} value={row.id}>{row.type}</option>
                                        ))}
                                    </select>
                                </>
                            ) : (
                                <p style={{color:"white"}}>loading ...</p>
                            )}
                        </div>
                    </p>
                </div>
                <div className="UserCol" style={{minWidth:300}}>
                    <p>
                        <b>Adresas</b>
                        <div>
                        {settings.adresses && req.adress !== undefined ? (
                            <>
                                <select value={req.adress} onChange={updateAdress}>
                                    <option value={"null"}>Adreso nėra</option>
                                    {settings.adresses.map(row => (
                                        <option key={row.id} value={row.id}>{row.street}</option>
                                    ))}
                                </select>
                            </>
                        ) : (
                            <p style={{color:"white"}}>loading ...</p>
                        )}
                        </div>
                    </p>
                </div>
                <div className="UserCol">
                    <p>
                        <b>Sukūrimo data</b>
                        <span>{dateTime1 ? `${dateTime1.getFullYear()}-${dateTime1.getMonth() + 1}-${dateTime1.getDate()} ${dateTime1.toLocaleTimeString()}` : "loading"}</span>
                    </p>
                </div>
                <div className="UserCol">
                    <p>
                        <b>Paskutinio keitimo data</b>
                        <span>{dateTime2 ? `${dateTime2.getFullYear()}-${dateTime2.getMonth() + 1}-${dateTime2.getDate()} ${dateTime2.toLocaleTimeString()}` : "loading"}</span>
                    </p>
                </div>
                <div className="UserCol">
                    <p>
                        <b>Naudotojas</b>
                        <span>{req.user?.username || "hold"}</span>
                    </p>
                </div>
                <button className="incButtons" onClick={handleDelete}>
                    <FontAwesomeIcon icon={faTrash}/>
                </button>
            </div>
        </>
    );
}