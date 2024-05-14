import { useEffect, useState, useRef } from "react";
import usePrivateApi from "../hooks/usePrivateApi.js";
import useAuth from "../hooks/useAuth.js";
import Header from "../components/header.jsx";
import OrderRow from "../components/orderRow.jsx";

export default function OrderListPage(req){
    const { auth} = useAuth();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const PrivateApi = usePrivateApi();
    const [data, setData] = useState("");
    const errorRef = useRef();

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = (data ? data.orders.slice(indexOfFirstItem, indexOfLastItem) : []);

    const paginate = pageNumber => setCurrentPage(pageNumber);

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
                setErrorMessage('Failled loading your orders')
            }
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
            <p className={successMessage ? "successMessage" : "offscreen"} aria-live="assertive">{successMessage}</p>
            <p className={errorMessage ? "errorMessage" : "offscreen"} aria-live="assertive">{errorMessage}</p>
            <div className="whole" style={{ position: "relative" }}>
                <div style={{ flexDirection: 'row', minHeight: 400 }}>
                    <div className="itemList">
                        {data && data.orders && data.orders.length > 0 ? (
                            currentOrders.map((order, index) => (
                                <div key={index} style={{ display: "flex" }}>
                                    <OrderRow order={order} user={findUser(data.checkouts, order.users_fk)}/>
                                </div>
                            ))
                        ) : (
                            <p style={{color:"white"}}>nebuvo rasta užsakymų</p>
                        )}
                    </div>
                </div>
                <div className="pagination">
                    <button className="pagingButton" style={{width:120}} onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                    </button>
                    <div className="pages">
                        {Array.from({ length: Math.ceil(((data ? data.orders.length : 0)) / itemsPerPage) }, (_, index) => (
                            <button key={index + 1} onClick={() => paginate(index + 1)} style={{ margin: "0 5px" }} className={currentPage === index + 1 ? "activePage" : "pagingButton"}>
                            {index + 1}
                            </button>
                        ))}
                    </div>
                    <button className="pagingButton" style={{width:120}} onClick={() => paginate(currentPage + 1)} disabled={indexOfLastItem >= ((data ? data.orders.length : 0))}>
                    Next
                    </button>
                </div>
            </div>
        </>
    );
}