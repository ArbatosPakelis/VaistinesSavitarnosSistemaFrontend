import { useEffect, useState, useRef } from "react";
import usePrivateApi from "../hooks/usePrivateApi.js";
import useAuth from "../hooks/useAuth.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function OrderRow(req){
    const { auth} = useAuth();
    const [errorMessage, setErrorMessage] = useState('');
    const PrivateApi = usePrivateApi();
    // const infoRef = useRef(null);
    // const amountRef = useRef(null);
    // const priceRef = useRef(null);
    const [rowHeight, setRowHeight] = useState(0);

    // useEffect(() => {
    //     // maintain correct size of item list as the list grows
    //     if (amountRef.current && infoRef.current && priceRef.current) {
    //         const itemListHeightWithExtra = infoRef.current.clientHeight;
    //         setRowHeight(itemListHeightWithExtra);
    //         amountRef.current.style.height = `${itemListHeightWithExtra}px`;
    //         priceRef.current.style.height = `${itemListHeightWithExtra}px`;
    //     }
    // }, []);

    return (
        <>
            <div className="ProductRow">
                <div className="priceContainer">
                    <p className="priceP">
                        Būsena<br/>
                        <p style={{marginBottom:15}}></p>
                        {req.order.state}
                    </p>
                </div>
                <div className="priceContainer">
                    <p className="priceP">
                        Kaina<br/>
                        <p style={{marginBottom:15}}></p>
                        {req.order.price}
                    </p>
                </div>
                <div className="priceContainer">
                    <p className="priceP">
                        Sukūrimo data<br/>
                        <p style={{marginBottom:15}}></p>
                        {req.order.createdAt}
                    </p>
                </div>
                <div className="priceContainer">
                    <p className="priceP">
                        Paskutinio data<br/>
                        <p style={{marginBottom:15}}></p>
                        {req.order.createdAt}
                    </p>
                </div>
                <div className="priceContainer">
                    <p className="priceP">
                        Paskutinio data<br/>
                        <p style={{marginBottom:15}}></p>
                        {req.user?.username || "hold"}
                    </p>
                </div>
            </div>
        </>
    );
}