import { useEffect, useState, useRef } from "react";
import usePrivateApi from "../hooks/usePrivateApi.js";
import useAuth from "../hooks/useAuth.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faTrash} from "@fortawesome/free-solid-svg-icons"

export default function ProductRow(req){
    const { auth, setAuth} = useAuth();
    const [errorMessage, setErrorMessage] = useState('');
    const PrivateApi = usePrivateApi();
    const infoRef = useRef(null);
    const amountRef = useRef(null);
    const priceRef = useRef(null);
    const [rowHeight, setRowHeight] = useState(0);
    const [bcolor, setBcolor] = useState("");

    async function createOnChangeHandler(event) {
        const amount = parseInt(event.target.value);
        if (amount) {
            req.orderF(req.product.id, amount);
        }
    }

    useEffect(() => {
        // maintain correct size of item list as the list grows
        if (amountRef.current && infoRef.current && priceRef.current) {
            const itemListHeightWithExtra = infoRef.current.clientHeight;
            setRowHeight(itemListHeightWithExtra);
            amountRef.current.style.height = `${itemListHeightWithExtra}px`;
            priceRef.current.style.height = `${itemListHeightWithExtra}px`;
        }
        if(parseInt(req.product.amount) == 0 && parseInt(req.product.shortage_point) >= 0 && req.mode == 3)
        {
            setBcolor("white")
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
            if (response?.status == 200) {
                const basketId = response?.data?.basketId;

                const storedSessionData = localStorage.getItem('auth');
                let jsonData = JSON.parse(storedSessionData);
                if (jsonData)
                {
                    jsonData.basketId = basketId;
                    localStorage.removeItem('auth'); 
                    window.localStorage.setItem("auth", JSON.stringify(jsonData));
                }
                if(auth)
                {

                    if(!jsonData && jsonData != null){
                        jsonData.basketId = basketId;
                        setAuth(jsonData);
                    }
                    else
                    {
                        setAuth({...auth,
                            basketId: basketId
                        })
                    }
                }
                req.reloading();
                req.setS('Produktas sėkmingai pridėtas į krepšelį');
                req.setE('');
            }
        } catch (err) {
          if (!err?.response) {
            req.setE('No Server Response');
          } else if (err.response?.status === 403) {
            req.setE('Forbidden');
          } else if (err.response?.status === 401) {
            req.setE('Unauthorized');
          } else {
            req.setE('Nepavyko pridėti prekės į krepšelį');
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

    async function handleLimit(event) {
        try{
            const response = await PrivateApi.put(
                `/api/v1/orders/updateLimit/${req.product.id}/${event.target.value}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${auth.accessToken}`,
                    },
                }
            );
            if (response?.status === 200) {
                req.reloading();
                req.setS('Riba sėkmingai atnaujinta');
                req.setE('');
            }
        } catch (err) {
            req.setS('');
            if (!err?.response) {
                req.setE('No Server Response');
            } else if (err.response?.status === 403) {
                req.setE('Forbidden');
            } else if (err.response?.status === 401) {
                req.setE('Unauthorized');
            } else {
                req.setE('Comment creation Failed');
            }
        }
    }

    return (
        <>
            <div className={
                req.product.shortage_point === undefined?
                    "ProductRow" : (
                        parseInt(req.product.shortage_point) >= parseInt(req.product.amount) &&
                        parseInt(req.product.amount) != 0 &&
                        parseInt(req.product.shortage_point) != 0 &&
                        req.mode == 3?
                        "ProductRowWarning" : (
                            (parseInt(req.product.amount) == 0 &&
                            parseInt(req.product.shortage_point) >= 0 &&
                            req.mode == 3) ?
                            "ProductRowExpired" : "ProductRow"
                        )
                )
            }>
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
                                    { req.state !== "Įvykdytas" ? (
                                    <>
                                        <button className="incButtons" style={{display:"inline-block"}} onClick={() => handleAmount(1)}>-</button>
                                        <p style={{display:"inline-block"}}>{req.product.amount}</p>
                                        <button className="incButtons" style={{display:"inline-block"}} onClick={() => handleAmount(2)}>+</button>
                                    </>
                                    ) : (
                                        <p style={{ paddingTop:15}}>{req.product.amount}</p>
                                    )}
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
                        <p>
                            {req.product.discount ? `${req.product.price}(-${req.product.discount}%)` : ""}
                        </p>
                        {req.product.discount ? Math.ceil(parseFloat(req.product.price*(parseFloat(parseInt(100-req.product.discount)/100)))*100)/100: req.product.price}€
                    </p>
                </div>
                <div className="priceContainer" ref={priceRef}>
                    <p className="priceP">
                        Min. amžius<br/>
                        <p style={{marginBottom:15}}></p>
                        {req.card.minimal_age ? req.card.minimal_age : ""}
                    </p>
                </div>
                <div className="priceContainer" ref={priceRef}>
                    <p className="priceP">
                        Ar reikia recepto<br/>
                        <p style={{marginBottom:15}}></p>
                        <FontAwesomeIcon icon={faCheck} className={req.card.prescription ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={req.card.prescription ? "hide" : "invalid"} style={{backgroundColor:bcolor}}/>
                    </p>
                </div>
                <div className="priceContainer" ref={priceRef}>
                    {req.state ? (
                        <>
                            {req.state !== "Įvykdytas" ? (
                                <>
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
                                                    <input id={req.product.id + "limit"} className="deficit" defaultValue={req.product.shortage_point} onChange={handleLimit}/>
                                                </p>
                                            </div>
                                            <div className="priceContainer" ref={priceRef}>
                                                <p className="priceP">
                                                    Užsakyti<br/>
                                                    <p style={{marginBottom:15}}></p>
                                                    <input id={req.product.id + "order"} className="deficit" defaultValue="0" onChange={createOnChangeHandler}/>
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                    <>test3</>
                                    )}
                                </>
                            ) : (
                                <></>
                            )}
                        </>
                    ) : (
                        <>test1</>
                    )}
                </div>
            </div>
        </>
    );
}