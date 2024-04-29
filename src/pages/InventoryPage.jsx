import { useEffect, useState, useRef } from "react";
import usePrivateApi from "../hooks/usePrivateApi.js";
import useAuth from "../hooks/useAuth.js";
import Header from "../components/header.jsx";
import ProductRow from "../components/ProductRow.jsx";

export default function InventoryPage(req){
    const { auth} = useAuth();
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const PrivateApi = usePrivateApi();
    const [data, setData] = useState("");
    const errorRef = useRef();
    let idAmountPairs = [];

    async function addOrUpdatePair(id, amount) {
        const existingPairIndex = idAmountPairs.findIndex(pair => pair.id === id);
    
        if (existingPairIndex !== -1) {
            idAmountPairs[existingPairIndex].amount = amount;
        } else {
            idAmountPairs.push({ id, amount });
        }
    }

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
                applyFilter(response.data)
        } catch (err) {
            if (!err?.response) {
                setErrorMessage('No Server Response');
            } else if (err.response?.status === 404) {
                setErrorMessage('Order not found');
            }  else {
                setErrorMessage('Failled loading your order')
            }
        }
    }

    async function applyFilter(data) {
        if (data) {

            const sortedRemainingGoods = data.remaining_goods.sort((a, b) => {

                if (a.amount === 0 && b.amount !== 0) return -1;
                if (a.amount !== 0 && b.amount === 0) return 1;

                if (a.shortage_point > a.amount && !(b.shortage_point > b.amount)) return -1;
                if (!(a.shortage_point > a.amount) && b.shortage_point > b.amount) return 1;

                return 0;
            });
    
            const filteredProductCardsIds = sortedRemainingGoods.map(item => item.product_cards_fk);
            
            const sortedProductCardsArray = data.product_cards.sort((a, b) => {
                const idA = a.id;
                const idB = b.id;
                return filteredProductCardsIds.indexOf(idA) - filteredProductCardsIds.indexOf(idB);
            });

            // Update filtered data state
            setData({
                product_cards: sortedProductCardsArray,
                remaining_goods: sortedRemainingGoods
            });
        }
    }

    useEffect(() => {
        if(auth.pharmacy > 0)
        {
            fetchingProducts();
        }
    }, []);

    async function resupply() {
        try {
            // http request
            const response = await PrivateApi.post(`/api/v1/orders/resupply`,
                JSON.stringify({
                    list:idAmountPairs
                }),
                {
                    headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.accessToken}`,
                    },
                }
            );
            setSuccessMessage('Vaistai buvo sėkmingai užsakyti');
            setErrorMessage('');
        } catch (err) {
            setSuccessMessage('');
            if (!err?.response) {
                setErrorMessage('No Server Response');
            }  else {
                setErrorMessage('Nepavyko išsiųsti užsakymo į sandėlį')
            }
        }
    }

    return (
        <>
            <Header />
            <div>
                <div style={{marginLeft:60}}>
                    <button className="chosenButtons" onClick={resupply}>
                        užsakyti
                    </button>
                </div>
            </div>
            <p className={successMessage ? "successMessage" : "offscreen"} aria-live="assertive">{successMessage}</p>
            <p className={errorMessage ? "errorMessage" : "offscreen"} aria-live="assertive">{errorMessage}</p>
            <div className="whole" style={{ position: "relative" }}>
                <div style={{ flexDirection: 'row', minHeight: 400 }}>
                    <div className="itemList">
                        {data && data.remaining_goods && data.remaining_goods.length > 0 ? (
                            data.remaining_goods.map((product, index) => (
                                <div key={index} style={{ display: "flex" }}>
                                    <ProductRow name={"example"+index} card={data.product_cards[index]} product={product}  mode={3}  state="deficit" orderF={addOrUpdatePair} setS={setSuccessMessage} setE={setErrorMessage}/>
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