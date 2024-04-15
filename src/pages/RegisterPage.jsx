import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import defaultApi from "../apis/defaultApi";
import { useNavigate, useLocation } from "react-router-dom";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const EMAIL_REGEX = /^[a-zA-Z]{1,23}@[a-zA-Z0-9.-]{3,23}\.[a-zA-Z]{2,4}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export default function RegisterPage(){
    const usernameRef = useRef();
    const errorRef = useRef();
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || "/login";

    const [username, setUsername] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [EmailFocus, setEmailFocus] = useState(false);

    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    const [confirmPassword, setConfirmPassword] = useState('');
    const [validConfirmPassword, setValidConfirmPassword] = useState(false);
    const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState(false);

        // when page loads it'll select username field as if you clicked it
        useEffect(() => {
            usernameRef.current.focus();
        }, [])
    
        // when value of user changes it'll execute regex check the user
        // it is needed to so it shows problems about username live on the page
        useEffect(() => {
            setValidName(USER_REGEX.test(username));
        }, [username])
    
        // when value of email changes it'll execute regex check the email
        // it is needed to so it shows problems about email live on the page
        useEffect(() => {
            setValidEmail(EMAIL_REGEX.test(email));
        }, [email])
    
        // when value of password changes it'll execute regex check the password
        // it is needed to so it shows problems about password live on the page
        useEffect(() => {
            setValidPassword(PWD_REGEX.test(password));
        }, [password])

        // when value of password or confirm password changes it'll check if both match
        // it is needed to so it shows problems about password or confirm password live on the page
        useEffect(() => {
            setValidConfirmPassword(password === confirmPassword);
        }, [confirmPassword, password])
    
        // if information changes, remove errors
        useEffect(() => {
            setErrorMessage('');
        }, [username, password, email, confirmPassword])
    
        useEffect(() => {
            if(success === true)
            {
                navigate(from, {replace: true})
            }
        }, [success])

        const handleSubmit = async (e) => {
            e.preventDefault();
            // if button bugs out or is messed with
            // security check
            const v1 = USER_REGEX.test(username);
            const v2 = PWD_REGEX.test(password);
            const v3 = EMAIL_REGEX.test(email);
            const v4 = password === confirmPassword;
            if (!v1 || !v2 || !v3) {
                setErrorMessage("Username, Email or Password are invalid");
                return;
            }
            if (!v4) {
                setErrorMessage("Confirm password doesn't match password");
                return;
            }
    
            try {
                // http request
                const response = await defaultApi.post("/api/v1/users/register",
                    JSON.stringify({ username: username,
                                     password: password,
                                     email: email,
                                     status:"working",
                                     ForceRelogin:false,
                                     user_types_fk: 2 }),
                    {
                        headers: { 'Content-Type': 'application/json' },
                        withCredentials: true
                    }
                );

                // remove input data
                if(response.status === 200)
                {
                    setSuccess(true);
                    setUsername('');
                    setPassword('');
                    setConfirmPassword('');
                    setEmail('');
                }
            } catch (err) {
                if (!err?.response) {
                    setErrorMessage('No Server Response');
                } else if (err.response?.status === 403) {
                    setErrorMessage('Username Taken');
                } else {
                    setErrorMessage('Registration Failed')
                }
                errorRef.current.focus();
            }
        }
    
        return (
            <>
                {success ? (
                <section>
                    <h1>Success</h1>
                    <p>
                        <a href="/login">Login</a>
                    </p>
                </section>
                ) : (
                <section>
                    <p ref={errorRef} className={errorMessage ? "errorMessage" : "offscreen"} aria-live="assertive">{errorMessage}</p>
                    <h1>Register</h1>
                    <hr></hr>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username">
                            Username:
                            <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validName || !username ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="text"
                            id="username"
                            ref={usernameRef}
                            autoComplete="off"
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            required
                            aria-invalid={validName ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                        />
                        <p id="uidnote" className={userFocus && username && !validName ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 to 24 characters.<br />
                            Must begin with a letter.<br />
                            Letters, numbers, underscores, hyphens allowed.
                        </p>
    
                        <label htmlFor="email">
                            Email:
                            <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="text"
                            id="email"
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                            aria-invalid={validEmail ? "false" : "true"}
                            aria-describedby="emlnote"
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                        />
                        <p id="emlnote" className={EmailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 52 characters.<br />
                            Must begin with a letter.<br />
                            Must contain @ simbol.<br />
                            Must contain . simbol.
                        </p>
    
                        <label htmlFor="password">
                            Password:
                            <FontAwesomeIcon icon={faCheck} className={validPassword ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validPassword || !password ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                            aria-invalid={validPassword ? "false" : "true"}
                            aria-describedby="passwordnote"
                            onFocus={() => setPasswordFocus(true)}
                            onBlur={() => setPasswordFocus(false)}
                        />
                        <p id="passwordnote" className={passwordFocus && password && !validPassword ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: 
                            <span aria-label="exclamation mark">!</span>
                            <span aria-label="at symbol">@</span>
                            <span aria-label="hashtag">#</span>
                            <span aria-label="dollar sign">$</span>
                            <span aria-label="percent">%</span>
                        </p>

                        <label htmlFor="confirmPassword">
                            Confirm password:
                            <FontAwesomeIcon icon={faCheck} className={validConfirmPassword && confirmPassword ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validConfirmPassword || !confirmPassword ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            value={confirmPassword}
                            required
                            aria-invalid={validConfirmPassword ? "false" : "true"}
                            aria-describedby="confirmPasswordnote"
                            onFocus={() => setConfirmPasswordFocus(true)}
                            onBlur={() => setConfirmPasswordFocus(false)}
                        />
                        <p id="confirmPasswordnote" className={confirmPasswordFocus && confirmPassword && !validConfirmPassword ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must be the same as password
                        </p>
    
                        <button disabled={!validName || !validPassword || !validEmail? true : false}>Register</button>
                    </form>
                    <p>
                        Already registered?<br />
                        <span className="line">
                            <a href="/Login">Login</a>
                        </span>
                    </p>
                </section>
                )}
            </>
        );
}