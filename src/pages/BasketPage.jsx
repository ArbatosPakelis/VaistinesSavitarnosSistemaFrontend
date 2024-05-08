import { useEffect, useState, useRef } from "react";
import defaultApi from "../apis/defaultApi.js";
import usePrivateApi from "../hooks/usePrivateApi.js";
import useAuth from "../hooks/useAuth.js";
import Header from "../components/header.jsx";
import ProductRow from "../components/ProductRow.jsx";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export default function BasketPage(req){
    const { auth, setAuth} = useAuth();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const PrivateApi = usePrivateApi();
    const [itemListHeight, setItemListHeight] = useState(0);
    const wholeRef = useRef(null);
    const itemListRef = useRef(null);
    const errorRef = useRef();
    const [data, setData] = useState("");
    const [payment, setPayment] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    let success = params.get('success');
    const [valid, setValid] = useState();
    const [age, setAge] = useState();

    async function fetchingOrder() {
        try {
            // http request
            const response = await PrivateApi.get(`/api/v1/orders/getOrder/${auth.basketId}`,
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
                setErrorMessage('Nepavyko gauti krepšelio')
            }
        }
        recountHeight();
    }

    async function utilityOrder() {
        try {
            // http request
            const response = await PrivateApi.post(`/api/v1/orders/utilityOrder/${auth.basketId}`,
                {
                    headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.accessToken}`,
                    },
                }
                );
            if(response.data.state == "Įvykdytas")
            {
                setErrorMessage('');
                setSuccessMessage('Avarinis užsakymas įvykdytas');
            }
            const storedSessionData = localStorage.getItem('auth');
            let jsonData = JSON.parse(storedSessionData);

            if (jsonData) {
                jsonData.basketId = 0;
                localStorage.removeItem('auth'); 
                window.localStorage.setItem("auth", JSON.stringify(jsonData));
                setData("");
            }
            if(auth)
            {
                if(!jsonData && jsonData != null){
                    jsonData.basketId = 0;
                    setAuth(jsonData);
                    setData("");
                }
                else
                {
                    setAuth(prev =>{
                        return {...prev,
                                basketId: 0
                        }
                    })
                    setData("");
                }
            }
        } catch (err) {
            setSuccessMessage('');
            if (!err?.response) {
                setErrorMessage('No Server Response');
            } else if (err.response?.status === 404) {
                setErrorMessage('Order not found');
            }
        }
    }

    async function completeOrder() {
        if(!auth)
        {
            const storedSessionData = localStorage.getItem('auth');
            let jsonData = JSON.parse(storedSessionData);

            if (jsonData) {
                setAuth(jsonData);
            }
            else{
                setErrorMessage('Order could not be retrieved');
            }
        }
        
        try {
            // http request
            const response = await PrivateApi.post(`/api/v1/orders/paymentCompletion/${auth.basketId}/${success}`,
                {
                    headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.accessToken}`,
                    },
                }
            );
            if(response.data.state == "Įvykdytas")
            {
                setSuccessMessage('Užsakymas įvykdytas');
            }
            else if(response.data.state == "Atšauktas")
            {
                setSuccessMessage('Užsakymas atšauktas');
            }
            setErrorMessage("");
        } catch (err) {
            setSuccessMessage('');
            if (!err?.response) {
                setErrorMessage('No Server Response');
            } else if (err.response?.status === 404) {
                setErrorMessage('Order not found');
            } else if(err.response?.status === 500)
            {
                setErrorMessage('Storage may be offline');
            }
            
        }

        const storedSessionData = localStorage.getItem('auth');
        let jsonData = JSON.parse(storedSessionData);

        if (jsonData) {
            jsonData.basketId = 0;
            localStorage.removeItem('auth'); 
            window.localStorage.setItem("auth", JSON.stringify(jsonData));
            setData("");
        }
    }

    async function recountHeight() {
        if (itemListRef.current && wholeRef.current) {
            let value = 50;
            if(window.innerWidth < 1510){
                value = 250
            }
            const itemListHeightWithExtra = itemListRef.current.clientHeight + value;
            setItemListHeight(itemListHeightWithExtra);
            wholeRef.current.style.height = `${itemListHeightWithExtra}px`;
        }
    }

    useEffect(() => {
        // maintain correct size of item list as the list grows
        recountHeight();
        if(success != undefined && success != null && success == "true" || success == "false")
        {
            completeOrder();
        }
        else{
            if(auth.basketId > 0)
            {
                fetchingOrder();
            }
        }

    }, []);

    async function handleTap() {
        const prescriptionCheck = await checkPrescriptions();
        if(prescriptionCheck.validity == true && prescriptionCheck.age  == true){
            try{
                const response = await PrivateApi.post(
                    `/api/v1/orders/payment/${auth.basketId}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${auth.accessToken}`,
                        },
                    }
                );
                if (response?.status === 200) {

                    const storedSessionData = localStorage.getItem('auth');
                    if(storedSessionData){
                        localStorage.removeItem('auth');
                    }
                    window.localStorage.setItem("auth", JSON.stringify(auth))

                    window.location = response.data.session;
                    setValid(false);
                    setAge(false);
                }
            } catch (err) {
            if (!err?.response) {
                setErrorMessage('No Server Response');
            } else if (err.response?.status === 403) {
                setErrorMessage('Forbidden');
            } else if (err.response?.status === 401) {
                setErrorMessage('Unauthorized');
            } else {
                setErrorMessage('Negalima atlikti apmokėjimo jeigu nėra prekių');
            }
            }
        }
        else{
            if(prescriptionCheck.validity == false)
            {
                setErrorMessage('Trūksta recepto vaistams');
            }
            else if(prescriptionCheck.age  == false)
            {
                setErrorMessage('Reikalingas patvirtinimas vaistų amžiui');
            }
        }
    }

    async function checkPrescriptions() {
        try{
            const response = await PrivateApi.get(
                `/api/v1/orders/checkValidity/${auth.basketId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${auth.accessToken}`,
                    },
                }
            );
            if (response?.status === 200) {
                setValid(Boolean(response?.data?.validity));
                setAge(Boolean(response?.data?.age))
                return {
                    validity: response?.data?.validity,
                    age: response?.data?.age
                };
            }
        } catch (err) {
          if (!err?.response) {
            setErrorMessage('No Server Response');
          } else if (err.response?.status === 403) {
            setErrorMessage('Forbidden');
          } else if (err.response?.status === 401) {
            setErrorMessage('Unauthorized');
          } else {
            setErrorMessage('Nepavyko patikrinti ar yra receptų');
          }
          return false;
        }
    }

    async function handleCancel() {
        const confirmed = window.confirm("Ar tikrai norite išvalyti krepšelį?");
        if(confirmed)
        {
            try{
                const response = await PrivateApi.post(
                    `/api/v1/orders/calcelOrder/${auth.basketId}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${auth.accessToken}`,
                        },
                    }
                );
                if (response?.status === 200) {
                    const storedSessionData = localStorage.getItem('auth');
                    let jsonData = JSON.parse(storedSessionData);
                    
                    if (jsonData) {
                        jsonData.basketId = 0;
                        localStorage.removeItem('auth'); 
                        window.localStorage.setItem("auth", JSON.stringify(jsonData));
                        setData(undefined);
                    }
                    if(auth)
                    {
                        if(!jsonData && jsonData != null){
                            jsonData.basketId = 0;
                            setAuth(jsonData);
                            setData(undefined);
                        }
                        else
                        {
                            setAuth(prev =>{
                                return {...prev,
                                        basketId: 0
                                }
                            })
                            setData(undefined);
                        }
                    }
                    setData(undefined);
                    setErrorMessage('');
                    setSuccessMessage('Krepšelis buvo sėkmingai išvalytas');
                }
            } catch (err) {
                setSuccessMessage('');
            if (!err?.response) {
                setErrorMessage('No Server Response');
            } else if (err.response?.status === 403) {
                setErrorMessage('Forbidden');
            } else if (err.response?.status === 401) {
                setErrorMessage('Unauthorized');
            } else {
                setErrorMessage('Payment creation Failed');
            }
            }
        }
        else
        {
            req.setErrorMessage('Krepšelio išvalymas buvo atšauktas');
        }
    }

    async function handleDiscount() {
        try{
            const response = await PrivateApi.post(
                `/api/v1/orders/applyDiscounts/${auth.basketId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${auth.accessToken}`,
                    },
                }
            );
            if (response?.status === 200) {
                fetchingOrder();
                setErrorMessage('');
                setSuccessMessage('Nuolaidos sėkmingai pridėtos');
            }
        } catch (err) {
            setSuccessMessage('');
            if (!err?.response) {
                setErrorMessage('No Server Response');
            } else if (err.response?.status === 403) {
                setErrorMessage('Nuolaidos jau yra pridėtos');
            } else if (err.response?.status === 401) {
                setErrorMessage('Unauthorized');
            } else {
                setErrorMessage('Nepavyko gauti nuolaidų');
            }
        }
    }

  return (
        <div style={{width:"100%"}}>
            <Header />
            <h1 style={{color:"white"}}>Krepšelis</h1>
            <p className={successMessage ? "successMessage" : "offscreen"} aria-live="assertive">{successMessage}</p>
            <p className={errorMessage ? "errorMessage" : "offscreen"} aria-live="assertive">{errorMessage}</p>
            <div ref={wholeRef} style={{ position: "relative" }}>
                <div style={{ flexDirection: 'row', minHeight: 400 }}>
                    <div className="itemList" ref={itemListRef}>
                        {data && data.order_products && data.order_products.length > 0 ? (
                            data.order_products.map((product, index) => (
                                <div key={index} style={{ display: "flex" }}>
                                    <ProductRow name={"example"+index} card={data.product_cards[index]} product={product} mode={1} reloading={fetchingOrder} state="basket"/>
                                </div>
                            ))
                        ) : (
                            <p className="price" style={{fontSize:22,height:100, marginTop:0, marginLeft:0, width:950}}>nebuvo rasta jokių prekių</p>
                        )}
                    </div>
                    <div className="price" style={{verticalAlign:"sub"}}>
                        <p className="priceChild" >Kaina:</p>
                        <p className="priceChild">{data ? data.order.price : 0}€</p>
                    </div>
                </div>
                <div className="bottomMeniu">
                    { auth.role === 2 ? (
                        <button className="blueButton" style={{marginRight:10}} onClick={utilityOrder}>
                            Avarinis
                        </button>
                    ): (
                        <></>
                    )}
                    <button className="blueButton" style={{marginRight:10}} onClick={handleTap}>
                        Apmokėti
                    </button>
                    <button className="blueButton" style={{marginRight:10}} onClick={handleDiscount}>
                        Nuolaidų kortelė
                    </button>
                    <button className="blueButton" style={{marginRight:10}} onClick={handleCancel}>
                        Atšaukti
                    </button>
                </div>
                {/* { payment == true ? (
                    <PaymentForm/>
                ) : (
                    <></>
                )} */}
            </div>
        </div>
    );
}