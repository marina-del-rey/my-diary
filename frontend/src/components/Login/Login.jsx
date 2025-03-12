import { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthProvider";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import './Login.scss';

const Login = () => {
    const { login, user } = useAuth(); 
    const navigate = useNavigate();
    const [formInputValue, setFormInputValue] = useState({
        email: "",
        password: "",
    });
    const { email, password } = formInputValue;

    const [errorMessages, setErrorMessages] = useState({
        email: "",
        password: "",
    });

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormInputValue({
            ...formInputValue,
            [name] : value,
        });
        setErrorMessages({
            ...errorMessages,
            [name]: "",
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // reset error messages
        setErrorMessages({
            email: "",
            password: "",
        });
        
        const res = await login(email, password);
        if (res.message === "wrong email") {
            setErrorMessages({ email: "Wrong email address" });
        } else if (res.message === "wrong password") {
            setErrorMessages({ password: "Wrong password" });
        } else if (res.message === "email isn't verified") {
            toast.error("please verify your email address before logging in.", { position: "bottom-right" });
        } 
        else if (res.success) {
            toast.success("user logged in successfully", { position: "bottom-right" });
            navigate("/");
        } else {
            toast.error("an error occurred, please try again.", { position: "bottom-right" });
        }
        //console.log("form input value:", formInputValue); // DEBUG
    };

    const isButtonDisabled = !email || !password;

    return (
        <div className="login-page-container">
            <div className="login-form">
                <h2>Log in</h2>
                <form onSubmit={handleFormSubmit}>
                    <div className="form-group">
                        <div className="input-wrapper"> 
                            <FontAwesomeIcon icon={faEnvelope} className="form-icon" />
                            <input
                                type="email"
                                name="email"
                                value={email}
                                placeholder="Email"
                                onChange={handleFormChange}
                                autoComplete="email" 
                                className={errorMessages.email ? 'error' : ''}
                            />
                        </div>
                        {errorMessages.email && (
                            <p className="error-message"><FontAwesomeIcon icon={faCircleExclamation} className="fa-icon"/>{errorMessages.email}</p>
                        )}
                    </div>
                    <div className="form-group">
                        <div className="input-wrapper"> 
                            <FontAwesomeIcon icon={faLock} className="form-icon" /> 
                            <input
                                type="password"
                                name="password"
                                value={password}
                                placeholder="Password"
                                onChange={handleFormChange}
                                autoComplete="current-password" 
                                className={errorMessages.password ? 'error' : ''}
                            />
                        </div>
                        {errorMessages.password && (
                            <p className="error-message"><FontAwesomeIcon icon={faCircleExclamation} className="fa-icon"/>{errorMessages.password}</p>
                        )}
                    </div>
                    <button className="login-button" type="submit" disabled={isButtonDisabled}>Log in</button>
                    <div className="links-container">
                        <span className="signup-link">
                            No account? <Link to={"/signup"}>Create an account</Link>
                        </span>
                        <span className="forgot-password-link">
                            <Link to={"/forgot-password"}>Forgot your password?</Link>
                        </span>   
                    </div>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
}

export default Login;
