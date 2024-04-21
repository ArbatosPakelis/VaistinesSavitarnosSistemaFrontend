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
                setErrorMessage('Failled loading your order')
            }
            //errorRef.current.focus();
        }
    }

    async function completeOrder() {
        if(!auth)
        {
            setAuth(auth);
        }
        
        try {
            // http request
            const response = await PrivateApi.post(`/api/v1/orders/paymentCompletion/${auth.basketId}`,
                {
                    headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.accessToken}`,
                    },
                }
            );
            console.log(response.data);
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

    useEffect(() => {
        // maintain correct size of item list as the list grows
        if (itemListRef.current && wholeRef.current) {
            const itemListHeightWithExtra = itemListRef.current.clientHeight + 100;
            setItemListHeight(itemListHeightWithExtra);
            wholeRef.current.style.height = `${itemListHeightWithExtra}px`;
        }

        if(auth.basketId > 0)
        {
            fetchingOrder();
        }

        if(success != undefined && Boolean(success) == true)
        {
            completeOrder();
        }

    }, []);

    async function handleTap() {
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
                window.localStorage.setItem("auth", JSON.stringify(auth))
                window.location = response.data.session;
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


  return (
        <div style={{width:"100%"}}>
            <Header />
            <h1 style={{color:"white"}}>Krepšelis</h1>
            <div className="whole" ref={wholeRef} style={{ position: "relative" }}>
                <div style={{ flexDirection: 'row', minHeight: 400 }}>
                <div className="itemList" ref={itemListRef}>
                    {data && data.order_products && data.order_products.length > 0 ? (
                        data.order_products.map((product, index) => (
                            <div key={index} style={{ display: "flex" }}>
                                <ProductRow name={"example"+index} card={data.product_cards[index]} product={product} mode={1} reloading={fetchingOrder}/>
                            </div>
                        ))
                    ) : (
                        <p style={{color:"white", fontSize:22, border:"1px solid white", height:100, padding:10}}>nebuvo rasta jokių prekių</p>
                    )}
                </div>
                <div className="price" style={{verticalAlign:"sub"}}>
                    <p className="priceChild" >Kaina:</p>
                    <p className="priceChild">{data ? data.order.price : 0}€</p>
                </div>
                </div>
                <div className="bottomMeniu">
                    { auth.role === 2 ? (
                        <button className="buttonControl">
                            Avarinis
                        </button>
                    ): (
                        <></>
                    )}
                    <button className="buttonControl" onClick={handleTap}>
                        Apmokėti
                    </button>
                    <button className="buttonControl">
                        Nuolaidų kortelė
                    </button>
                    <button className="buttonControl">
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