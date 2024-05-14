import { useEffect, useState, useRef } from "react";
import usePrivateApi from "../hooks/usePrivateApi.js";
import useAuth from "../hooks/useAuth.js";
import Header from "../components/header.jsx";
import UserRow from "../components/UserRow.jsx";

export default function AccountPage(req){
    const { auth} = useAuth();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const PrivateApi = usePrivateApi();
    const errorRef = useRef();
    const [data, setData] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = (data ? data.users.slice(indexOfFirstItem, indexOfLastItem) : []);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    async function fetchingAccounts() {
        try {
            // http request
            const response = await PrivateApi.get(`/api/v1/users/getAllAccounts`,
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
                setErrorMessage('Paskiros nebuvo rastos');
            }  else {
                setErrorMessage('Nepavyko atlikti paskirų paieškos')
            }
            //errorRef.current.focus();
        }
    }

    useEffect(() => {
        if(auth.id > 0)
        {
            fetchingAccounts();
        }
    }, []);


  return (
        <div style={{width:"100%"}}>
            <Header />
            <p className={successMessage ? "successMessage" : "offscreen"} aria-live="assertive">{successMessage}</p>
            <p className={errorMessage ? "errorMessage" : "offscreen"} aria-live="assertive">{errorMessage}</p>
            <h1 style={{color:"white"}}>Paskirų sąrašąas</h1>
            <div className="whole" style={{ position: "relative" }}>
                <div style={{ flexDirection: 'row', minHeight: 400 }}>
                    <div className="itemListContainer">
                        {data && data.users && data.users.length > 0 ? (
                            currentUsers.map((user, index) => (
                                <div key={index} className="userRowContainer">
                                    <UserRow name={"example"+index} user={user} type={user.user_types_fk} adress={user.adresses_fk}  setS={setSuccessMessage} setE={setErrorMessage} reloading={fetchingAccounts}/>
                                </div>
                            ))
                        ) : (
                            <p style={{color:"white"}}>nebuvo rasta jokių prekių</p>
                        )}
                    </div>
                </div>
                <div className="pagination" style={{marginLeft:0, display:"flex", justifyContent:"center"}}>
                    <button className="pagingButton" style={{width:120}} onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                    </button>
                    <div className="pages">
                        {Array.from({ length: Math.ceil(((data ? data.users.length : 0)) / itemsPerPage) }, (_, index) => (
                            <button key={index + 1} onClick={() => paginate(index + 1)} style={{ margin: "0 5px" }} className={currentPage === index + 1 ? "activePage" : "pagingButton"}>
                            {index + 1}
                            </button>
                        ))}
                    </div>
                    <button className="pagingButton" style={{width:120}} onClick={() => paginate(currentPage + 1)} disabled={indexOfLastItem >= ((data ? data.users.length : 0))}>
                    Next
                    </button>
                </div>
            </div>
        </div>
    );
}