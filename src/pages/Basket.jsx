import { useEffect, useState, useRef } from "react";
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
  
    useEffect(() => {
      if (itemListRef.current && wholeRef.current) {
        const itemListHeightWithExtra = itemListRef.current.clientHeight + 100;
        setItemListHeight(itemListHeightWithExtra);
        wholeRef.current.style.height = `${itemListHeightWithExtra}px`;
      }
    }, []);

  return (
        <>
        <Header />
        <h1 style={{color:"white"}}>Krepšelis</h1>
        <div className="whole" ref={wholeRef} style={{ position: "relative" }}>
            <div style={{ flexDirection: 'row', minHeight: 400 }}>
            <div className="itemList" ref={itemListRef}>
                <div style={{ display: "flex" }}>
                    <ProductRow name="example1" />
                </div>
                <div style={{display: "flex"}}>
                    <ProductRow name="example1"/>
                </div>
                <div style={{display: "flex"}}>
                    <ProductRow name="example2"/>
                </div>
                <div style={{display: "flex"}}>
                    <ProductRow name="example3"/>
                </div>
                <div style={{display: "flex"}}>
                    <ProductRow name="example4"/>
                </div>
                <div style={{display: "flex"}}>
                    <ProductRow name="example5"/>
                </div>
                <div style={{display: "flex"}}>
                    <ProductRow name="example6"/>
                </div>
                {/* Add more ProductRow components here */}
            </div>
            <div className="price">
                Kaina: 0
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
        </>
    );
}