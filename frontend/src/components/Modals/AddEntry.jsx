import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Modal from 'react-modal';
import './AddEntry.scss';

Modal.setAppElement('#root');

const AddEntry = ({ diaryId, isOpen, onRequestClose }) => {
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL; 

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false); 

    useEffect(() => {
        if (!isOpen) {
            setTitle('');
            setContent('');
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return; // prevent multiple submissions if loading

        setLoading(true);

        try {
            const res = await axios.post(`${apiUrl}/diaries/entries/add`, {
                diaryId,
                title,
                content
            },
            { withCredentials: true }
            );

            if (res.data.success) {
                onRequestClose();
                const entryId = res.data.entryId;
                navigate(`/diary/${diaryId}/entries/${entryId}`);
            } else {
                console.error('error adding entry\n', res.data.message);
            }

        } catch (error) {
            console.error('error adding entry\n', error);
            toast.error('error adding entry!', { position: "bottom-right" });
        } finally {
            setLoading(false); 
        }
    };

    const isButtonDisabled = !title || !content || loading; 

    return (
        <div>
            <Modal
                isOpen={isOpen}
                onRequestClose={onRequestClose}
                contentLabel="Add entry modal"    
                overlayClassName="custom-modal-overlay" 
                className={`add-entry-modal-content ${loading ? 'modal-loading' : ''}`}  
            >
                <div className="add-entry-form">
                    <h3>Add new entry</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Title<span className="required-asterisk">*</span></label>
                            <input 
                                type="text" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                maxLength={100} // title character limit 
                                required 
                                disabled={loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Content<span className="required-asterisk">*</span></label>
                            <textarea 
                                value={content} 
                                onChange={(e) => setContent(e.target.value)} 
                                required 
                                disabled={loading}
                            />
                        </div>
                        <div className="button-group">
                            <button className="cancel-button" type="button" onClick={onRequestClose}>
                                cancel
                            </button>
                            <button className="submit-button" type="submit" disabled={isButtonDisabled}>
                                {loading ? 'submitting' : 'submit'} 
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default AddEntry;