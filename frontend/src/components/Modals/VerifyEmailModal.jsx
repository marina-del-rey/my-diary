import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import './VerifyEmailModal.scss';

Modal.setAppElement('#root');

const VerifyEmailModal = ({ token }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await axios.get(`${apiUrl}/auth/verify-email/${token}`);
                if (response.data.success) {
                    setMessage('Email verified successfully! Redirecting to login...');
                    setTimeout(() => navigate('/login'), 3500);
                } else {
                    setMessage(response.data.message);
                }
            } catch (error) {
                setMessage('Verification link is invalid or has expired.');
                setTimeout(() => navigate('/login'), 3500);
            } finally {
                setLoading(false);
            }
        };

        verifyEmail();
    }, [token, apiUrl, navigate]);

    const handleClose = () => {
        setIsOpen(false);
        navigate('/login');  
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => setIsOpen(false)}
            contentLabel="Email Verification"
            overlayClassName="custom-modal-overlay"
            className="verify-email-modal-content"
        >
            <div className="verify-email-content">
                <h3>Email verification</h3>
                {loading ? <p>Verifying your email, please wait...</p> : <p>{message}</p>}
                <div className="button-group">
                    <button className="close-button" onClick={handleClose}>close</button>
                </div>
            </div>
        </Modal>
    );
};

export default VerifyEmailModal;
