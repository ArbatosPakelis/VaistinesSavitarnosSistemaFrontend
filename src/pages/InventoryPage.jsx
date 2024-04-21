import { useEffect, useState, useRef } from "react";
import usePrivateApi from "../hooks/usePrivateApi.js";
import useAuth from "../hooks/useAuth.js";
import Header from "../components/header.jsx";
import ProductRow from "../components/ProductRow.jsx";

export default function InventoryPage(req){
    const { auth} = useAuth();
    const [errorMessage, setErrorMessage] = useState('');
    const PrivateApi = usePrivateApi();
    const [data, setData] = useState("");
    const errorRef = useRef();
    // isrikiuoti sarasa pagal trukumo dydi
    async function fetchingProducts() {
        try {
            // http request
            const response = await PrivateApi.get(`/api/v1/orders/getProductList/${auth.pharmacy}`,
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
            errorRef.current.focus();
        }
    }

    useEffect(() => {
        if(auth.pharmacy > 0)
        {
            fetchingProducts();
        }
    }, []);

    return (
        <>
            <Header />
            <div>
                <div style={{marginLeft:60}}>
                    <button className="chosenButtons">
                        užsakyti
                    </button>
                    <button className="chosenButtons">
                        redaguoti inventoriaus parametrus
                    </button>
                </div>
            </div>
            
            <div className="whole" style={{ position: "relative" }}>
                <div style={{ flexDirection: 'row', minHeight: 400 }}>
                    <div className="itemList">
                        {data && data.remaining_goods && data.remaining_goods.length > 0 ? (
                            data.remaining_goods.map((product, index) => (
                                <div key={index} style={{ display: "flex" }}>
                                    <ProductRow name={"example"+index} card={data.product_cards[index]} product={product}  mode={3}/>
                                </div>
                            ))
                        ) : (
                            <p style={{color:"white"}}>nebuvo rasta jokių prekių</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}