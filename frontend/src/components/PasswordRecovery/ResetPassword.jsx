import { useState, useEffect } from 'react';
import { useAuth } from "../Context/AuthProvider";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"; 
import './ResetPassword.scss';

const ResetPassword = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const { token } = useParams();
    const { user } = useAuth(); 
    const minPasswordLength = 8;
    const maxPasswordLength = 20;

    const [loading, setLoading] = useState(false);
    const [isCheckingUser, setIsCheckingUser] = useState(true); 

    const [formInputValue, setFormInputValue] = useState({
        password: "",
        confirmPassword: ""
    });
    const [errorMessages, setErrorMessages] = useState({
        password: "",
        confirmPassword: ""
    });

    useEffect(() => {
        if (user) {
            navigate("/");
        } else {
            setIsCheckingUser(false); 
        }
    }, [user, navigate]);

    const { password, confirmPassword } = formInputValue;

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormInputValue({
            ...formInputValue,
            [name]: value
        });
        setErrorMessages({
            ...errorMessages,
            [name]: ""
        });

        // validate password length
        if (name === "password") {
            if (value.length < minPasswordLength || value.length > maxPasswordLength) {
                setErrorMessages({
                    ...errorMessages,
                    password: `Password must be ${minPasswordLength} - ${maxPasswordLength} characters.`,
                });
            } else {
                setErrorMessages({
                    ...errorMessages,
                    password: "", 
                });
            }
        }
    };

    const validateForm = () => {
        let isValid = true;
        const errors = {};

        if (!password) {
            errors.password = "Password is required";
            isValid = false;
        }
        if (password !== confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
            isValid = false;
        }
        setErrorMessages(errors);
        return isValid;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setLoading(true);
            const res = await axios.post(
                `${apiUrl}/auth/reset-password/${token}`,
                { password },
                { withCredentials: true }
            );

            if (res.data.success) {
                toast.success("password reset successfully.", { position: "bottom-right" });
                navigate("/login");
            } else if (res.data.message === 'token is invalid or has expired.' ){
                toast.error("token is invalid or has expired.", { position: "bottom-right" });
            }
        } catch (error) {
            toast.error("failed to reset password.", { position: "bottom-right" });
        } finally {
            setLoading(false);
        }
    };

    const isButtonDisabled = !password || !confirmPassword || loading;

    if (isCheckingUser) {
        return <LoadingIndicator />;
    }

    return (
        <div className="reset-password-page-container">
            <div className="reset-password-form">
                <h2>Reset password</h2>
                <form onSubmit={handleFormSubmit}>
                    <div className="form-group">
                        <div className="input-wrapper"> 
                            <FontAwesomeIcon icon={faLock} className="form-icon" />
                            <input
                                type="password"
                                name="password"
                                value={password}
                                placeholder="New password"
                                onChange={handleFormChange}
                                className={errorMessages.password ? "error" : ""}
                            />
                        </div>
                        {errorMessages.password && (
                            <p className="error-message"><FontAwesomeIcon icon={faCircleExclamation} className="fa-icon"/>{errorMessages.password}</p>
                        )}
                    </div>
                    <div className="form-group">
                        <div className="input-wrapper"> 
                            <FontAwesomeIcon icon={faLock} className="form-icon" />
                            <input
                                type="password"
                                name="confirmPassword"
                                value={confirmPassword}
                                placeholder="Confirm new password"
                                onChange={handleFormChange}
                                className={errorMessages.confirmPassword ? "error" : ""}
                            />
                        </div>
                        {errorMessages.confirmPassword && (
                            <p className="error-message"><FontAwesomeIcon icon={faCircleExclamation} className="fa-icon"/>{errorMessages.confirmPassword}</p>
                        )}
                    </div>
                    <button className="continue-button" type="submit" disabled={isButtonDisabled}>
                        {loading ? "Resetting Password" : "Reset Password"}
                    </button>
                </form>
                <ToastContainer />
            </div>
        </div>
    );

};

export default ResetPassword;