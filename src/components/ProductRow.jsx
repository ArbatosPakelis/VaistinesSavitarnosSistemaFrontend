import { useEffect, useState, useRef } from "react";
import usePrivateApi from "../hooks/usePrivateApi.js";
import useAuth from "../hooks/useAuth.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function ProductRow(req){
    const { auth} = useAuth();
    const [errorMessage, setErrorMessage] = useState('');
    const PrivateApi = usePrivateApi();
    const infoRef = useRef(null);
    const amountRef = useRef(null);
    const priceRef = useRef(null);
    const [rowHeight, setRowHeight] = useState(0);

    useEffect(() => {
        // maintain correct size of item list as the list grows
        if (amountRef.current && infoRef.current && priceRef.current) {
            const itemListHeightWithExtra = infoRef.current.clientHeight;
            setRowHeight(itemListHeightWithExtra);
            amountRef.current.style.height = `${itemListHeightWithExtra}px`;
            priceRef.current.style.height = `${itemListHeightWithExtra}px`;
        }
    }, []);

    return (
        <>
            <div className="ProductRow">
                <div className="infoContainer" ref={infoRef}>
                    <p><b>{req.card.name}</b></p>
                    <p>{req.card.manufacturer}</p>
                    <p>{req.card.packaging}</p>
                </div>
                <div className="amountContainer" ref={amountRef}>
                    <p>
                        Kiekis<br/>
                            {req.mode == 1 ? (
                                <>
                                    <button className="incButtons" style={{display:"inline-block"}}>-</button>
                                    <p style={{display:"inline-block"}}>{req.product.amount}</p>
                                    <button className="incButtons" style={{display:"inline-block"}}>+</button>
                                </>
                            ) : req.mode == 2 || req.mode == 3 ?(
                                <>
                                    <p style={{marginBottom:15}}></p>
                                    {req.product.amount}
                                </>
                                
                            ) : (
                                <></>
                            )}
                    </p>
                </div>
                <div className="priceContainer" ref={priceRef}>
                    <p className="priceP">
                        Kaina<br/>
                        <p style={{marginBottom:15}}></p>
                        {req.product.price}€
                    </p>
                </div>
                <div className="priceContainer" ref={priceRef}>
                    {req.mode == 1 ? (
                        <button className="incButtons">
                            <FontAwesomeIcon icon={faTrash}/>
                        </button>
                    ) : req.mode == 2 ?(
                        <button className="chosenButtons">
                            <p>Pasirinkti</p>
                        </button>
                    ) : req.mode == 3 ?(
                        <>
                            <div className="priceContainer" ref={priceRef}>
                                <p className="priceP">
                                    Riba<br/>
                                    <p style={{marginBottom:15}}></p>
                                    <input id={req.product.id + "limit"} className="deficit" value={req.product.shortage_point}/>
                                    <input id={req.product.id + "change"} value={false} type="hidden"/>
                                </p>
                            </div>
                            <div className="priceContainer" ref={priceRef}>
                                <p className="priceP">
                                    Užsakyti<br/>
                                    <p style={{marginBottom:15}}></p>
                                    <input id={req.product.id + "order"} className="deficit" value="0"/>
                                </p>
                            </div>
                        </>
                    ) : (
                    <></>
                    )}
                </div>
            </div>
        </>
    );
}