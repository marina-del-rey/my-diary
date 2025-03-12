import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Context/AuthProvider";
import { toast, ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import TermsAndConditions from '../Modals/TermsAndConditions';
import './Signup.scss';

const Signup = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL; 
    const minPasswordLength = 8;
    const maxPasswordLength = 20;

    const [formInputValue, setFormInputValue] = useState({
        email: "",
        username: "",
        password: "",
    });

    const { email, username, password } = formInputValue;

    const [errorMessages, setErrorMessages] = useState({
        email: "",
        username: "",
        password: "",
    });

    const [isTermsConditionsModalOpen, setTermsConditionsModalOpen] = useState(false);  
    const [hasAgreed, setHasAgreed] = useState(false);  

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormInputValue({
            ...formInputValue,
            [name]: value,
        });
        setErrorMessages({
            ...errorMessages,
            [name]: "",
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

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!hasAgreed) {
            toast.error("You must agree to the terms and conditions before signing up.");
            return;
        }

        // reset error messages
        setErrorMessages({
            email: "",
            username: "",
            password: "",
        });

        try {
            const { data } = await axios.post(
                `${apiUrl}/auth/signup`,
                {
                    ...formInputValue,
                },
                { withCredentials: true }
            );
            const { success, message } = data;
            if (success) {
                toast.success(message, { position: "bottom-right" });
                // setTimeout(() => navigate("/"), 1000);
            } else {
                setErrorMessages({
                    email: message.includes("email") ? message : "",
                    username: message.includes("username") ? message : "",
                    password: "",
                });    
            }
        } catch (error) {
            toast.error("an error occurred. please try again.", {
                position: "bottom-left",
            });
        }
        // console.log("Form input value:", formInputValue); // DEBUG
    };

    const toggleRulesConditionsModal = () => setTermsConditionsModalOpen(!isTermsConditionsModalOpen);

    const isButtonDisabled = !email || !username || !password || !hasAgreed;

    return (
        <div className="signup-page-container">
            <div className="signup-form">
                <h2>Sign up</h2>
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
                            <p className="error-message">
                                <FontAwesomeIcon icon={faCircleExclamation} className="fa-icon"/>{errorMessages.email}
                            </p>
                        )}
                    </div>
                    <div className="form-group">
                        <div className="input-wrapper">
                            <FontAwesomeIcon icon={faUser} className="form-icon" />
                            <input
                                type="text"
                                name="username"
                                value={username}
                                placeholder="Username"
                                onChange={handleFormChange}
                                autoComplete="username"
                                className={errorMessages.username ? 'error' : ''}
                            />
                        </div>
                        {errorMessages.username && (
                            <p className="error-message">
                                <FontAwesomeIcon icon={faCircleExclamation} className="fa-icon"/>{errorMessages.username}
                            </p>
                        )}
                    </div>
                    <div className="form-group password-group">
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
                            <p className="error-message">
                                <FontAwesomeIcon icon={faCircleExclamation} className="fa-icon"/>{errorMessages.password}
                            </p>
                        )}
                    </div>

                    <div className="checkbox-container">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={hasAgreed}
                            onChange={(e) => setHasAgreed(e.target.checked)}
                        />
                        <label htmlFor="terms">
                            I agree to the <button type="button" className="terms-link" onClick={toggleRulesConditionsModal}>terms and conditions</button>
                        </label>
                    </div>

                    <button className="signup-button" type="submit" disabled={isButtonDisabled}>Sign up</button>
                    <span className="signup-link">
                        Already have an account? <Link to={"/login"}>Log in</Link>
                    </span>
                </form>
                <ToastContainer />
            </div>

            <TermsAndConditions isOpen={isTermsConditionsModalOpen} onClose={toggleRulesConditionsModal} />
        </div>
    );
};

export default Signup;
