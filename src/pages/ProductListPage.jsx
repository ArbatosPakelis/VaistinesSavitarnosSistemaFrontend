import { useEffect, useState, useRef } from "react";
import usePrivateApi from "../hooks/usePrivateApi.js";
import useAuth from "../hooks/useAuth.js";
import Header from "../components/header.jsx";
import ProductRow from "../components/ProductRow.jsx";

export default function ProductListPage(req){
    const { auth, setAuth} = useAuth();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const PrivateApi = usePrivateApi();
    const [data, setData] = useState("");
    const errorRef = useRef();
    const [filter, setFilter] = useState();
    const [filteredData, setFilteredData] = useState("");
    const [prescription, setPrescription] = useState(false);
    const [other, setOther] = useState(false);
    const [selfCode, setSelfCode] = useState("");
    const [otherCode, setOtherCode] = useState("");

    async function applyFilter() {
        const inputElement = document.getElementById('filterInput');
        const currentFilter = inputElement.value.toLowerCase();
        setFilter(currentFilter);
    
        if (currentFilter && currentFilter !== "") {
            if (data) {
                // Filter product_cards
                const filteredProductCardsArray = data.product_cards.filter(item => item.name.toLowerCase().includes(currentFilter));
                
                // Create a list of filtered product_cards IDs
                const filteredProductCardsIds = filteredProductCardsArray.map(item => item.id);
                
                // Filter remaining_goods based on filtered product_cards IDs
                const filteredRemainingGoodsArray = data.remaining_goods.filter(item => filteredProductCardsIds.includes(item.product_cards_fk));
    
                // Update filtered data state
                setFilteredData({
                    product_cards: filteredProductCardsArray,
                    remaining_goods: filteredRemainingGoodsArray
                });
            }
        } else {
            setFilteredData(undefined);
        }
    }


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

        }
    }

    async function calibration() {
        try {
            // http request
            const response = await PrivateApi.post(`/api/v1/orders/calibrate/${auth.pharmacy}`,
                {
                    headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.accessToken}`,
                    },
                }
                );
                setSuccessMessage('Kalibracija įvykdyta sėkmingai');
                setErrorMessage("");
        } catch (err) {
            setSuccessMessage('');
            if (!err?.response) {
                setErrorMessage('No Server Response');
            } else {
                setErrorMessage('Nepavyko atlikti kalibracijos')
            }
        }
        fetchingProducts();
    }

    async function addPrescriptions() {
        try {
            // http request
            const response = await PrivateApi.post(`/api/v1/orders/addPrescriptions/${auth.basketId}`,
                JSON.stringify({ 
                    SelfCode:auth.SelfCode,
                    OtherCode:auth.OtherCode
                }),
                {
                    headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.accessToken}`,
                    },
                }
                );
                if (response?.status === 200){
                    setSuccessMessage("Receptai buvo pridėti");
                    setErrorMessage("");
                }
        } catch (err) {
            setSuccessMessage('');
            if (!err?.response) {
                setErrorMessage('No Server Response');
            } else if (err.response?.status === 404) {
                setErrorMessage('Užsakymas nebuvo rastas');
            }  else {
                setErrorMessage('Nepavyko pridėti receptų')
            }
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
                    <input id="filterInput" style={{minWidth:600, minHeight:60, marginLeft:10, fontSize:22}}></input>
                    <button className="chosenButtons" style={{marginTop:0, marginBottom:0, marginLeft:20, width:120, display:"inline"}} onClick={applyFilter}>Ieškoti</button>
                </div>
                <div style={{marginLeft:60}}>
                    { auth.role === 2 ? (
                        <button style={{width:130, display:"inline"}} className="chosenButtons" onClick={calibration}>
                            sulyginti
                        </button>
                    ): (
                        <></>
                    )}
                    <button style={{width:200, display:"inline"}} className="chosenButtons" onClick={() => setPrescription(!prescription)}>
                        pridėti receptą
                    </button>
                    <button className="chosenButtons" onClick={() => setOther(!other)}>
                        pirkti receptinius vaistus kitam žmogui
                    </button>
                </div>
            </div>
            <p className={successMessage ? "successMessage" : "offscreen"} aria-live="assertive">{successMessage}</p>
            <p className={errorMessage ? "errorMessage" : "offscreen"} aria-live="assertive">{errorMessage}</p>
            { prescription == true ? (
                <div style={{width:300, marginLeft:70, marginBottom:20}}>
                    <form className="otherForm" onSubmit={(e) => {
                        e.preventDefault();
                        const storedSessionData = localStorage.getItem('auth');
                        let jsonData = JSON.parse(storedSessionData);

                        if (jsonData) {
                            jsonData.SelfCode = selfCode;
                            localStorage.removeItem('auth'); 
                            window.localStorage.setItem("auth", JSON.stringify(jsonData));
                            setAuth(jsonData);
                        }
                        else {
                            setAuth(prev => ({
                                ...prev,
                                SelfCode: selfCode
                            }));
                            window.localStorage.setItem("auth", JSON.stringify(auth));
                        }
                        addPrescriptions();

                    }}>
                        <label htmlFor="selfCode" style={{color:"white"}}>
                            Įveskyte savo asmens kodą:
                        </label>
                        <input
                            type="text"
                            id="selfCode"
                            autoComplete="off"
                            onChange={(e) => setSelfCode(e.target.value)}
                            value={selfCode}
                            required
                        />

                        <button className="blueButton" type="submit">submit</button>
                    </form>
                </div>
            ) : (
                <></>
            )}
            { other == true ? (
                <div style={{width:300, marginLeft:70, width:500}}>
                    <form className="otherForm" onSubmit={(e) => {
                        e.preventDefault();
                        const storedSessionData = localStorage.getItem('auth');
                        let jsonData = JSON.parse(storedSessionData);

                        if (jsonData) {
                            jsonData.SelfCode = selfCode;
                            jsonData.OtherCode = otherCode;
                            localStorage.removeItem('auth'); 
                            window.localStorage.setItem("auth", JSON.stringify(jsonData));
                            setAuth(jsonData);
                        }
                        else {
                            setAuth(prev => ({
                                ...prev,
                                SelfCode: selfCode,
                                OtherCode: otherCode
                            }));
                            window.localStorage.setItem("auth", JSON.stringify(auth));
                        }
                        addPrescriptions();
                    }}>
                        <label htmlFor="selfCode" style={{color:"white"}}>
                            Įveskyte savo asmens kodą:
                        </label>
                        <input
                            type="text"
                            id="selfCode"
                            autoComplete="off"
                            onChange={(e) => setSelfCode(e.target.value)}
                            value={selfCode}
                            required
                        />
                        
                        <label htmlFor="otherCode" style={{color:"white"}}>
                            Įveskyte žmogaus, kuriam perkate vaistus, kodą asmens kodą:
                        </label>
                        <input
                            type="text"
                            id="otherCode"
                            autoComplete="off"
                            onChange={(e) => setOtherCode(e.target.value)}
                            value={otherCode}
                            required
                        />

                        <button className="blueButton" type="submit">submit</button>
                    </form>
                </div>
            ) : (
                <></>
            )}
            <div className="whole" style={{ position: "relative" }}>
                <div style={{ flexDirection: 'row', minHeight: 400 }}>
                    <div className="itemList">
                        {filter && filter !== "" ? (
                            filteredData && filteredData.remaining_goods && filteredData.remaining_goods.length > 0 ? (
                                filteredData.remaining_goods.map((product, index) => (
                                    <div key={index} style={{ display: "flex" }}>
                                        <ProductRow name={"example" + index} card={filteredData.product_cards[index]} product={product} mode={2} reloading={fetchingProducts} state="need"/>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: "white" }}>nebuvo rasta jokių prekių</p>
                            )
                        ) : (
                            data && data.remaining_goods && data.remaining_goods.length > 0 ? (
                                data.remaining_goods.map((product, index) => (
                                    <div key={index} style={{ display: "flex" }}>
                                        <ProductRow name={"example" + index} card={data.product_cards[index]} product={product} mode={2} reloading={fetchingProducts} state="need" setS={setSuccessMessage} setE={setErrorMessage}/>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: "white" }}>nebuvo rasta jokių prekių</p>
                            )
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}