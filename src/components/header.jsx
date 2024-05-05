import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import usePrivateApi from "../hooks/usePrivateApi.js";

export default function Header() {
  const { auth, setAuth } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const PrivateApi = usePrivateApi();

  const HandlePress = async () => {
    try {
      // http request
      const response = await PrivateApi.post(
        "/api/v1/users/logout",
        JSON.stringify({}),
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.refreshToken}`,
          },
          withCredentials: true,
        }
      );
      if (response?.status === 200) {
        setAuth({});
        navigate("/Login", { replace: true });
      }
    } catch (err) {
      if (!err?.response) {
        setErrorMessage('No Server Response');
      } else if (err.response?.status === 403) {
        setErrorMessage('Invalid user');
      } else if (err.response?.status === 401) {
        setErrorMessage('Forbidden');
      } else {
        setErrorMessage('Logout Failed');
      }
    }
    localStorage.removeItem('auth');
  };


  return (
    <div className="header" style={{minWidth:980}}>
      {auth?.role === 2 ? ( 
      <>
        <button className="headButton">
          {/* using 'link' instead of 'a' to save your auth state going through the pages */}
          <Link to="/orderList">Užsakymai</Link>
        </button>
        <button className="headButton" style={{width:"250px"}}>
          {/* using 'link' instead of 'a' to save your auth state going through the pages */}
          <Link to="/inventory">Trūkstamos prekės</Link>
        </button>
      </>
      ) : (
        <></>
      )}
      {auth?.role === 1 || auth?.role === 2 ? ( 
      <>
        <button className="headButton">
          {/* using 'link' instead of 'a' to save your auth state going through the pages */}
          <Link to="/productList">Vaistai</Link>
        </button>
        <button className="headButton">
          {/* using 'link' instead of 'a' to save your auth state going through the pages */}
          <Link to="/basket">Krepšelis</Link>
        </button>
      </>
      ) : (
        <></>
      )}
            {auth?.role === 3 ? ( 
      <>
        <button className="headButton">
          {/* using 'link' instead of 'a' to save your auth state going through the pages */}
          <Link to="/accounts">Paskiros</Link>
        </button>
      </>
      ) : (
        <></>
      )}
      {auth?.username ? (
        <>
          <button className="head" onClick={HandlePress}>
            Atsijungti
          </button>
        </>
      ) : (
        <button className="head">
          {/* using 'link' instead of 'a' to save your auth state going through the pages */}
          <Link to="/Login">Prisijungti</Link>
        </button>
      )}
    </div>
  );
}