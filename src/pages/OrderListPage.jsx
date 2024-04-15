import { useEffect, useState, useRef } from "react";
import usePrivateApi from "../hooks/usePrivateApi.js";
import useAuth from "../hooks/useAuth.js";
import Header from "../components/header.jsx";
import OrderRow from "../components/orderRow.jsx";

export default function OrderListPage(req){
    const { auth} = useAuth();
    const [errorMessage, setErrorMessage] = useState('');
    const PrivateApi = usePrivateApi();
    const [data, setData] = useState("");
    const errorRef = useRef();

    async function fetchingOrders() {
        try {
            // http request
            const response = await PrivateApi.get(`/api/v1/orders/getAllOrders/${auth.pharmacy}`,
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
            // errorRef.current.focus();
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
        return result;
    }

    useEffect(() => {
        if(auth.pharmacy > 0)
        {
            fetchingOrders();
        }
    }, []);

    return (
        <>
            <Header/>
            <div className="whole" style={{ position: "relative" }}>
                <div style={{ flexDirection: 'row', minHeight: 400 }}>
                    <div className="itemList">
                        {data && data.orders && data.orders.length > 0 ? (
                            data.orders.map((order, index) => (
                                <div key={index} style={{ display: "flex" }}>
                                    <OrderRow order={order} user={findUser(data.checkouts, order.users_fk)}/>
                                </div>
                            ))
                        ) : (
                            <p>nebuvo rasta užsakymų</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}