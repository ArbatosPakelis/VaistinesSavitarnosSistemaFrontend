import { useEffect, useState, useRef } from "react";
import defaultApi from "../apis/defaultApi.js";
import usePrivateApi from "../hooks/usePrivateApi.js";
import useAuth from "../hooks/useAuth.js";
import Header from "../components/header.jsx";
import ProductRow from "../components/ProductRow.jsx";

export default function BasketPage(req){
    const { auth} = useAuth();
    const [errorMessage, setErrorMessage] = useState('');
    const PrivateApi = usePrivateApi();
    const [itemListHeight, setItemListHeight] = useState(0);
    const wholeRef = useRef(null);
    const itemListRef = useRef(null);
    const errorRef = useRef();
    const [data, setData] = useState("");

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
    }, []);


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
                                <ProductRow name={"example"+index} card={data.product_cards[index]} product={product} mode={1}/>
                            </div>
                        ))
                    ) : (
                        <p>nebuvo rasta jokių prekių</p>
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
                    <button className="buttonControl">
                        Apmokėti
                    </button>
                    <button className="buttonControl">
                        Nuolaidų kortelė
                    </button>
                    <button className="buttonControl">
                        Atšaukti
                    </button>
                </div>
            </div>
        </div>
    );
}