import { useRef, useState, useEffect} from "react";
import defaultApi from "../apis/defaultApi.js";
import useAuth from "../hooks/useAuth.js";
import { Link, useNavigate, useLocation} from 'react-router-dom';

export default function LoginPage(){
    const usernameRef = useRef();
    const errorRef = useRef();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const {auth, setAuth} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from1 = location.state?.from?.pathname || "/basket";
    const from2 = location.state?.from?.pathname || "/accounts";

    // when page loads it'll select username field as if you clicked it
    useEffect(() => {
        usernameRef.current.focus();
    }, [])

    // if information changes, remove errors
    useEffect(() => {
        setErrorMessage('');
    }, [username, password])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // http request
            const response = await defaultApi.post("/api/v1/users/login",
                JSON.stringify({ username: username,
                                 password: password
                                }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            // extract tokens
            const accessToken = response?.data?.accessToken;
            const refreshToken = response?.data?.refreshToken;
            const role = response?.data?.role;
            const id = response?.data?.id;
            const pharmacy = response?.data?.pharmacy;
            const basketId = response?.data?.basketId;
            console.log(response?.data);
            // set global variables
            setAuth({ id, username, role, pharmacy, accessToken, refreshToken, basketId});
            // remove input data
            setUsername('');
            setPassword('');
            if(role == 3)
            {
                navigate(from2, {replace: true})
            }
            else if(role == 1 || role == 2)
            {
                navigate(from1, {replace: true})
            }
        } catch (err) {
            if (!err?.response) {
                console.log(err);
                setErrorMessage('No Server Response');
            } else if (err.response?.status === 404) {
                setErrorMessage('User doesn\'t exist');
            } else if (err.response?.status === 401) {
                setErrorMessage('Wrong password or unauthorized');
            } else {
                console.log(err);
                //setErrorMessage('Login Failed')
            }
            errorRef.current.focus();
        }
    }

    return (
        <section>
            <p ref={errorRef} className={errorMessage ? "errorMessage" : "offscreen"} aria-live="assertive">{errorMessage}</p>
            <h1>Prisijungimas</h1>
            <form onSubmit={handleSubmit}>
                    <label htmlFor="username">
                        Naudotojo vardas:
                    </label>
                    <input
                        type="text"
                        id="username"
                        ref={usernameRef}
                        autoComplete="off"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        required
                    />

                    <label htmlFor="password">
                        Slaptažodis:
                    </label>
                    <input
                        type="password"
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        required
                    />
                    <button>Prisijungti</button>
                </form>
                <p> 
                    Nesate užsiregistravęs? <br/>
                    <span className="line">
                        <a href="/register">Registruotis</a>
                    </span>
                </p>
        </section>
    );
}