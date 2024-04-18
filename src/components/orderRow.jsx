import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation} from 'react-router-dom';

export default function OrderRow(req){
    const [dateTime1, setDateTime1] = useState();
    const [dateTime2, setDateTime2] = useState();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || `/order/${req.order.id}`;

    useEffect(() => {
        setDateTime1(new Date(req.order.createdAt))
        setDateTime2(new Date(req.order.updatedAt))
    }, []);

    return (
        <>
            <div className="OrderRow" onClick={() => { navigate(from, {replace: true}) }}>
                <div className="orderContainer">
                    <p className="orderCol">
                        Būsena<br/>
                        <p style={{marginBottom:15}}></p>
                        {req.order.state}
                    </p>
                </div>
                <div className="orderContainer">
                    <p className="orderCol">
                        Kaina<br/>
                        <p style={{marginBottom:15}}></p>
                        {req.order.price}€
                    </p>
                </div>
                <div className="orderContainer">
                    <p className="orderCol" style={{width:200}}>
                        Sukūrimo data<br/>
                        <p style={{marginBottom:15}}></p>
                        { dateTime1 ? `${dateTime1.getFullYear()}-${dateTime1.getMonth() + 1}-${dateTime1.getDate()} ${dateTime1.toLocaleTimeString()}` : "loading"}
                    </p>
                </div>
                <div className="orderContainer" style={{width:250}}>
                    <p className="orderCol">
                        Paskutinio keitimo data<br/>
                        <p style={{marginBottom:15}}></p>
                        {dateTime2 ? `${dateTime2.getFullYear()}-${dateTime2.getMonth() + 1}-${dateTime2.getDate()} ${dateTime2.toLocaleTimeString()}` : "loading"}
                    </p>
                </div>
                <div className="orderContainer">
                    <p className="orderCol">
                        Naudotojas<br/>
                        <p style={{marginBottom:15}}></p>
                        {req.user?.username || "hold"}
                    </p>
                </div>
            </div>
        </>
    );
}