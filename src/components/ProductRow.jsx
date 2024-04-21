import { useEffect, useState, useRef } from "react";
import usePrivateApi from "../hooks/usePrivateApi.js";
import useAuth from "../hooks/useAuth.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function ProductRow(req){
    const { auth, setAuth} = useAuth();
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

    async function handleClick() {
        try{
            const response = await PrivateApi.post(
                `/api/v1/orders/addProduct/${req.product.id}/${auth.basketId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${auth.accessToken}`,
                    },
                }
            );
            if (response?.status === 200) {
                const basketId = response?.data?.basketId;
                setAuth(prevAuth => ({
                    ...prevAuth,
                    basketId: basketId
                }));
                req.reloading();
            }
        } catch (err) {
          if (!err?.response) {
            setErrorMessage('No Server Response');
          } else if (err.response?.status === 403) {
            setErrorMessage('Forbidden');
          } else if (err.response?.status === 401) {
            setErrorMessage('Unauthorized');
          } else {
            setErrorMessage('Comment creation Failed');
          }
        }
    }

    async function handleDelete() {
        try{
            const response = await PrivateApi.delete(
                `/api/v1/orders/deleteProduct/${req.product.id}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${auth.accessToken}`,
                    },
                }
            );
            console.log("success:" + response);
            if (response?.status === 200) {
                req.reloading();
            }
        } catch (err) {
          if (!err?.response) {
            setErrorMessage('No Server Response');
          } else if (err.response?.status === 403) {
            setErrorMessage('Forbidden');
          } else if (err.response?.status === 401) {
            setErrorMessage('Unauthorized');
          } else {
            setErrorMessage('Comment creation Failed');
          }
          console.log("error:" + err);
        }
    }

    async function handleAmount(operation) {
        try{
            const response = await PrivateApi.put(
                `/api/v1/orders/updateProductAmount/${req.product.id}/${operation}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${auth.accessToken}`,
                    },
                }
            );
            console.log(response.data);
            if (response?.status === 200) {
                req.reloading();
            }
        } catch (err) {
          if (!err?.response) {
            setErrorMessage('No Server Response');
          } else if (err.response?.status === 403) {
            setErrorMessage('Forbidden');
          } else if (err.response?.status === 401) {
            setErrorMessage('Unauthorized');
          } else {
            setErrorMessage('Comment creation Failed');
          }
          console.log("error:" + err);
        }
    }

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
                                    <button className="incButtons" style={{display:"inline-block"}} onClick={() => handleAmount(1)}>-</button>
                                    <p style={{display:"inline-block"}}>{req.product.amount}</p>
                                    <button className="incButtons" style={{display:"inline-block"}} onClick={() => handleAmount(2)}>+</button>
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
                        <button className="incButtons" id={"remove"+req.product.id} onClick={handleDelete}>
                            <FontAwesomeIcon icon={faTrash}/>
                        </button>
                    ) : req.mode == 2 ?(
                        <button className="chosenButtons" id={"chosen"+req.product.id} onClick={handleClick}>
                            <p>Pasirinkti</p>
                        </button>
                    ) : req.mode == 3 ?(
                        <>
                            <div className="priceContainer" ref={priceRef}>
                                <p className="priceP">
                                    Riba<br/>
                                    <p style={{marginBottom:15}}></p>
                                    <input id={req.product.id + "limit"} className="deficit" defaultValue={req.product.shortage_point}/>
                                    <input id={req.product.id + "change"} defaultValue={false} type="hidden"/>
                                </p>
                            </div>
                            <div className="priceContainer" ref={priceRef}>
                                <p className="priceP">
                                    Užsakyti<br/>
                                    <p style={{marginBottom:15}}></p>
                                    <input id={req.product.id + "order"} className="deficit" defaultValue="0"/>
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