import { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthProvider";
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator'; 
import './ForgotPassword.scss';

const ForgotPassword = () => {
    const apiUrl = import.meta.env.VITE_API_URL; 
    const { user } = useAuth(); 
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [isCheckingUser, setIsCheckingUser] = useState(true); 

    const [formInputValue, setFormInputValue] = useState({
        email: ""
    });
    const { email } = formInputValue;

    const [errorMessages, setErrorMessages] = useState({
        email: ""
    });

    useEffect(() => {
        if (user) {
            navigate("/");
        } else {
            setIsCheckingUser(false); 
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
        setErrorMessages({ email: "" });

        try {
            setLoading(true);
            const res = await axios.post(`${apiUrl}/auth/forgot-password`, 
                { email }, 
                { withCredentials: true }
            );

            if (res.data.success) {
                toast.success("password recovery email sent successfully", { position: "bottom-right" });
            } else if (res.data.message === 'user with that email not found') {
                setErrorMessages({ email: "User with that email not found" });
            } else {
                toast.error("error sending email", { position: "bottom-right" });
            }

        } catch (error) {
            toast.error("an error occurred, please try again.", { position: "bottom-right" });
        } finally {
            setLoading(false);
        }


    };

    const isButtonDisabled = !email || loading;

    if (isCheckingUser) {
        return <LoadingIndicator />;
    }

    return (
        <div className="forgot-password-page-container">
            <div className="forgot-password-form">
                <h2>Forgot password?</h2>
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
                    <button className="continue-button" type="submit" disabled={isButtonDisabled}>
                        {loading ? "Sending" : "Continue"}
                    </button>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
}

export default ForgotPassword;