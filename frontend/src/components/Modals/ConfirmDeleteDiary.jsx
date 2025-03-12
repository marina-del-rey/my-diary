import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import './ConfirmDeleteDiary.scss';

Modal.setAppElement('#root');

const ConfirmDeleteDiary = ({ isOpen, onRequestClose, onConfirm, diaryName }) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                handleConfirm();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onConfirm]);

    const handleConfirm = async () => {
        if (loading) return; 

        setLoading(true);
        try {
            await onConfirm(); 
        } catch (error) {
            console.error('error during confirmation:', error);
        } finally {
            setLoading(false);
        }
    };

    const isButtonDisabled = loading;

    return (
        <div>
            <Modal
                isOpen={isOpen}
                onRequestClose={onRequestClose}
                contentLabel="Confirm Delete Diary"
                overlayClassName="custom-modal-overlay" 
                className={`delete-diary-modal-content ${loading ? 'modal-loading' : ''}`}
            >
                <div className="confirm-delete-diary">
                    <span className="warning-icon">
                        <FontAwesomeIcon icon={faTriangleExclamation} />
                    </span>
                    <p>
                        Are you sure you want to delete the diary <strong>{diaryName}</strong>? 
                        <br/>This action can&apos;t be undone.
                    </p>
                    <div className="button-group">
                        <button className="cancel-button" onClick={onRequestClose}>
                            cancel
                        </button>
                        <button className="confirm-button" onClick={handleConfirm} disabled={isButtonDisabled}>
                            {loading ? 'deleting' : 'delete'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ConfirmDeleteDiary;