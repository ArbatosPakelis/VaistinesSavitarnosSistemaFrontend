import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation} from 'react-router-dom';

export default function UserRow(req){
    const [dateTime1, setDateTime1] = useState();
    const [dateTime2, setDateTime2] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        setDateTime1(new Date(req.user.createdAt))
        setDateTime2(new Date(req.user.updatedAt))
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
                        <b>Slaptažodis</b>
                        <span><input className="inp" id={`row`+req.user.id} style={{width: "100%"}}/></span>
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
                        <span>{req.type ? req.type : "loading..."}</span>
                    </p>
                </div>
                <div className="UserCol" style={{minWidth:300}}>
                    <p>
                        <b>Adresas</b>
                        <span>{req.adress !== undefined ? req.adress : "loading..."}</span>
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
            </div>
        </>
    );
}