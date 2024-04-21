import { useEffect, useState, useRef } from "react";
import usePrivateApi from "../hooks/usePrivateApi.js";
import useAuth from "../hooks/useAuth.js";
import Header from "../components/header.jsx";
import { useParams } from "react-router-dom";
import ProductRow from "../components/ProductRow.jsx";

export default function OrderPage(req){
    const {id} = useParams();
    const { auth} = useAuth();
    const [errorMessage, setErrorMessage] = useState('');
    const PrivateApi = usePrivateApi();
    const [data, setData] = useState("");
    const errorRef = useRef();
    const [dateTime1, setDateTime1] = useState();
    const [dateTime2, setDateTime2] = useState();

    async function fetchingOrder() {
        try {
            // http request
            const response = await PrivateApi.get(`/api/v1/orders/getOrder/${id}`,
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

    function findUser(users, fk){
        let result;
        for(let k in users){
            if(users[k].id == fk)
            {
                result = users[k];
            }
        }
        if(result != undefined)
        {
            return result.username;
        }
        return undefined;
    }
    
    useEffect(() => {
        if(auth.pharmacy > 0)
        {
            fetchingOrder();
        }
    }, []);

    useEffect(() => {
        setDateTime1(new Date(data.order?.createdAt))
        setDateTime2(new Date(data.order?.updatedAt))
    }, [data]);

    return (
        <>
            <Header/>
            <div className="whole" style={{ position: "relative" }}>
                <h1 style={{color:"white"}}>
                    {data ? `užsakymas ${data.order.id}` : "ieškoma..." }
                </h1>
                <div className="infoPlate">
                    <div className="label">Kasa:</div>
                    <div className="data">{data ? findUser(data.checkouts, data.order.users_fk) : "ieškoma..."}</div>
                    
                    <div className="label">Kaina:</div>
                    <div className="data">{data ? data.order.price : "ieškoma..."}€</div>
                    
                    <div className="label">Būsena:</div>
                    <div className="data">{data ? data.order.state : "ieškoma..."}</div>
                    
                    <div className="label">Sukūrimo data:</div>
                    <div className="data">{ dateTime1 ? `${dateTime1.getFullYear()}-${dateTime1.getMonth() + 1}-${dateTime1.getDate()} ${dateTime1.toLocaleTimeString()}` : "ieškoma..."}</div>
                    
                    <div className="label">Paskutinio keitimo data:</div>
                    <div className="data">{dateTime2 ? `${dateTime2.getFullYear()}-${dateTime2.getMonth() + 1}-${dateTime2.getDate()} ${dateTime2.toLocaleTimeString()}` : "ieškoma..."}</div>
                </div>
                <div style={{ flexDirection: 'row', minHeight: 400 }}>
                    <div className="itemList">
                        {data && data.order_products && data.order_products.length > 0 ? (
                            data.order_products.map((product, index) => (
                                <div key={index} style={{ display: "flex" }}>
                                    <ProductRow name={"example"+index} card={data.product_cards[index]} product={product} mode={1} reloading={fetchingOrder}/>
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